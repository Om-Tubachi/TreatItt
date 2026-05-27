import { Router } from 'express';
import {
    createRecycleProcess,
    deleteRecycleProcess,
    getAllRecycleProcesses,
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
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getFilteredRecycleProcesses(req, res, next);
        }
        return getAllRecycleProcesses(req, res, next);
    });

router.use(verifyJWT);

router
    .route('/:processId')
    .patch(updateRecycleProcess)
    .delete(deleteRecycleProcess);


export default router;