

import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError';

class WasteService {
    constructor(prisma) {
        this.prisma = prisma
    }

    async create(req) {
        const {
            userId,
            frpId,
            manufacturingProcessId,
            collectorId,
            quantity,
            date
        } = req.body

        if ([userId, frpId, manufacturingProcessId].some(f => !f) || !quantity) {
            throw new ApiError(409, "Missing required fields")
        }

        const result = await this.prisma.$queryRaw`SELECT
    EXISTS(SELECT 1 FROM "users"     WHERE id = ${userId}::uuid)    AS user_exists,
    EXISTS(SELECT 1 FROM "frp"  WHERE id = ${frpId}::uuid)  AS frp_exists,
    EXISTS(SELECT 1 FROM "manufacturing_processes" WHERE id = ${manufacturingProcessId}::uuid) AS manufacturingProcess_exists
`;

        const { user_exists, frp_exists, manufacturingProcess_exists } = result[0];

        if (!user_exists || !frp_exists || !manufacturingProcess_exists)
            throw new ApiError(409, "invalid input for user or frp or manufacturing quantity")

        const payload = {
            userId,
            manufacturingProcessId,
            frpId,
            collectorId,
            quantity,
            date,
            status: 'un-processed'
        }

        const wasteEntry = await this.prisma.frp_wastes.create({
            data: { ...payload }
        })

        if (!wasteEntry)
            throw new ApiError(500, "Something went wrong while uploading waste")

        return wasteEntry

    }

    async getWasteById(req) {
        const { id } = req.params

        if (!id)
            throw new ApiError(400, "Waste entry ID is required")

        const wasteEntry = await this.prisma.frp_wastes.findUnique({
            where: { id: id }
        })

        if (!wasteEntry)
            throw new ApiError(400, "Waste entry does not exist in the database")

        return wasteEntry
    }

    // paginate this
    async getWasteEntriesOfUser(req) {
        const { userId } = req.params

        if (!userId)
            throw new ApiError(400, "user id required is required")

        const results = await this.prisma.$queryRaw`
            select exists(select 1 from "users" where id = ${userId} :: uuid) as userInUsers,
             exists(select 1 from "frp_wastes" where u_id = ${userId} :: uuid) as userInWastes,

        `

        const { userInUsers, userInWastes } = results[0]

        if (!userInUsers || !userInWastes)
            throw new ApiError(409, "Either user is not registered on the platform or user has no waste entries")


        const wasteEntries = await this.prisma.$queryRaw`
            select * from "frp_wastes" where u_id = ${userId}
        `

        /**
         * 
         * alternatively: 
         * 
         * prisma.findMany({
         * where: {u_id: userId}
         * })
         */
        if (!wasteEntries.length)
            throw new ApiError(500, "Something went wrong while fetching waste entries")

        return wasteEntries
    }

    // paginate this
    async getAllWasteEntries(req) {
        const wasteEntries = await this.prisma.frp_wastes.findMany()

        if (!wasteEntries.lengt)
            throw new ApiError(500, "Something went wrong while fetching waste entries")

        return wasteEntries
    }

    async getWasteEntriesByFrp(req) {
        const { frpId } = req.params

        if (!frpId)
            throw new ApiError(400, "frp id is required")

        const results = await this.prisma.$queryRaw`
        select
            exists(select 1 from "frp" where id = ${frpId}::uuid) as frpExists,
            exists(select 1 from "frp_wastes" where frp_id = ${frpId}::uuid) as frpInWastes
    `

        const { frpExists, frpInWastes } = results[0]

        if (!frpExists || !frpInWastes)
            throw new ApiError(409, "Either frp does not exist or has no waste entries")

        const wasteEntries = await this.prisma.$queryRaw`
        select * from "frp_wastes" where frp_id = ${frpId}::uuid
    `

        if (!wasteEntries.length)
            throw new ApiError(500, "Something went wrong while fetching waste entries")

        return wasteEntries
    }

    async getWasteFilters(req) {
        const {
            status = 'un-processed',
            collectorId,
            categoryId,
            gradeId
        } = req.queryParams

        const frpIds = await this.prisma.frp.findMany({
            where: {
                where: {
                    ...(categoryId && {
                        category_id: categoryId
                    }),
                    ...(gradeId && {
                        grade_id: gradeId
                    }),
                }
            }
        })

        // ?????????????????????????????????????????????
        const wasteEntries = await this.prisma.frp_wastes.findMany({
            where: {
                status,
                ...(frpIds && { frp_id: { in: frpIds } }),
                ...(collectorId && { collector_id: collectorId })
            },
            include: {
                collectors: true,  // null if no collector_id
                frp: {
                    include: {
                        category: true,
                        grade: true
                    }
                }
            }
        })

        // alternative
        /**
         * 
         * SELECT fw.*, c.address, c.latitude
FROM frp_wastes fw
LEFT JOIN frp f ON f.id = fw.frp_id
LEFT JOIN collectors c ON c.id = fw.collector_id
WHERE fw.status = 'un-processed'
AND (f.category_id = $1 OR $1 IS NULL)
AND (f.grade_id = $2 OR $2 IS NULL)
         */

        if (!wasteEntries.lengt)
            throw new ApiError(500, "Something went wrong while fetching waste entries")

        return wasteEntries
    }

    async updateWaste(req) {
        const { wasteId } = req.params;
        const updateData = req.body;

        if (!wasteId) throw new ApiError(400, "Waste ID is required");

        const updatedWaste = await this.prisma.frp_wastes.update({
            where: { id: wasteId },
            data: updateData
        });

        if (!updatedWaste) {
            throw new ApiError(500, "Failed to update waste entry");
        }

        return updatedWaste;
    }

    async deleteWaste(req) {
        const { wasteId } = req.params;

        if (!wasteId) throw new ApiError(400, "Waste ID is required");

        await this.prisma.frp_wastes.delete({
            where: { id: wasteId }
        });

        return { success: true, message: "Waste entry deleted" };
    }
}

export const wasteService = new WasteService(prisma)