import { Router } from 'express';
import controllers from './exercise.controller.js';

const router = Router();

// /dashboard/exercises
router.route('/').get(controllers.getMany).post(controllers.createOne);

// /dashboards/exercises/:id
router.route('/:id').delete(controllers.removeOne);

export default router;
