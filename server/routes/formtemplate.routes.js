import { Router } from 'express';
import { getAllFormTemplates, getFormTemplateById } from '../controllers/formtemplate.controller.js';

const router = Router();

router.get('/', getAllFormTemplates);
router.get('/:id', getFormTemplateById);

export default router;