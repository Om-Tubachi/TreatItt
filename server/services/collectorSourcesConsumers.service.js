import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

// ── Collector Sources ──────────────────────────────────────────────────────────

class CollectorSourceService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const userId = req.user.id;
        const { collectorId } = req.body;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"             WHERE id = ${userId}::uuid)      AS user_exists,
                EXISTS(SELECT 1 FROM "collectors"        WHERE id = ${collectorId}::uuid) AS collector_exists,
                EXISTS(SELECT 1 FROM "collector_sources" WHERE u_id = ${userId}::uuid
                                                         AND collector_id = ${collectorId}::uuid) AS already_exists
        `;

        const { user_exists, collector_exists, already_exists } = result[0];

        if (!user_exists)      throw new ApiError(404, "User not found");
        if (!collector_exists) throw new ApiError(404, "Collector not found");
        if (already_exists)    throw new ApiError(409, "User is already a source for this collector");

        const source = await this.prisma.collector_sources.create({
            data: { u_id: userId, collector_id: collectorId }
        });

        if (!source)
            throw new ApiError(500, "Something went wrong while adding collector source");

        return source;
    }

    async getSourcesByCollector(req) {
        const { collectorId } = req.params;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "collectors"        WHERE id          = ${collectorId}::uuid) AS collector_exists,
                EXISTS(SELECT 1 FROM "collector_sources" WHERE collector_id = ${collectorId}::uuid) AS has_sources
        `;

        const { collector_exists, has_sources } = result[0];

        if (!collector_exists) throw new ApiError(404, "Collector not found");
        if (!has_sources)      throw new ApiError(404, "No sources found for this collector");

        const sources = await this.prisma.collector_sources.findMany({
            where: { collector_id: collectorId },
            select: {
                id:   true,
                users: {
                    select: {
                        id:           true,
                        first_name:   true,
                        last_name:    true,
                        email:        true,
                        company_name: true
                    }
                }
            }
        });

        if (!sources.length)
            throw new ApiError(500, "Something went wrong while fetching sources");

        return sources;
    }

    async deleteSource(req) {
        const { sourceId } = req.params;

        if (!sourceId) throw new ApiError(400, "Source ID is required");

        await this.prisma.collector_sources.delete({
            where: { id: sourceId }
        });

        return { success: true, message: "Collector source removed" };
    }
}


// ── Collector Consumers ────────────────────────────────────────────────────────

class CollectorConsumerService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const userId = req.user.id;
        const { collectorId } = req.body;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"               WHERE id = ${userId}::uuid)      AS user_exists,
                EXISTS(SELECT 1 FROM "collectors"          WHERE id = ${collectorId}::uuid) AS collector_exists,
                EXISTS(SELECT 1 FROM "collector_consumers" WHERE u_id = ${userId}::uuid
                                                           AND collector_id = ${collectorId}::uuid) AS already_exists
        `;

        const { user_exists, collector_exists, already_exists } = result[0];

        if (!user_exists)      throw new ApiError(404, "User not found");
        if (!collector_exists) throw new ApiError(404, "Collector not found");
        if (already_exists)    throw new ApiError(409, "User is already a consumer for this collector");

        const consumer = await this.prisma.collector_consumers.create({
            data: { u_id: userId, collector_id: collectorId }
        });

        if (!consumer)
            throw new ApiError(500, "Something went wrong while adding collector consumer");

        return consumer;
    }

    async getConsumersByCollector(req) {
        const { collectorId } = req.params;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "collectors"          WHERE id           = ${collectorId}::uuid) AS collector_exists,
                EXISTS(SELECT 1 FROM "collector_consumers" WHERE collector_id  = ${collectorId}::uuid) AS has_consumers
        `;

        const { collector_exists, has_consumers } = result[0];

        if (!collector_exists) throw new ApiError(404, "Collector not found");
        if (!has_consumers)    throw new ApiError(404, "No consumers found for this collector");

        const consumers = await this.prisma.collector_consumers.findMany({
            where: { collector_id: collectorId },
            select: {
                id:   true,
                users: {
                    select: {
                        id:           true,
                        first_name:   true,
                        last_name:    true,
                        email:        true,
                        company_name: true
                    }
                }
            }
        });

        if (!consumers.length)
            throw new ApiError(500, "Something went wrong while fetching consumers");

        return consumers;
    }

    async deleteConsumer(req) {
        const { consumerId } = req.params;

        if (!consumerId) throw new ApiError(400, "Consumer ID is required");

        await this.prisma.collector_consumers.delete({
            where: { id: consumerId }
        });

        return { success: true, message: "Collector consumer removed" };
    }
}

export const collectorSourceService  = new CollectorSourceService(prisma);
export const collectorConsumerService = new CollectorConsumerService(prisma);