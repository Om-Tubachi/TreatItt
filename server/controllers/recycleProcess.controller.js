import { recycleProcessService } from '../services/recycleProcess.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createRecycleProcess = asyncHandler(
    async (req, res) => {
        const recycleProcess = await recycleProcessService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, recycleProcess, 'Recycle process created successfully'));
    }
);

const getRecycleProcessById = asyncHandler(
    async (req, res) => {
        const recycleProcess = await recycleProcessService.getRecycleProcessById(req);
        res
            .status(200)
            .json(new ApiResponse(200, recycleProcess, 'Recycle process retrieved successfully'));
    }
);

const getRecycleProcessesByRecycler = asyncHandler(
    async (req, res) => {
        const recycleProcesses = await recycleProcessService.getRecycleProcessesByRecycler(req);
        res
            .status(200)
            .json(new ApiResponse(200, recycleProcesses, 'Recycler processes retrieved successfully'));
    }
);

const getFilteredRecycleProcesses = asyncHandler(
    async (req, res) => {
        const recycleProcesses = await recycleProcessService.getFilteredRecycleProcesses(req);
        res
            .status(200)
            .json(new ApiResponse(200, recycleProcesses, 'Filtered recycle processes retrieved successfully'));
    }
);

const updateRecycleProcess = asyncHandler(
    async (req, res) => {
        const updatedProcess = await recycleProcessService.updateRecycleProcess(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedProcess, 'Recycle process updated successfully'));
    }
);

const deleteRecycleProcess = asyncHandler(
    async (req, res) => {
        const result = await recycleProcessService.deleteRecycleProcess(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Recycle process deleted successfully'));
    }
);

export {
    createRecycleProcess,
    deleteRecycleProcess,
    getFilteredRecycleProcesses,
    getRecycleProcessById,
    getRecycleProcessesByRecycler,
    updateRecycleProcess
};