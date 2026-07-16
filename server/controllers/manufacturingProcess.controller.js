import { manufacturingProcessService } from '../services/manufacturingProcess.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createManufacturingProcess = asyncHandler(
    async (req, res) => {
        const manufacturingProcess = await manufacturingProcessService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, manufacturingProcess, 'Manufacturing process created successfully'));
    }
);

const getSystemDefaults = asyncHandler(
    async (req, res) => {
        const manufacturingProcesses = await manufacturingProcessService.getSystemDefaults(req);
        res
            .status(200)
            .json(new ApiResponse(200, manufacturingProcesses, 'System default manufacturing processes retrieved successfully'));
    }
);

const getManufacturingProcessById = asyncHandler(
    async (req, res) => {
        const manufacturingProcess = await manufacturingProcessService.getManufacturingProcessById(req);
        res
            .status(200)
            .json(new ApiResponse(200, manufacturingProcess, 'Manufacturing process retrieved successfully'));
    }
);

const getManufacturingProcessesByUser = asyncHandler(
    async (req, res) => {
        const manufacturingProcesses = await manufacturingProcessService.getManufacturingProcessesByUser(req);
        res
            .status(200)
            .json(new ApiResponse(200, manufacturingProcesses, 'User manufacturing processes retrieved successfully'));
    }
);

const getManufacturingProcessStats = asyncHandler(
    async (req, res) => {
        const stats = await manufacturingProcessService.getManufacturingProcessStats(req);
        res
            .status(200)
            .json(new ApiResponse(200, stats, 'Manufacturing process stats retrieved successfully'));
    }
);

const getFilteredManufacturingProcesses = asyncHandler(
    async (req, res) => {
        const manufacturingProcesses = await manufacturingProcessService.getFilteredManufacturingProcesses(req);
        res
            .status(200)
            .json(new ApiResponse(200, manufacturingProcesses, 'Filtered manufacturing processes retrieved successfully'));
    }
);

const updateManufacturingProcess = asyncHandler(
    async (req, res) => {
        const updatedProcess = await manufacturingProcessService.updateManufacturingProcess(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedProcess, 'Manufacturing process updated successfully'));
    }
);

const deleteManufacturingProcess = asyncHandler(
    async (req, res) => {
        const result = await manufacturingProcessService.deleteManufacturingProcess(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Manufacturing process deleted successfully'));
    }
);

export {
    createManufacturingProcess,
    deleteManufacturingProcess,
    getFilteredManufacturingProcesses,
    getManufacturingProcessById,
    getManufacturingProcessesByUser,
    getManufacturingProcessStats,
    getSystemDefaults,
    updateManufacturingProcess
};
