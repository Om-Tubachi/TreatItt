import { Router } from 'express';
import {
    createRecycleProcess,
    deleteRecycleProcess,
    getFilteredRecycleProcesses,
    getRecycleProcessById,
    getRecycleProcessesByRecycler,
    updateRecycleProcess
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router
    .route('/recycler/:recyclerId')
    .get(getRecycleProcessesByRecycler);

router
    .route('/:processId')
    .get(getRecycleProcessById);

router
    .route('/')
    .post(verifyJWT, createRecycleProcess)
    .get(getFilteredRecycleProcesses);

router.use(verifyJWT);

router
    .route('/:processId')
    .patch(updateRecycleProcess)
    .delete(deleteRecycleProcess);

export default router;