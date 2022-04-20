import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
  },
  target: {
    type: String,
  },
  description: {
    type: String,
  },
  exercises: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'exercise',
      numOfSeries: Number,
      numOfReps: Number,
    },
  ],
});

export const Training = mongoose.model('training', trainingSchema);
