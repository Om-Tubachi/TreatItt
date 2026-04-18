import { collectorService } from '../services/collectors.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
 
const registerCollector = asyncHandler(
    async (req, res) => {
        const collector = await collectorService.register(req);
        res
            .status(201)
            .json(new ApiResponse(201, collector, 'Collector registered successfully'));
    }
);
 
const getAllCollectors = asyncHandler(
    async (req, res) => {
        const collectors = await collectorService.getAllCollectors(req);
        res
            .status(200)
            .json(new ApiResponse(200, collectors, 'Collectors retrieved successfully'));
    }
);
 
const getCollectorById = asyncHandler(
    async (req, res) => {
        const collector = await collectorService.getCollectorById(req);
        res
            .status(200)
            .json(new ApiResponse(200, collector, 'Collector retrieved successfully'));
    }
);
 
const getCollectorsByProximity = asyncHandler(
    async (req, res) => {
        const collectors = await collectorService.getCollectorsByProximity(req);
        res
            .status(200)
            .json(new ApiResponse(200, collectors, 'Nearby collectors retrieved successfully'));
    }
);
 
const updateCollector = asyncHandler(
    async (req, res) => {
        const updatedCollector = await collectorService.updateCollector(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedCollector, 'Collector updated successfully'));
    }
);
 
const deleteCollector = asyncHandler(
    async (req, res) => {
        const result = await collectorService.deleteCollector(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Collector deleted successfully'));
    }
);
 
export {
    deleteCollector,
    getAllCollectors,
    getCollectorById,
    getCollectorsByProximity,
    registerCollector,
    updateCollector
};