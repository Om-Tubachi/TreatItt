import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class TreatmentMethodService {
    constructor(prisma) { this.prisma = prisma; }

    async getAllTreatmentMethods() {
        const methods = await this.prisma.treatment_methods.findMany();
        if (!methods.length) throw new ApiError(404, "No treatment methods found");
        return methods;
    }
}

export const treatmentMethodService = new TreatmentMethodService(prisma);