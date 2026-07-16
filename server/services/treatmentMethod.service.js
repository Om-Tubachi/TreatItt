import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class TreatmentMethodService {
    constructor(prisma) { this.prisma = prisma; }

    async getAllTreatmentMethods() {
        const methods = await this.prisma.treatment_methods.findMany();
        if (!methods.length) throw new ApiError(404, "No treatment methods found");
        return methods;
    }

    // §1.2 — aggregates for the Treatments Browse screen. recycler_processes.treatments
    // is a single relation (treatment_id FK), so p.treatments is one object, not an array.
    async getTreatmentMethodAggregates() {
        const methods = await this.prisma.treatment_methods.findMany();
        const processes = await this.prisma.recycler_processes.findMany({
            include: {
                treatments: {
                    include: { treatment_processes: { select: { method_id: true } } }
                }
            }
        });

        return methods.map(m => {
            const matching = processes.filter(p => p.treatments?.treatment_processes?.method_id === m.id);
            const charges = matching.map(p => p.capability_metrics?.charges).filter(c => c != null).map(Number);
            const capacities = matching.map(p => p.capability_metrics?.capacity_kg).filter(c => c != null).map(Number);
            const recyclerIds = new Set(matching.map(p => p.recycler_id).filter(Boolean));

            return {
                id: m.id,
                method: m.method,
                process_parameter_schema: m.process_parameter_schema,
                recyclerCount: recyclerIds.size,
                processCount: matching.length,
                avgCharges: charges.length ? charges.reduce((a, b) => a + b, 0) / charges.length : null,
                minCharges: charges.length ? Math.min(...charges) : null,
                maxCharges: charges.length ? Math.max(...charges) : null,
                avgCapacityKg: capacities.length ? capacities.reduce((a, b) => a + b, 0) / capacities.length : null,
            };
        });
    }
}

export const treatmentMethodService = new TreatmentMethodService(prisma);
