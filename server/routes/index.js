import { Router } from 'express';

import treatmentMethodsRouter from '../routes/treatmentMethods.routes.js';
import collectorConsumersRouter from './collectorConsumers.routes.js';
import collectorsRouter from './collectors.routes.js';
import collectorSourcesRouter from './collectorSources.routes.js';
import frpRouter from './frp.routes.js';
import industriesRouter from './industries.routes.js';
import manufacturingProcessRouter from './manufacturingProcess.routes.js';
import productsRouter from './products.routes.js';
import recycleProcessRouter from './recycleProcess.routes.js';
import recyclerRouter from './recycler.routes.js';
import requirementsRouter from './requirements.routes.js';
import treatmentProcessRouter from './treatmentProcess.routes.js';
import treatmentsRouter from './treatments.routes.js';
import userRouter from './user.routes.js';
import wasteRoutes from './waste.routes.js';
const router = Router();

router.use('/users', userRouter)
router.use('/industries', industriesRouter)
router.use('/wastes', wasteRoutes)
router.use('/products', productsRouter)
router.use('/collectors', collectorsRouter)
router.use('/collector-sources', collectorSourcesRouter)
router.use('/collector-consumers', collectorConsumersRouter)
router.use('/frp', frpRouter)
router.use('/manufacturing-processes', manufacturingProcessRouter)
router.use('/recycle-processes', recycleProcessRouter)
router.use('/recyclers', recyclerRouter)
router.use('/requirements', requirementsRouter)
router.use('/treatment-processes', treatmentProcessRouter)
router.use('/treatments', treatmentsRouter)
router.use('/treatment-methods', treatmentMethodsRouter)
export default router;