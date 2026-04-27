import { Router } from 'express';
import {
    createCollectorConsumer,
    deleteCollectorConsumer,
    getConsumersByCollector
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router
    .route('/collector/:collectorId')
    .get(getConsumersByCollector);
 
router
    .route('/')
    .post(verifyJWT, createCollectorConsumer);
 
router.use(verifyJWT);
router
    .route('/:consumerId')
    .delete(deleteCollectorConsumer);
 
export default router;