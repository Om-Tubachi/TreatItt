import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class TreatmentProcessService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const recyclerId = req.user.id;
        const { methodId, process } = req.body;

        if (!methodId || !process)
            throw new ApiError(400, "Missing required fields");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "recyclers"             WHERE u_id = ${recyclerId}::uuid) AS user_exists,
                EXISTS(SELECT 1 FROM "treatment_methods" WHERE id = ${methodId}::uuid)  AS method_exists
        `;

        const { user_exists, method_exists } = result[0];

        if (!user_exists)  throw new ApiError(404, "User not registered as a recycler");
        if (!method_exists) throw new ApiError(409, "Invalid treatment method");

        const treatmentProcess = await this.prisma.treatment_processes.create({
            data: {
                recycler_id: recyclerId,
                method_id:   methodId,
                process
            }
        });

        if (!treatmentProcess)
            throw new ApiError(500, "Something went wrong while creating treatment process");

        return treatmentProcess;
    }

    async getAllTreatmentProcesses(req) {
        const treatmentProcesses = await this.prisma.treatment_processes.findMany();

        if (!treatmentProcesses.length)
            throw new ApiError(500, "Something went wrong while fetching treatment processes");

        return treatmentProcesses;
    }

    async getTreatmentProcessById(req) {
        const { tpId } = req.params;

        if (!tpId) throw new ApiError(400, "Treatment process ID is required");

        const treatmentProcess = await this.prisma.treatment_processes.findUnique({
            where: { id: tpId }
        });

        if (!treatmentProcess) throw new ApiError(404, "Treatment process not found");

        return treatmentProcess;
    }

    async getTreatmentProcessesByRecycler(req) {
        const { recyclerId } = req.params;

        if (!recyclerId) throw new ApiError(400, "Recycler ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"               WHERE id          = ${recyclerId}::uuid) AS user_exists,
                EXISTS(SELECT 1 FROM "treatment_processes" WHERE recycler_id = ${recyclerId}::uuid) AS has_processes
        `;

        const { user_exists, has_processes } = result[0];

        if (!user_exists)   throw new ApiError(404, "User not found");
        if (!has_processes) throw new ApiError(404, "No treatment processes found for this recycler");

        const treatmentProcesses = await this.prisma.treatment_processes.findMany({
            where: { recycler_id: recyclerId }
        });

        if (!treatmentProcesses.length)
            throw new ApiError(500, "Something went wrong while fetching treatment processes");

        return treatmentProcesses;
    }

    async updateTreatmentProcess(req) {
        const { tpId } = req.params;
        const updateData = req.body;

        if (!tpId) throw new ApiError(400, "Treatment process ID is required");

        const updatedProcess = await this.prisma.treatment_processes.update({
            where: { id: tpId },
            data: updateData
        });

        if (!updatedProcess)
            throw new ApiError(500, "Failed to update treatment process");

        return updatedProcess;
    }

    async deleteTreatmentProcess(req) {
        const { tpId } = req.params;

        if (!tpId) throw new ApiError(400, "Treatment process ID is required");

        await this.prisma.treatment_processes.delete({
            where: { id: tpId }
        });

        return { success: true, message: "Treatment process deleted" };
    }
}

export const treatmentProcessService = new TreatmentProcessService(prisma);