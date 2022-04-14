import { crudControllers } from '../../utils/crud.js';
import { Configuration } from './configuration.model.js';
import mongoose from 'mongoose';

const toId = mongoose.Types.ObjectId;

const createOne = (model) => async (req, res) => {
  let category = req.body.category;
  category = toId(category);
  try {
    const doc = await model.create({ ...req.body, category: category });
    res.status(201).json({ data: doc });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model
      .find({})
      .populate({ path: 'category', model: 'categories' })
      .lean()
      .exec();

    res.status(200).json({ data: docs });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export default {
  ...crudControllers(Configuration),
  createOne: createOne(Configuration),
  getMany: getMany(Configuration),
};
