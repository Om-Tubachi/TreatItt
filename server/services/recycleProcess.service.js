import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class RecycleProcessService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const userId = req.user.id;
        const {
            treatmentId,
            capacityKg,
            schedules,
            date,
            charges
        } = req.body;

        if (!treatmentId || !capacityKg)
            throw new ApiError(400, "Missing required fields");

        const result = await this.prisma.$queryRaw`
        SELECT
            EXISTS(SELECT 1 FROM "recyclers"   WHERE u_id = ${userId}::uuid)  AS recycler_exists,
            EXISTS(SELECT 1 FROM "treatments"  WHERE id   = ${treatmentId}::uuid) AS treatment_exists
    `;

        const { recycler_exists, treatment_exists } = result[0];

        if (!recycler_exists || !treatment_exists)
            throw new ApiError(409, "Invalid input: recycler or treatment does not exist");

        const recycleProcess = await this.prisma.recycler_processes.create({
            data: {
                recyclers: { connect: { u_id: userId } },
                treatments: { connect: { id: treatmentId } },
                schedules,
                date,
                capability_metrics: {
                    capacity_kg: capacityKg,
                    charges: charges ?? null
                }
            }
        });

        if (!recycleProcess)
            throw new ApiError(500, "Something went wrong while creating recycle process");

        return recycleProcess;
    }

    // §1.3 — fixed: previously had no include at all, so the detail screen (and
    // anything relying on recyclers/users or treatments/frp shape) got bare FK ids.
    // Now mirrors the include block already used in getAllRecycleProcesses.
    async getRecycleProcessById(req) {
        const { processId } = req.params;

        if (!processId)
            throw new ApiError(400, "Process ID is required");

        const recycleProcess = await this.prisma.recycler_processes.findUnique({
            where: { id: processId },
            include: {
                recyclers: {
                    include: {
                        users: { select: { id: true, username: true, first_name: true, last_name: true, company_name: true } }
                    }
                },
                treatments: {
                    include: {
                        frp: { include: { composition: true, category: true, grade: true, resin: true } },
                        treatment_processes: {
                            include: { treatment_methods: true }
                        }
                    }
                }
            }
        });

        if (!recycleProcess)
            throw new ApiError(404, "Recycle process does not exist");

        return recycleProcess;
    }

    async getRecycleProcessesByRecycler(req) {
        const { recyclerId } = req.params;

        if (!recyclerId)
            throw new ApiError(400, "Recycler ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "recyclers"          WHERE u_id        = ${recyclerId}::uuid) AS recycler_exists,
                EXISTS(SELECT 1 FROM "recycler_processes" WHERE recycler_id = ${recyclerId}::uuid) AS processes_exist
        `;

        const { recycler_exists, processes_exist } = result[0];

        if (!recycler_exists || !processes_exist)
            throw new ApiError(409, "Either recycler does not exist or has no recycle processes");

        const recycleProcesses = await this.prisma.$queryRaw`
            SELECT * FROM "recycler_processes" WHERE recycler_id = ${recyclerId}::uuid
        `;

        if (!recycleProcesses.length)
            throw new ApiError(500, "Something went wrong while fetching recycle processes");

        return recycleProcesses;
    }

    // slightly wrong - i made changes, well see afterwards if it works
    async getFilteredRecycleProcesses(req) {
        const {
            frp,
            capacity,
            charges,
            method
        } = req.query;

        const recycleProcesses = await this.prisma.recycler_processes.findMany({
            where: {
                ...((frp || method) && {
                    treatments: {
                        ...(frp && { frp_id: frp }),
                        ...(method && { treatment_processes: { method_id: method } })
                    }
                })
            },
            include: {
                recyclers: true,
                treatments: {
                    include: {
                        frp: {
                            include: {
                                category: true,
                                grade: true
                            }
                        },
                        treatment_processes: {
                            include: {
                                treatment_methods: true
                            }
                        }
                    }
                }
            }
        });

        const filtered = recycleProcesses.filter(p => {
            const metrics = p.capability_metrics || {};
            if (capacity && !(metrics.capacity_kg >= parseFloat(capacity))) return false;
            if (charges && !(metrics.charges <= parseFloat(charges))) return false;
            return true;
        });

        if (!filtered.length)
            throw new ApiError(404, "No recycle processes found for the given filters");

        return filtered;
    }

    async updateRecycleProcess(req) {
        const { processId } = req.params;
        const updateData = req.body;

        if (!processId)
            throw new ApiError(400, "Process ID is required");

        if (!updateData || !Object.keys(updateData).length)
            throw new ApiError(400, "No update data provided");

        const existing = await this.prisma.recycler_processes.findUnique({
            where: { id: processId },
            select: { capability_metrics: true }
        });

        if (!existing)
            throw new ApiError(404, "Recycle process does not exist");

        const mergedMetrics = {
            ...(existing.capability_metrics || {}),
            ...(updateData.capacityKg !== undefined && { capacity_kg: updateData.capacityKg }),
            ...(updateData.charges !== undefined && { charges: updateData.charges })
        };

        const updatedProcess = await this.prisma.recycler_processes.update({
            where: { id: processId },
            data: {
                ...(updateData.treatmentId !== undefined && { treatments: { connect: { id: updateData.treatmentId } } }),
                ...(updateData.schedules !== undefined && { schedules: updateData.schedules }),
                ...(updateData.date !== undefined && { date: updateData.date }),
                ...((updateData.capacityKg !== undefined || updateData.charges !== undefined) && { capability_metrics: mergedMetrics }),
                updatedat: new Date()
            }
        });

        if (!updatedProcess)
            throw new ApiError(500, "Failed to update recycle process");

        return updatedProcess;
    }

    async deleteRecycleProcess(req) {
        const { processId } = req.params;

        if (!processId)
            throw new ApiError(400, "Process ID is required");

        await this.prisma.recycler_processes.delete({
            where: { id: processId }
        });

        return { success: true, message: "Recycle process deleted" };
    }

    async getAllRecycleProcesses(req) {
        const processes = await this.prisma.recycler_processes.findMany({
            include: {
                recyclers: {
                    include: {
                        users: { select: { id: true, username: true, first_name: true, last_name: true, company_name: true } }
                    }
                },
                treatments: {
                    include: {
                        frp: { include: { composition: true, category: true, grade: true, resin: true } },
                        treatment_processes: {
                            include: { treatment_methods: true }
                        }
                    }
                }
            }
        });
        return processes;
    }
}

export const recycleProcessService = new RecycleProcessService(prisma);
