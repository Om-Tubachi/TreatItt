import { prisma } from '../db/prisma.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'


export const verifyManufacturer = asyncHandler(
    async (req, res, next) => {
        try {
            const userId = req?.user?.id
            if (!userId) throw new ApiError(400, "Did not recieve user id -> in manufacturer")

            const result = await prisma.$queryRaw`
            select exists(select 1 from products where u_id = ${userId}) as exists
            `
            const { exists } = result[0]

            if (!exists)
                throw new ApiError(400, "Requested user has not logged any products in the platform, log products to edit/delete")

            next()


        } catch (error) {
            throw new ApiError(401, error?.message || "invalid user id")
        }
    }
)