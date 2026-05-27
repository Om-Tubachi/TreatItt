import { Router } from 'express';
import { getAllTreatmentMethods } from '../controllers/index.js';

const router = Router();
router.route('/').get(getAllTreatmentMethods);
export default router;