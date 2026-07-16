import { Router } from 'express';
import {
    createManufacturingProcess,
    deleteManufacturingProcess,
    getFilteredManufacturingProcesses,
    getManufacturingProcessById,
    getManufacturingProcessesByUser,
    getManufacturingProcessStats,
    getSystemDefaults,
    updateManufacturingProcess
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router
    .route('/user/:userId')
    .get(getManufacturingProcessesByUser);

// §1.1 — must sit above /:mpId, same route-order reasoning as /user/:userId above it
router
    .route('/search')
    .get(getFilteredManufacturingProcesses);

router
    .route('/:mpId/stats')
    .get(getManufacturingProcessStats);

// needs to be above /:mpId otherwise express matches 'user' as an mpId
router
    .route('/:mpId')
    .get(getManufacturingProcessById);

router
    .route('/')
    .post(verifyJWT, createManufacturingProcess)
    .get(getSystemDefaults);

router.use(verifyJWT);

router
    .route('/:mpId')
    .patch(updateManufacturingProcess)
    .delete(deleteManufacturingProcess);

export default router;
