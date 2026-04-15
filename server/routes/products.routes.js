import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFilteredProducts,
    getProductById,
    getProductsByFrp,
    getProductsByUser,
    updateProduct,
} from '../controllers/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyManufacturer } from '../middlewares/manufacturer.middleware.js';
const router = Router();


router
    .route('/user/:userId')
    .get(getProductsByUser);

router
    .route('/frp/:frpId')
    .get(getProductsByFrp);

router
    .route('/:productId')
    .get(getProductById)


router
    .route('/')
    .post(verifyJWT, createProduct)
    // if req query obj is empty, get all products will run other wise there are some keys in teh req query, hence get filtered products will run 
    .get((req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            return getFilteredProducts(req, res, next);
        }
        return getAllProducts(req, res, next);
    });

router.use(verifyJWT, verifyManufacturer)
router
    .route('/:productId')
    .patch(deleteProduct)
    .delete(updateProduct);

export default router;