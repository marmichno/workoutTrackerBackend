import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
  muscleGroup: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  preview: {
    type: String,
  },
});

export const Exercise = mongoose.model('exercise', exerciseSchema);
