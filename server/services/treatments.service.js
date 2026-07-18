import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

const FRP_SELECT = {
    id: true,
    description: true,
    composition: { select: { composition_name: true } },
    category: { select: { category_name: true } }
};

// recycler_id on `treatments` is the user's id directly — same convention as
// treatment_processes and recycler_processes — so this is what powers the
// "My Treatments" tab and card attribution on the picker screen
const RECYCLER_SELECT = {
    select: { id: true, username: true, first_name: true, last_name: true, company_name: true }
};

const TREATMENT_SELECT = {
    id: true,
    recycler_id: true,
    frp: { select: FRP_SELECT },
    users: RECYCLER_SELECT,
    treatment_processes: {
        select: {
            process: true,
            treatment_methods: {
                select: { id: true, method: true }
            }
        }
    }
};

class TreatmentService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const recyclerId = req.user.id;
        const { treatmentProcessId, frpId } = req.body;

        if (!treatmentProcessId || !frpId)
            throw new ApiError(400, "Missing required fields");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"               WHERE id = ${recyclerId}::uuid)        AS user_exists,
                EXISTS(SELECT 1 FROM "treatment_processes" WHERE id = ${treatmentProcessId}::uuid) AS treatment_process_exists,
                EXISTS(SELECT 1 FROM "frp"                 WHERE id = ${frpId}::uuid)              AS frp_exists
        `;

        const { user_exists, treatment_process_exists, frp_exists } = result[0];

        if (!user_exists) throw new ApiError(404, "User not found");
        if (!treatment_process_exists) throw new ApiError(409, "Treatment process does not exist");
        if (!frp_exists) throw new ApiError(409, "FRP does not exist");

        const treatment = await this.prisma.treatments.create({
            data: {
                recycler_id: recyclerId,
                treatment_process_id: treatmentProcessId,
                frp_id: frpId
            },
            select: TREATMENT_SELECT
        });

        if (!treatment)
            throw new ApiError(500, "Something went wrong while creating treatment");

        return treatment;
    }

    async getAllTreatments(req) {
        const treatments = await this.prisma.treatments.findMany({ select: TREATMENT_SELECT });

        if (!treatments.length)
            throw new ApiError(500, "Something went wrong while fetching treatments");

        return treatments;
    }

    async getTreatmentById(req) {
        const { treatmentId } = req.params;

        if (!treatmentId) throw new ApiError(400, "Treatment ID is required");

        const treatment = await this.prisma.treatments.findUnique({
            where: { id: treatmentId },
            select: TREATMENT_SELECT
        });

        if (!treatment) throw new ApiError(404, "Treatment not found");

        return treatment;
    }

    async getTreatmentsByRecycler(req) {
        const { recyclerId } = req.params;

        if (!recyclerId) throw new ApiError(400, "Recycler ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"      WHERE id          = ${recyclerId}::uuid) AS user_exists,
                EXISTS(SELECT 1 FROM "treatments" WHERE recycler_id = ${recyclerId}::uuid) AS has_treatments
        `;

        const { user_exists, has_treatments } = result[0];

        if (!user_exists) throw new ApiError(404, "User not found");
        if (!has_treatments) throw new ApiError(404, "No treatments found for this recycler");

        const treatments = await this.prisma.treatments.findMany({
            where: { recycler_id: recyclerId },
            select: TREATMENT_SELECT
        });

        if (!treatments.length)
            throw new ApiError(500, "Something went wrong while fetching treatments");

        return treatments;
    }

    async getFilteredTreatments(req) {
        const { frp, method } = req.query;

        const treatments = await this.prisma.treatments.findMany({
            where: {
                ...(frp && { frp_id: frp }),
                ...(method && {
                    treatment_processes: { method_id: method }
                })
            },
            select: TREATMENT_SELECT
        });

        if (!treatments.length)
            throw new ApiError(404, "No treatments found matching the given filters");

        return treatments;
    }

    async updateTreatment(req) {
        const { treatmentId } = req.params;
        const updateData = req.body;

        if (!treatmentId) throw new ApiError(400, "Treatment ID is required");

        const updatedTreatment = await this.prisma.treatments.update({
            where: { id: treatmentId },
            data: updateData,
            select: TREATMENT_SELECT
        });

        if (!updatedTreatment)
            throw new ApiError(500, "Failed to update treatment");

        return updatedTreatment;
    }

    async deleteTreatment(req) {
        const { treatmentId } = req.params;

        if (!treatmentId) throw new ApiError(400, "Treatment ID is required");

        await this.prisma.treatments.delete({
            where: { id: treatmentId }
        });

        return { success: true, message: "Treatment deleted" };
    }
}

export const treatmentService = new TreatmentService(prisma);