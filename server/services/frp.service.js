import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class FrpService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getFrp(req) {
        const {
            composition,
            category,
            grade,
            resin
        } = req.query;

        const frpEntries = await prisma.frp.findMany({
            where: {
                ...(composition && { composition_id: composition }),
                ...(category && { category_id: category }),
                ...(grade && { grade_id: grade }),
                ...(resin && { resin_id: resin })
            },
            include: {
                composition: true,
                category: true,
                grade: true,
                resin: true
            }
        });

        if (!frpEntries.length)
            throw new ApiError(404, "No FRP entries found");

        return frpEntries;
    }
}

export const frpService = new FrpService(prisma);