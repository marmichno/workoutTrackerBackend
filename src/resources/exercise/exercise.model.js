import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  muscleGroup: {
    type: String,
  },
  description: {
    type: String,
  },
  preview: {
    type: String,
  },
});

export const Exercise = mongoose.model('exercise', exerciseSchema);
