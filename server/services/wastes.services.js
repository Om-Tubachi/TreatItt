import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { lookupSyncService } from './lookupSync.service.js';

class WasteService {
    constructor(prisma) {
        this.prisma = prisma
    }

    async create(req) {
        const userId = req?.user?.id
        const {
            frpId,
            manufacturingProcessId,
            collectorId,
            quantity,
            date,
            lifecycleStage,
            latitude,
            longitude,
            pricePerKg,
            form
        } = req.body

        if ([userId, frpId, manufacturingProcessId].some(f => !f) || !quantity) {
            throw new ApiError(409, "Missing required fields")
        }

        const result = await this.prisma.$queryRaw`SELECT
    EXISTS(SELECT 1 FROM "users"     WHERE id = ${userId}::uuid)    AS user_exists,
    EXISTS(SELECT 1 FROM "frp"  WHERE id = ${frpId}::uuid)  AS frp_exists,
    EXISTS(SELECT 1 FROM "manufacturing_processes" WHERE id = ${manufacturingProcessId}::uuid) AS manufacturingprocess_exists
`;

        const { user_exists, frp_exists, manufacturingprocess_exists } = result[0];
        if (!user_exists || !frp_exists || !manufacturingprocess_exists)
            throw new ApiError(409, "invalid input for user or frp or manufacturing quantity")

        const payload = {
            u_id: userId,
            manufacturing_process_id: manufacturingProcessId,
            frp_id: frpId,
            collector_id: collectorId,
            quantity,
            date,
            status: 'un-processed',
            lifecycle_stage: lifecycleStage ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            price_per_kg: pricePerKg ?? null,
            form: form ?? null
        }

        const wasteEntry = await this.prisma.frp_wastes.create({
            data: { ...payload }
        })

        if (!wasteEntry)
            throw new ApiError(500, "Something went wrong while uploading waste")
        await lookupSyncService.syncLookupEntry('waste', wasteEntry.id)
        return wasteEntry
    }

    async getWasteById(req) {
        const { wasteId: id } = req.params

        if (!id)
            throw new ApiError(400, "Waste entry ID is required")

        const wasteEntry = await this.prisma.frp_wastes.findUnique({
            where: { id },
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                users: { select: { id: true, username: true } }, // Moved to top level
                manufacturing_processes: {
                    include: {
                        users: { select: { id: true, username: true } }
                    }
                },
                collectors: true
            }
        })

        if (!wasteEntry)
            throw new ApiError(400, "Waste entry does not exist in the database")

        return wasteEntry
    }

    async getWasteEntriesOfUser(req) {
        const { userId } = req.params

        if (!userId)
            throw new ApiError(400, "user id required is required")

        const results = await this.prisma.$queryRaw`
            select exists(select 1 from "users" where id = ${userId} :: uuid) as user_in_users,
             exists(select 1 from "frp_wastes" where u_id = ${userId} :: uuid) as user_in_wastes;
        `

        const { user_in_users, user_in_wastes } = results[0]

        if (!user_in_users || !user_in_wastes)
            throw new ApiError(409, "Either user is not registered on the platform or user has no waste entries")

        const wasteEntries = await this.prisma.frp_wastes.findMany({
            where: { u_id: userId },
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                users: { select: { id: true, username: true } }, // Corrected location
                manufacturing_processes: {
                    include: {
                        users: { select: { id: true, username: true } }
                    }
                },
                collectors: true
            }
        });

        return wasteEntries
    }

    async getAllWasteEntries(req) {
        const wasteEntries = await this.prisma.frp_wastes.findMany({
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                users: { select: { id: true, username: true } }, // Corrected location
                manufacturing_processes: {
                    include: {
                        users: { select: { id: true, username: true } }
                    }
                },
                collectors: true
            }
        })

        return wasteEntries
    }

    async getWasteEntriesByFrp(req) {
        const { frpId } = req.params

        if (!frpId)
            throw new ApiError(400, "frp id is required")

        const results = await this.prisma.$queryRaw`
    SELECT
        EXISTS(SELECT 1 FROM "frp" WHERE id = ${frpId}::uuid) AS frp_exists,
        EXISTS(SELECT 1 FROM "frp_wastes" WHERE frp_id = ${frpId}::uuid) AS frp_in_wastes
`

        const { frp_exists, frp_in_wastes } = results[0]

        if (!frp_exists || !frp_in_wastes)
            throw new ApiError(409, "Either frp does not exist or has no waste entries")

        const wasteEntries = await this.prisma.frp_wastes.findMany({
            where: { frp_id: frpId },
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                users: { select: { id: true, username: true } }, // Corrected location
                manufacturing_processes: {
                    include: {
                        users: { select: { id: true, username: true } }
                    }
                },
                collectors: true
            }
        });

        return wasteEntries
    }

    async getWasteFilters(req) {
        const {
            status = 'un-processed',
            collectorId,
            categoryId,
            gradeId
        } = req.query

        const frps = await this.prisma.frp.findMany({
            where: {
                ...(categoryId && {
                    category_id: categoryId
                }),
                ...(gradeId && {
                    grade_id: gradeId
                }),
            }
        })
        const frpIds = frps.map((frp) => frp.id)
        const wasteEntries = await this.prisma.frp_wastes.findMany({
            where: {
                status,
                ...(frpIds.length > 0 && { frp_id: { in: frpIds } }),
                ...(collectorId && { collector_id: collectorId })
            },
            include: {
                collectors: true,
                users: { select: { id: true, username: true } }, // Corrected location
                frp: {
                    include: {
                        category: {
                            select: { id: true, category_name: true }
                        },
                        grade: {
                            select: { id: true, grade_name: true }
                        }
                    }
                }
            }
        })

        return wasteEntries
    }

    async updateWaste(req) {
        const { wasteId } = req.params, userId = req?.user?.id;
        const { form, pricePerKg, longitude, latitude, lifecycleStage, frpId, manufacturingProcessId, collectorId, quantity, date, status } = req.body;

        if (!wasteId) throw new ApiError(400, "Waste ID is required");

        const updatedWaste = await this.prisma.frp_wastes.update({
            where: { id: wasteId },
            data: {
                ...(frpId && { frp_id: frpId }),
                ...(manufacturingProcessId && { manufacturing_process_id: manufacturingProcessId }),
                ...(collectorId && { collector_id: collectorId }),
                ...(userId && { u_id: userId }),
                ...(quantity && { quantity: parseFloat(quantity) }),
                ...(date && { date }),
                ...(status && { status }),
                ...(lifecycleStage && { lifecycle_stage: lifecycleStage }),
                ...(latitude && { latitude }),
                ...(longitude && { longitude }),
                ...(pricePerKg && { price_per_kg: pricePerKg }),
                ...(form && { form }),
                updatedat: new Date()
            }
        });

        if (!updatedWaste) throw new ApiError(500, "Failed to update waste entry");
        await lookupSyncService.syncLookupEntry('waste', wasteId)
        return updatedWaste;
    }

    async deleteWaste(req) {
        const { wasteId } = req.params;

        if (!wasteId) throw new ApiError(400, "Waste ID is required");

        await this.prisma.frp_wastes.delete({
            where: { id: wasteId }
        });
        await lookupSyncService.deleteLookupEntry('waste', wasteId)
        return { success: true, message: "Waste entry deleted" };
    }
}

export const wasteService = new WasteService(prisma)