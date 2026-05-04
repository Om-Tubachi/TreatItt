
import { wasteService } from "../services/wastes.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadWaste = asyncHandler(
    async (req, res) => {
        console.log('in create controller');
        
        const wasteEntry = await wasteService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, wasteEntry, 'Waste logged successfully'));
    }
);

const getWasteById = asyncHandler(
    async (req, res) => {
        const wasteEntry = await wasteService.getWasteById(req);
        res
            .status(200)
            .json(new ApiResponse(200, wasteEntry, 'Waste entry retrieved successfully'));
    }
);

const getWasteEntriesOfUser = asyncHandler(
    async (req, res) => {
        const wasteEntries = await wasteService.getWasteEntriesOfUser(req);
        res
            .status(200)
            .json(new ApiResponse(200, wasteEntries, 'User waste entries retrieved successfully'));
    }
);

const getAllWasteEntries = asyncHandler(
    async (req, res) => {
        const wasteEntries = await wasteService.getAllWasteEntries(req);
        res
            .status(200)
            .json(new ApiResponse(200, wasteEntries, 'All waste entries retrieved successfully'));
    }
);

const getWasteEntriesByFrp = asyncHandler(
    async (req, res) => {
        const wasteEntries = await wasteService.getWasteEntriesByFrp(req);
        res
            .status(200)
            .json(new ApiResponse(200, wasteEntries, 'FRP waste entries retrieved successfully'));
    }
);

const getFilteredWaste = asyncHandler(
    async (req, res) => {
        const wasteEntries = await wasteService.getWasteFilters(req);
        res
            .status(200)
            .json(new ApiResponse(200, wasteEntries, 'Filtered waste entries retrieved successfully'));
    }
);

const updateWaste = asyncHandler(
    async (req, res) => {
        const updatedWaste = await wasteService.updateWaste(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedWaste, 'Waste entry updated successfully'));
    }
);

const deleteWaste = asyncHandler(
    async (req, res) => {
        const result = await wasteService.deleteWaste(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Waste entry deleted successfully'));
    }
);

export {
    deleteWaste,
    getAllWasteEntries,
    getFilteredWaste,
    getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser,
    updateWaste,
    uploadWaste
};

