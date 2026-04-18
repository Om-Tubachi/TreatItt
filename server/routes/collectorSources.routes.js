import { Router } from 'express';
import {
    createCollectorSource,
    deleteCollectorSource,
    getSourcesByCollector
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router
    .route('/collector/:collectorId')
    .get(getSourcesByCollector);
 
router
    .route('/')
    .post(verifyJWT, createCollectorSource);
 
router.use(verifyJWT);
router
    .route('/:sourceId')
    .delete(deleteCollectorSource);
 
export default router;