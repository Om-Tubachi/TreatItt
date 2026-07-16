import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class ManufacturingProcessService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // when user selects one of the process from pre seeded, 
    async create(req) {
        const { manufacturingProcessName, manufacturingProcessDesc } = req.body;
        const userId = req.user?.id ?? null;

        if (!manufacturingProcessName)
            throw new ApiError(400, "Manufacturing process name is required");

        const manufacturingProcess = await prisma.manufacturing_processes.create({
            data: {
                user_id: userId,
                manufacturing_process_name: manufacturingProcessName,
                manufacturing_process_desc: manufacturingProcessDesc
            }
        });

        if (!manufacturingProcess)
            throw new ApiError(500, "Something went wrong while creating manufacturing process");

        return manufacturingProcess;
    }

    async getSystemDefaults(req) {
        // pre seeded with user id = null, this returns name description
        const manufacturingProcesses = await prisma.manufacturing_processes.findMany({
            where: { user_id: null }
        });

        if (!manufacturingProcesses.length)
            throw new ApiError(404, "No system default manufacturing processes found");

        return manufacturingProcesses;
    }

    async getManufacturingProcessById(req) {
        const { mpId } = req.params;

        if (!mpId)
            throw new ApiError(400, "Manufacturing process ID is required");

        const manufacturingProcess = await prisma.manufacturing_processes.findUnique({
            where: { id: mpId }
        });

        if (!manufacturingProcess)
            throw new ApiError(404, "Manufacturing process does not exist");

        return manufacturingProcess;
    }

    async getManufacturingProcessesByUser(req) {
        const { userId } = req.params;

        if (!userId)
            throw new ApiError(400, "User ID is required");

        const result = await prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"                    WHERE id      = ${userId}::uuid) AS user_exists,
                EXISTS(SELECT 1 FROM "manufacturing_processes"  WHERE user_id = ${userId}::uuid) AS processes_exist
        `;

        const { user_exists, processes_exist } = result[0];

        if (!user_exists || !processes_exist)
            throw new ApiError(409, "Either user does not exist or has no manufacturing processes");

        const manufacturingProcesses = await prisma.manufacturing_processes.findMany({
            where: { user_id: userId }
        });

        if (!manufacturingProcesses.length)
            throw new ApiError(500, "Something went wrong while fetching manufacturing processes");

        return manufacturingProcesses;
    }

    // §1.1 — per-process aggregate stats, computed from frp_wastes reverse relation.
    // Not part of the generic search system (§0 decision 1) — dedicated endpoint instead.
    async getManufacturingProcessStats(req) {
        const { mpId } = req.params;
        if (!mpId) throw new ApiError(400, "Manufacturing process ID is required");

        const wastes = await prisma.frp_wastes.findMany({
            where: { manufacturing_process_id: mpId },
            include: {
                frp: { include: { composition: true, category: true, grade: true, resin: true } },
                collectors: { include: { users: { select: { id: true, username: true, company_name: true } } } },
            }
        });

        if (!wastes.length) {
            return {
                totalQuantity: 0, listingCount: 0, avgPrice: null, minPrice: null, maxPrice: null,
                lifecycleBreakdown: {}, statusBreakdown: {}, compositionBreakdown: [], distinctCollectors: []
            };
        }

        const prices = wastes.map(w => w.price_per_kg).filter(p => p != null).map(Number);
        const lifecycleBreakdown = {};
        const statusBreakdown = {};
        const compositionMap = new Map(); // composition_id -> { name, count, quantity }
        const collectorMap = new Map();

        for (const w of wastes) {
            if (w.lifecycle_stage) lifecycleBreakdown[w.lifecycle_stage] = (lifecycleBreakdown[w.lifecycle_stage] || 0) + 1;
            if (w.status) statusBreakdown[w.status] = (statusBreakdown[w.status] || 0) + 1;
            const compId = w.frp?.composition?.id;
            if (compId) {
                const entry = compositionMap.get(compId) || { id: compId, name: w.frp.composition.composition_name, count: 0, quantity: 0 };
                entry.count += 1;
                entry.quantity += Number(w.quantity ?? 0);
                compositionMap.set(compId, entry);
            }
            const collUser = w.collectors?.users;
            if (collUser) collectorMap.set(collUser.id, collUser);
        }

        return {
            totalQuantity: wastes.reduce((s, w) => s + Number(w.quantity ?? 0), 0),
            listingCount: wastes.length,
            avgPrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
            minPrice: prices.length ? Math.min(...prices) : null,
            maxPrice: prices.length ? Math.max(...prices) : null,
            lifecycleBreakdown,
            statusBreakdown,
            compositionBreakdown: Array.from(compositionMap.values()),
            distinctCollectors: Array.from(collectorMap.values()),
        };
    }

    // §1.1 — index-level filtering: only return processes with ≥1 matching frp_waste
    // under the given filters. Mirrors wasteService.getWasteFilters' two-step pattern
    // (frp lookup, then frp_wastes lookup).
    async getFilteredManufacturingProcesses(req) {
        const { compositionId, categoryId, gradeId, resinId, priceMin, priceMax } = req.query;

        const hasFilters = compositionId || categoryId || gradeId || resinId || priceMin || priceMax;
        if (!hasFilters) return this.getSystemDefaults(req);

        const frps = await prisma.frp.findMany({
            where: {
                ...(compositionId && { composition_id: compositionId }),
                ...(categoryId && { category_id: categoryId }),
                ...(gradeId && { grade_id: gradeId }),
                ...(resinId && { resin_id: resinId }),
            },
            select: { id: true }
        });
        const frpIds = frps.map(f => f.id);

        const wastes = await prisma.frp_wastes.findMany({
            where: {
                ...(frpIds.length ? { frp_id: { in: frpIds } } : {}),
                ...((priceMin || priceMax) && {
                    price_per_kg: { ...(priceMin && { gte: parseFloat(priceMin) }), ...(priceMax && { lte: parseFloat(priceMax) }) }
                }),
                manufacturing_process_id: { not: null }
            },
            select: { manufacturing_process_id: true }
        });

        const mpIds = [...new Set(wastes.map(w => w.manufacturing_process_id))];
        if (!mpIds.length) throw new ApiError(404, "No manufacturing processes found for the given filters");

        return prisma.manufacturing_processes.findMany({ where: { id: { in: mpIds } } });
    }

    async updateManufacturingProcess(req) {
        const { mpId } = req.params;
        const updateData = req.body;

        if (!mpId)
            throw new ApiError(400, "Manufacturing process ID is required");

        const updatedProcess = await prisma.manufacturing_processes.update({
            where: { id: mpId },
            data: updateData
        });

        if (!updatedProcess)
            throw new ApiError(500, "Failed to update manufacturing process");

        return updatedProcess;
    }

    async deleteManufacturingProcess(req) {
        const { mpId } = req.params;

        if (!mpId)
            throw new ApiError(400, "Manufacturing process ID is required");

        await prisma.manufacturing_processes.delete({
            where: { id: mpId }
        });

        return { success: true, message: "Manufacturing process deleted" };
    }
}

export const manufacturingProcessService = new ManufacturingProcessService(prisma);
