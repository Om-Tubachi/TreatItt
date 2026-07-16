import { Router } from 'express';
import { getAllTreatmentMethods, getTreatmentMethodAggregates } from '../controllers/index.js';

const router = Router();

// §1.2 — must sit above any future /:id-style route
router.route('/aggregates').get(getTreatmentMethodAggregates);
router.route('/').get(getAllTreatmentMethods);

export default router;
