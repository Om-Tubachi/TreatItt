import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class CollectorService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async register(req) {
        const userId = req.user.id;
        const { address, latitude, longitude } = req.body;

        const result = await this.prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM "users"      WHERE id    = ${userId}::uuid) AS user_exists,
                EXISTS(SELECT 1 FROM "collectors" WHERE u_id  = ${userId}::uuid) AS already_registered
        `;

        const { user_exists, already_registered } = result[0];
        console.log(user_exists, already_registered);
        
        if (!user_exists) throw new ApiError(404, "User not found");
        if (already_registered) throw new ApiError(409, "User is already registered as a collector");

        const collector = await this.prisma.collectors.create({
            data: { u_id: userId, address, latitude, longitude }
        });

        if (!collector)
            throw new ApiError(500, "Something went wrong while registering collector");

        return collector;
    }

    async getAllCollectors(req) {
        const collectors = await this.prisma.collectors.findMany({
            select: {
                id: true,
                address: true,
                latitude: true,
                longitude: true
            }
        });

        if (!collectors.length)
            throw new ApiError(500, "Something went wrong while fetching collectors");

        return collectors;
    }

    async getCollectorById(req) {
        const { collectorId } = req.params;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        const collector = await this.prisma.collectors.findUnique({
            where: { id: collectorId },
            select: {
                id: true,
                address: true,
                latitude: true,
                longitude: true
            }
        });

        if (!collector) throw new ApiError(404, "Collector not found");

        return collector;
    }
    // wtf is this
    // async getCollectorsByProximity(req) {
    //     const { lat, lng, radius = 50 } = req.query;

    //     if (!lat || !lng)
    //         throw new ApiError(400, "lat and lng are required");

    //     const collectors = await this.prisma.$queryRaw`
    //         SELECT id, u_id, address,
    //                latitude::float  AS latitude,
    //                longitude::float AS longitude,
    //                ROUND(
    //                    (6371 * acos(
    //                        cos(radians(${Number(lat)})) * cos(radians(latitude::float)) *
    //                        cos(radians(longitude::float) - radians(${Number(lng)})) +
    //                        sin(radians(${Number(lat)})) * sin(radians(latitude::float))
    //                    ))::numeric, 2
    //                ) AS distance_km
    //         FROM collectors
    //         WHERE deletedat IS NULL
    //           AND latitude  IS NOT NULL
    //           AND longitude IS NOT NULL
    //           AND (
    //               6371 * acos(
    //                   cos(radians(${Number(lat)})) * cos(radians(latitude::float)) *
    //                   cos(radians(longitude::float) - radians(${Number(lng)})) +
    //                   sin(radians(${Number(lat)})) * sin(radians(latitude::float))
    //               )
    //           ) <= ${Number(radius)}
    //         ORDER BY distance_km ASC
    //     `;

    //     if (!collectors.length)
    //         throw new ApiError(404, "No collectors found within the specified radius");

    //     return collectors;
    // }

    async getCollectorsByProximity(req) {
        const { lat, lng, radius = 5000 } = req.query;

        if (!lat || !lng)
            throw new ApiError(400, "lat and lng are required");

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=recycling_center&key=${process.env.GOOGLE_PLACES_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK')
            throw new ApiError(404, "No collectors found near the given location");

        return data.results;
    }

    async updateCollector(req) {
        const { collectorId } = req.params;
        const updateData = req.body;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        const updatedCollector = await this.prisma.collectors.update({
            where: { id: collectorId },
            data: updateData
        });

        if (!updatedCollector)
            throw new ApiError(500, "Failed to update collector");

        return updatedCollector;
    }

    async deleteCollector(req) {
        const { collectorId } = req.params;

        if (!collectorId) throw new ApiError(400, "Collector ID is required");

        await this.prisma.collectors.delete({
            where: { id: collectorId }
        });

        return { success: true, message: "Collector deleted" };
    }
}

export const collectorService = new CollectorService(prisma);