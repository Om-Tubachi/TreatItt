import { Router } from 'express';
import {
    deleteWaste,
    getAllWasteEntries,
    getFilteredWaste,
    getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser,
    updateWaste,
    uploadWaste
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyWasteProducer } from '../middlewares/wasteProducer.middleware';
const router = Router();


router
    .route('/user/:userId')
    .get(getWasteEntriesOfUser);

router
    .route('/frp/:frpId')
    .get(getWasteEntriesByFrp);

router
    .route('/:wasteId')
    .get(getWasteById)


router
    .route('/')
    .post(verifyJWT, uploadWaste)
    // if req query obj is empty, get all wastes will run other wise there are some keys in teh req query, hence get filtered waste will run 
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getFilteredWaste(req, res, next);
        }
        return getAllWasteEntries(req, res, next);
    });

router.use(verifyJWT, verifyWasteProducer)
router
    .route('/:wasteId')
    .patch(updateWaste)
    .delete(deleteWaste);

export default router;