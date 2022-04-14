import { Router } from 'express';
import controllers from './categories.controllers.js';

const router = Router();

// /api/categories
router.route('/').get(controllers.getMany).post(controllers.createOne);

// /api/categories/:id
router.route('/:id').delete(controllers.removeOne);
// router
//   .route('/:id')
//   .get(controllers.getOne)
//   .put(controllers.updateOne)
//   .delete(controllers.removeOne);

export default router;
