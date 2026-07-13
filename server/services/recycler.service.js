import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class RecyclerService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async register(req) {
        const userId = req.user.id;
        const { address } = req.body;

        const result = await this.prisma.$queryRaw`
        SELECT
            EXISTS(SELECT 1 FROM "users"     WHERE id    = ${userId}::uuid) AS user_exists,
            EXISTS(SELECT 1 FROM "recyclers" WHERE u_id  = ${userId}::uuid) AS already_registered
    `;

        const { user_exists, already_registered } = result[0];

        if (!user_exists) throw new ApiError(404, "User not found");
        if (already_registered) throw new ApiError(409, "User is already registered as a recycler");

        const recycler = await this.prisma.recyclers.create({
            data: {
                users: { connect: { id: userId } },
                address
            }
        });

        if (!recycler)
            throw new ApiError(500, "Something went wrong while registering recycler");

        return recycler;
    }

    async getAllRecyclers(req) {
        const recyclers = await this.prisma.recyclers.findMany();

        if (!recyclers.length)
            throw new ApiError(500, "Something went wrong while fetching recyclers");

        return recyclers;
    }

    async getRecyclerById(req) {
        // recycler id is the same as user id since they are in one-to-one relationship
        const { recyclerId } = req.params;

        if (!recyclerId) throw new ApiError(400, "Recycler ID is required");

        const recycler = await this.prisma.recyclers.findUnique({
            where: { u_id: recyclerId }
        });

        if (!recycler) throw new ApiError(404, "Recycler not found");

        return recycler;
    }

    async getFilteredRecyclers(req) {
    const { frp, capacity, charges, treatment_process } = req.query;

    const recyclers = await this.prisma.recyclers.findMany({
        where: {
            ...((frp || treatment_process) && {
                recycler_processes: {
                    some: {
                        treatments: {
                            ...(frp && { frp_id: frp }),
                            ...(treatment_process && { treatment_process_id: treatment_process })
                        }
                    }
                }
            })
        },
        select: {
            id: true,
            address: true,
            recycler_processes: {
                where: {
                    ...((frp || treatment_process) && {
                        treatments: {
                            ...(frp && { frp_id: frp }),
                            ...(treatment_process && { treatment_process_id: treatment_process })
                        }
                    })
                },
                select: {
                    capability_metrics: true,
                    schedules: true,
                    treatments: {
                        select: {
                            frp: {
                                select: {
                                    id: true,
                                    description: true
                                }
                            },
                            treatment_processes: {
                                select: {
                                    process: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const filtered = recyclers
        .map(r => ({
            ...r,
            recycler_processes: r.recycler_processes.filter(p => {
                const metrics = p.capability_metrics || {};
                if (capacity && !(metrics.capacity_kg >= Number(capacity))) return false;
                if (charges && !(metrics.charges <= Number(charges))) return false;
                return true;
            })
        }))
        .filter(r => r.recycler_processes.length > 0 || (!capacity && !charges));

    if (!filtered.length) throw new ApiError(404, "No recyclers found");

    return filtered;
}
}

export const recyclerService = new RecyclerService(prisma);