import { Router } from 'express';
import { getFacetOptions, search, searchPins } from '../controllers/search.controller.js';

const router = Router();

router.route('/').post(search);
router.route('/facets').post(getFacetOptions);
router.route('/pins').post(searchPins);

export default router;