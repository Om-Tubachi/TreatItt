import { treatmentService } from '../services/treatments.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
 
const createTreatment = asyncHandler(
    async (req, res) => {
        const treatment = await treatmentService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, treatment, 'Treatment created successfully'));
    }
);
 
const getAllTreatments = asyncHandler(
    async (req, res) => {
        const treatments = await treatmentService.getAllTreatments(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatments, 'Treatments retrieved successfully'));
    }
);
 
const getTreatmentById = asyncHandler(
    async (req, res) => {
        const treatment = await treatmentService.getTreatmentById(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatment, 'Treatment retrieved successfully'));
    }
);
 
const getTreatmentsByRecycler = asyncHandler(
    async (req, res) => {
        const treatments = await treatmentService.getTreatmentsByRecycler(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatments, 'Recycler treatments retrieved successfully'));
    }
);
 
const getFilteredTreatments = asyncHandler(
    async (req, res) => {
        const treatments = await treatmentService.getFilteredTreatments(req);
        res
            .status(200)
            .json(new ApiResponse(200, treatments, 'Filtered treatments retrieved successfully'));
    }
);
 
const updateTreatment = asyncHandler(
    async (req, res) => {
        const updatedTreatment = await treatmentService.updateTreatment(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedTreatment, 'Treatment updated successfully'));
    }
);
 
const deleteTreatment = asyncHandler(
    async (req, res) => {
        const result = await treatmentService.deleteTreatment(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Treatment deleted successfully'));
    }
);
 
export {
    createTreatment,
    deleteTreatment,
    getAllTreatments,
    getFilteredTreatments,
    getTreatmentById,
    getTreatmentsByRecycler,
    updateTreatment
};
 