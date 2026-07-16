import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class FrpService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getFrp(req) {
        const entries = await this.prisma.frp.findMany({
            include: {
                composition: true,
                category: true,
                grade: true,
                resin: true,
                // §3.2 — lets the frontend derive distinct treatment_methods.method per
                // composition without extra round trips; useFrp()'s untouched `select`
                // still forwards this through rawEntries since that field passes data
                // through unmodified.
                treatments: {
                    include: {
                        treatment_processes: {
                            include: { treatment_methods: true }
                        }
                    }
                }
            }
        });

        if (!entries.length)
            throw new ApiError(404, "No FRP entries found");

        return entries;
    }
}

export const frpService = new FrpService(prisma);