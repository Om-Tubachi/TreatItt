import { Router } from 'express';
import {
    deleteCollector,
    getAllCollectors,
    getCollectorById,
    getCollectorsByProximity,
    registerCollector,
    updateCollector
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router
    .route('/register')
    .post(verifyJWT, registerCollector);
 
router
    .route('/:collectorId')
    .get(getCollectorById);
 
router
    .route('/')
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getCollectorsByProximity(req, res, next);
        }
        return getAllCollectors(req, res, next);
    });
 
router.use(verifyJWT);
router
    .route('/:collectorId')
    .patch(updateCollector)
    .delete(deleteCollector);
 
export default router;