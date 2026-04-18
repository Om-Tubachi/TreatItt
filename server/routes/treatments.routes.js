import { Router } from 'express';
import {
    createTreatment,
    deleteTreatment,
    getAllTreatments,
    getFilteredTreatments,
    getTreatmentById,
    getTreatmentsByRecycler,
    updateTreatment
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router
    .route('/recycler/:recyclerId')
    .get(getTreatmentsByRecycler);
 
router
    .route('/:treatmentId')
    .get(getTreatmentById);
 
router
    .route('/')
    .post(verifyJWT, createTreatment)
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getFilteredTreatments(req, res, next);
        }
        return getAllTreatments(req, res, next);
    });
 
router.use(verifyJWT);
router
    .route('/:treatmentId')
    .patch(updateTreatment)
    .delete(deleteTreatment);
 
export default router;