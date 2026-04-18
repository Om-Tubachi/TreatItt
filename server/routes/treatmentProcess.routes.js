import { Router } from 'express';
import {
    createTreatmentProcess,
    deleteTreatmentProcess,
    getAllTreatmentProcesses,
    getTreatmentProcessById,
    getTreatmentProcessesByRecycler,
    updateTreatmentProcess
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router
    .route('/recycler/:recyclerId')
    .get(getTreatmentProcessesByRecycler);
 
router
    .route('/:tpId')
    .get(getTreatmentProcessById);
 
router
    .route('/')
    .post(verifyJWT, createTreatmentProcess)
    .get(getAllTreatmentProcesses);
 
router.use(verifyJWT);
router
    .route('/:tpId')
    .patch(updateTreatmentProcess)
    .delete(deleteTreatmentProcess);
 
export default router;