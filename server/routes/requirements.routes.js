import { Router } from 'express';
import {
    createRequirement,
    deleteRequirement,
    getAllRequirements,
    getFilteredRequirements,
    getRequirementById,
    getRequirementsByFrp,
    getRequirementsByUser,
    updateRequirement,
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyWasteProducer } from '../middlewares/wasteProducer.middleware.js';

const router = Router();

router.route('/user/:userId').get(getRequirementsByUser);
router.route('/frp/:frpId').get(getRequirementsByFrp);

router
    .route('/')
    .post(verifyJWT, createRequirement)
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getFilteredRequirements(req, res, next);
        }
        return getAllRequirements(req, res, next);
    });

router
    .route('/:id')
    .get(getRequirementById)
    .patch(verifyJWT, verifyWasteProducer, updateRequirement)
    .delete(verifyJWT, verifyWasteProducer, deleteRequirement);

export default router;