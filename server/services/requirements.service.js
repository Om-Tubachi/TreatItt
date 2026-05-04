import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class RequirementsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const userId = req?.user?.id
        const {
            frpId,
            estReqPerMonth,
            actReqPerMonth,
            date
        } = req.body;

        if ([userId, frpId].some(f => !f) || !estReqPerMonth)
            throw new ApiError(400, "Missing required fields: userId, frpId, estReqPerMonth");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users" WHERE id = ${userId}::uuid) AS user_exists,
                EXISTS(SELECT 1 FROM "frp"   WHERE id = ${frpId}::uuid)  AS frp_exists
        `;

        const { user_exists, frp_exists } = result[0];

        if (!user_exists || !frp_exists)
            throw new ApiError(409, "Invalid input: user or frp does not exist");

        const requirementEntry = await this.prisma.frp_requirements.create({
            data: {
                u_id: userId,
                frp_id: frpId,
                est_req_per_month: estReqPerMonth,
                act_req_per_month: actReqPerMonth ?? null,
                date: date ?? null,
                status: 'open'
            }
        });

        if (!requirementEntry)
            throw new ApiError(500, "Something went wrong while creating requirement");

        return requirementEntry;
    }

    async getRequirementById(req) {
        const { id } = req.params;

        if (!id)
            throw new ApiError(400, "Requirement ID is required");

        const requirementEntry = await this.prisma.frp_requirements.findUnique({
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
                users: {
                    select: {
                        id: true,
                        username: true,
                        first_name: true,
                        last_name: true,
                        company_name: true
                    }
                }
            }
        });

        if (!requirementEntry)
            throw new ApiError(404, "Requirement entry does not exist");

        return requirementEntry;
    }

    // paginate this
    async getRequirementsByUser(req) {
        const { userId } = req?.params

        if (!userId)
            throw new ApiError(400, "User ID is required");

        const results = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"            WHERE id    = ${userId}::uuid) AS user_in_users,
                EXISTS(SELECT 1 FROM "frp_requirements" WHERE u_id  = ${userId}::uuid) AS user_in_requirements
        `;

        const { user_in_users, user_in_requirements } = results[0];

        if (!user_in_users || !user_in_requirements)
            throw new ApiError(409, "Either user is not registered or has no requirement entries");

        // fetch entries — fill in

        const userRequirements = await this.prisma.frp_requirements.findMany({
            where: { u_id: userId },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        first_name: true,
                        last_name: true,
                        company_name: true
                    }
                },
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true

                    }
                }
            }

        })

        // if (!userRequirements.length)
        //     throw new ApiError(500, "failed to fetch user requirements");

        return userRequirements

    }

    // paginate this
    async getRequirementsByFrp(req) {
        const { frpId } = req.params;

        if (!frpId)
            throw new ApiError(400, "FRP ID is required");

        const results = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "frp"              WHERE id     = ${frpId}::uuid) AS frpExists,
                EXISTS(SELECT 1 FROM "frp_requirements" WHERE frp_id = ${frpId}::uuid) AS frpInRequirements
        `;

        const { frpExists, frpInRequirements } = results[0];

        if (!frpExists || !frpInRequirements)
            throw new ApiError(409, "Either frp does not exist or has no requirement entries");

        const frp = await this.prisma.frp_requirements.findMany({
            where: {
                frp_id: frpId
            },
            include: {
                frp: {
                    include: {
                        category: true,
                        composition: true,
                        grade: true,
                        resin: true
                    }
                }
            }
        })

        if (!frp.length)
            throw new ApiError(500, "Failed to retrieve requirements quoted by user by frp");

        return frp

    }

    // paginate this
    async getAllRequirements(req) {
        const requirements = await this.prisma.frp_requirements.findMany();

        if (!requirements.length)
            throw new ApiError(404, "No requirement entries found");

        return requirements;
    }

    async getRequirementFilters(req) {
        const {
            status,
            categoryId,
            gradeId
        } = req.query;

        const frpIds = await this.prisma.frp.findMany({
            where: {
                ...(categoryId && { category_id: categoryId }),
                ...(gradeId && { grade_id: gradeId }),
            },
            select: { id: true }
        });

        const idList = frpIds.map(f => f.id);

        const filteredReq = await this.prisma.frp_requirements.findMany({
            where: {
                AND: [
                    { status },
                    ...(idList.length ? [{ frp_id: { in: idList } }] : [])
                ]
            }
        });

        if (!filteredReq.length)
            throw new ApiError(404, "No requirement entries found for given filters");

        return filteredReq;
    }

    async updateRequirement(req) {
        const { requirementId } = req.params;
        const updateData = req.body;

        if (!requirementId)
            throw new ApiError(400, "Requirement ID is required");

        const updatedRequirement = await this.prisma.frp_requirements.update({
            where: { id: requirementId },
            data: updateData
        });

        if (!updatedRequirement)
            throw new ApiError(500, "Failed to update requirement entry");

        return updatedRequirement;
    }

    async deleteRequirement(req) {
        const { requirementId } = req.params;

        if (!requirementId)
            throw new ApiError(400, "Requirement ID is required");

        await this.prisma.frp_requirements.delete({
            where: { id: requirementId }
        });

        return { success: true, message: "Requirement entry deleted" };
    }
}

export const requirementsService = new RequirementsService(prisma);