import { collectorConsumerService } from '../services/collectorSourcesConsumers.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
 
const createCollectorConsumer = asyncHandler(
    async (req, res) => {
        const consumer = await collectorConsumerService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, consumer, 'Collector consumer added successfully'));
    }
);
 
const getConsumersByCollector = asyncHandler(
    async (req, res) => {
        const consumers = await collectorConsumerService.getConsumersByCollector(req);
        res
            .status(200)
            .json(new ApiResponse(200, consumers, 'Collector consumers retrieved successfully'));
    }
);
 
const deleteCollectorConsumer = asyncHandler(
    async (req, res) => {
        const result = await collectorConsumerService.deleteConsumer(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Collector consumer removed successfully'));
    }
);
 
export { createCollectorConsumer, deleteCollectorConsumer, getConsumersByCollector };
 