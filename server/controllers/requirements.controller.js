import { requirementsService } from '../services/requirements.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createRequirement = asyncHandler(
    async (req, res) => {
        const requirementEntry = await requirementsService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, requirementEntry, 'Requirement logged successfully'));
    }
);

const getRequirementById = asyncHandler(
    async (req, res) => {
        const requirementEntry = await requirementsService.getRequirementById(req);
        res
            .status(200)
            .json(new ApiResponse(200, requirementEntry, 'Requirement entry retrieved successfully'));
    }
);

const getRequirementsByUser = asyncHandler(
    async (req, res) => {
        const requirementEntries = await requirementsService.getRequirementsByUser(req);
        res
            .status(200)
            .json(new ApiResponse(200, requirementEntries, 'User requirement entries retrieved successfully'));
    }
);

const getAllRequirements = asyncHandler(
    async (req, res) => {
        const requirementEntries = await requirementsService.getAllRequirements(req);
        res
            .status(200)
            .json(new ApiResponse(200, requirementEntries, 'All requirement entries retrieved successfully'));
    }
);

const getRequirementsByFrp = asyncHandler(
    async (req, res) => {
        const requirementEntries = await requirementsService.getRequirementsByFrp(req);
        res
            .status(200)
            .json(new ApiResponse(200, requirementEntries, 'FRP requirement entries retrieved successfully'));
    }
);

const getFilteredRequirements = asyncHandler(
    async (req, res) => {
        const requirementEntries = await requirementsService.getRequirementFilters(req);
        res
            .status(200)
            .json(new ApiResponse(200, requirementEntries, 'Filtered requirement entries retrieved successfully'));
    }
);

const updateRequirement = asyncHandler(
    async (req, res) => {
        const updatedRequirement = await requirementsService.updateRequirement(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedRequirement, 'Requirement entry updated successfully'));
    }
);

const deleteRequirement = asyncHandler(
    async (req, res) => {
        const result = await requirementsService.deleteRequirement(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Requirement entry deleted successfully'));
    }
);

export {
    createRequirement,
    deleteRequirement,
    getAllRequirements,
    getFilteredRequirements,
    getRequirementById,
    getRequirementsByFrp,
    getRequirementsByUser,
    updateRequirement,
};