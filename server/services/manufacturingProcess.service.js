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