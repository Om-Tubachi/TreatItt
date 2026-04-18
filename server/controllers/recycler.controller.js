import { recyclerService } from '../services/recycler.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
 
const registerRecycler = asyncHandler(
    async (req, res) => {
        const recycler = await recyclerService.register(req);
        res
            .status(201)
            .json(new ApiResponse(201, recycler, 'Recycler registered successfully'));
    }
);
 
const getAllRecyclers = asyncHandler(
    async (req, res) => {
        const recyclers = await recyclerService.getAllRecyclers(req);
        res
            .status(200)
            .json(new ApiResponse(200, recyclers, 'Recyclers retrieved successfully'));
    }
);
 
const getRecyclerById = asyncHandler(
    async (req, res) => {
        const recycler = await recyclerService.getRecyclerById(req);
        res
            .status(200)
            .json(new ApiResponse(200, recycler, 'Recycler retrieved successfully'));
    }
);
 
const getFilteredRecyclers = asyncHandler(
    async (req, res) => {
        const recyclers = await recyclerService.getFilteredRecyclers(req);
        res
            .status(200)
            .json(new ApiResponse(200, recyclers, 'Filtered recyclers retrieved successfully'));
    }
);
 
export { getAllRecyclers, getFilteredRecyclers, getRecyclerById, registerRecycler };