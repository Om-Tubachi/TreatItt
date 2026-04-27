import { collectorSourceService } from '../services/collectorSourcesConsumers.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
 
const createCollectorSource = asyncHandler(
    async (req, res) => {
        const source = await collectorSourceService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, source, 'Collector source added successfully'));
    }
);
 
const getSourcesByCollector = asyncHandler(
    async (req, res) => {
        const sources = await collectorSourceService.getSourcesByCollector(req);
        res
            .status(200)
            .json(new ApiResponse(200, sources, 'Collector sources retrieved successfully'));
    }
);
 
const deleteCollectorSource = asyncHandler(
    async (req, res) => {
        const result = await collectorSourceService.deleteSource(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Collector source removed successfully'));
    }
);
 
export { createCollectorSource, deleteCollectorSource, getSourcesByCollector };