import { Router } from 'express';
import { getFrp } from '../controllers/index.js';

const router = Router();

router
    .route('/')
    .get(getFrp);

export default router;