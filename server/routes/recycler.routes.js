import { Router } from 'express';
import {
    getAllRecyclers,
    getFilteredRecyclers,
    getRecyclerById,
    registerRecycler
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router
    .route('/register')
    .post(verifyJWT, registerRecycler);
 
router
    .route('/:recyclerId')
    .get(getRecyclerById);
 
router
    .route('/')
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getFilteredRecyclers(req, res, next);
        }
        return getAllRecyclers(req, res, next);
    });
 
export default router;