import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class FormTemplateService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getAllFormTemplates() {
        const templates = await this.prisma.form_templates.findMany();
        if (!templates.length)
            throw new ApiError(404, "No form templates found");
        return templates;
    }

    async getFormTemplateById(req) {
        const { id } = req.params;

        if (!id)
            throw new ApiError(400, "Form template ID is required");

        const template = await this.prisma.form_templates.findUnique({
            where: { id }
        });

        if (!template)
            throw new ApiError(404, "Form template does not exist");

        return template;
    }
}

export const formTemplateService = new FormTemplateService(prisma);