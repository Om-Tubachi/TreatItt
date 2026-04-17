/* eslint-disable no-undef */
import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class RecycleProcessService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const {
            recyclerId,
            treatmentId,
            capacityKg,
            schedules,
            date,
            charges
        } = req.body;

        if ([recyclerId, treatmentId].some(f => !f) || !capacityKg) {
            throw new ApiError(400, "Missing required fields");
        }

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "recyclers"   WHERE u_id = ${recyclerId}::uuid)  AS recycler_exists,
                EXISTS(SELECT 1 FROM "treatments"  WHERE id   = ${treatmentId}::uuid) AS treatment_exists
        `;

        const { recycler_exists, treatment_exists } = result[0];

        if (!recycler_exists || !treatment_exists)
            throw new ApiError(409, "Invalid input: recycler or treatment does not exist");

        const recycleProcess = await this.prisma.recycler_processes.create({
            data: {
                recycler_id: recyclerId,
                treatment_id: treatmentId,
                capacity_kg: capacityKg,
                schedules,
                date,
                charges
            }
        });

        if (!recycleProcess)
            throw new ApiError(500, "Something went wrong while creating recycle process");

        return recycleProcess;
    }

    async getRecycleProcessById(req) {
        const { processId } = req.params;

        if (!processId)
            throw new ApiError(400, "Process ID is required");

        const recycleProcess = await this.prisma.recycler_processes.findUnique({
            where: { id: processId }
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


        // let treatmentIds;
        // if (method) {
        //     const matchingTreatments = await this.prisma.treatments.findMany({
        //         where: {
        //             treatment_processes: {
        //                 treatment_methods: {
        //                     method: { equals: method, mode: 'insensitive' }
        //                 }
        //             },
        //             ...(frp && { frp_id: frp })
        //         },
        //         select: { id: true }
        //     });

        //     treatmentIds = matchingTreatments.map(t => t.id);

        //     // no treatments matched — return empty rather than unfiltered results
        //     if (!treatmentIds.length)
        //         return [];
        // } else if (frp) {
        //     // filter by frp only, no method constraint
        //     const matchingTreatments = await this.prisma.treatments.findMany({
        //         where: { frp_id: frp },
        //         select: { id: true }
        //     });

        //     treatmentIds = matchingTreatments.map(t => t.id);

        //     if (!treatmentIds.length)
        //         return [];
        // }

        // const recycleProcesses = await this.prisma.recycler_processes.findMany({
        //     where: {
        //         ...(treatmentIds && { treatment_id: { in: treatmentIds } }),
        //         ...(capacity && { capacity_kg: { gte: parseFloat(capacity) } }),
        //         ...(charges  && { charges:     { lte: parseFloat(charges)  } })
        //     },
        //     include: {
        //         recyclers: true,
        //         treatments: {
        //             include: {
        //                 treatment_processes: {
        //                     include: {
        //                         treatment_methods: true
        //                     }
        //                 },
        //                 frp: {
        //                     include: {
        //                         category: true,
        //                         grade:    true
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // });


        // by method id, frp id

        const recycleProcesses = await this.prisma.recycler_processes.findMany({
            where: {
                ...(capacity && { capacity_kg: { gte: parseFloat(capacity) } }),
                ...(charges && { charges: { lte: parseFloat(charges) } }),
                ...(frp && {
                    treatments: {
                        frp_id: frp
                    }
                }),
                ...(method && {
                    treatments: {
                        treatment_processes: {
                            method_id: method
                        }
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



        if (!recycleProcesses.length)
            throw new ApiError(404, "No recycle processes found for the given filters");

        return recycleProcesses;
    }

    async updateRecycleProcess(req) {
        const { processId } = req.params;
        const updateData = req.body;

        if (!processId)
            throw new ApiError(400, "Process ID is required");

        const updatedProcess = await this.prisma.recycler_processes.update({
            where: { id: processId },
            data: updateData
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
}

export const recycleProcessService = new RecycleProcessService(prisma);