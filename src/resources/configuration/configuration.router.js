import { Router } from 'express';
import controllers from './configuration.controllers.js';

const router = Router();

// /api/configuration
router.route('/').get(controllers.getMany).post(controllers.createOne);

// /api/configuration/:id
router.route('/:id').delete(controllers.removeOne);

export default router;
