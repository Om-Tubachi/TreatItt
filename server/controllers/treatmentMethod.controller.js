import { treatmentMethodService } from '../services/treatmentMethod.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllTreatmentMethods = asyncHandler(async (req, res) => {
    const data = await treatmentMethodService.getAllTreatmentMethods();
    res.json(new ApiResponse(200, data, "Treatment methods fetched"));
});