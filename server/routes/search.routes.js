import { Router } from 'express';
import { getFacetOptions, search } from '../controllers/search.controller.js';

const router = Router();

router.route('/').post(search);
router.route('/facets').post(getFacetOptions);

export default router;