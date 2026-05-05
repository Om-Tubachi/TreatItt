import Router from 'express';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router()

const getIndustryById = asyncHandler(
    async (req, res) => {
        const { industryId } = req.query;

        if (!industryId) {
            throw new ApiError(400, "Industry ID is required");
        }

        const industry = await prisma.industries.findUnique({
            where: {
                id: industryId,
            },
        });

        if (!industry) {
            throw new ApiError(404, "Industry not found");
        }

        return res.status(200).json(
            new ApiResponse(200, industry, "Industry fetched successfully")
        );
    }
)
const getAllIndustries = asyncHandler(async (req, res) => {
    const industries = await prisma.industries.findMany();
    return res.status(200).json(new ApiResponse(200, industries, "Industries fetched"));
});

router.route('/').get((req, res, next) => {
    if (req.query.industryId) return getIndustryById(req, res, next);
    return getAllIndustries(req, res, next);
});

export default router