import { formTemplateService } from '../services/formtemplate.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllFormTemplates = asyncHandler(async (req, res) => {
    const templates = await formTemplateService.getAllFormTemplates();
    res.status(200).json(new ApiResponse(200, templates, "Form templates fetched"));
});

export const getFormTemplateById = asyncHandler(async (req, res) => {
    const template = await formTemplateService.getFormTemplateById(req);
    res.status(200).json(new ApiResponse(200, template, "Form template fetched"));
});