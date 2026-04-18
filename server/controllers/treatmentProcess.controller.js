import { treatmentProcessService } from '../services/treatmentProcess.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createTreatmentProcess = asyncHandler(
    async (req, res) => {
        const treatmentProcess = await treatmentProcessService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, treatmentProcess, 'Treatment process created successfully'));
    }
);

const getAllTreatmentProcesses = asyncHandler(
    async (req, res) => {
        const treatmentProcesses = await treatmentProcessService.getAllTreatmentProcesses(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatmentProcesses, 'Treatment processes retrieved successfully'));
    }
);

const getTreatmentProcessById = asyncHandler(
    async (req, res) => {
        const treatmentProcess = await treatmentProcessService.getTreatmentProcessById(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatmentProcess, 'Treatment process retrieved successfully'));
    }
);

const getTreatmentProcessesByRecycler = asyncHandler(
    async (req, res) => {
        const treatmentProcesses = await treatmentProcessService.getTreatmentProcessesByRecycler(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatmentProcesses, 'Recycler treatment processes retrieved successfully'));
    }
);

const updateTreatmentProcess = asyncHandler(
    async (req, res) => {
        const updatedProcess = await treatmentProcessService.updateTreatmentProcess(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedProcess, 'Treatment process updated successfully'));
    }
);

const deleteTreatmentProcess = asyncHandler(
    async (req, res) => {
        const result = await treatmentProcessService.deleteTreatmentProcess(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Treatment process deleted successfully'));
    }
);

export {
    createTreatmentProcess,
    deleteTreatmentProcess,
    getAllTreatmentProcesses,
    getTreatmentProcessById,
    getTreatmentProcessesByRecycler,
    updateTreatmentProcess
};