import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const verifyJWT = asyncHandler(
    async (req, _, next) => {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
            if (!token) throw new ApiError(400, "User does not have a access token")
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            const user = await prisma.users.findUnique({
                where: {id:decodedToken?.id},
                omit:{
                    password:true,
                    refresh_token:true
                }
            })

            if (!user) throw new ApiError(401, "Invalid access token")

            req.user = user

            next()
        } catch (error) {
           throw new ApiError(401, error?.message || "invalid access token")

        }
    }
)
