import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'categories',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Configuration = mongoose.model(
  'configuration',
  configurationSchema
);
