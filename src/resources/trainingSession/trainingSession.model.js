import mongoose from 'mongoose';

const trainingSessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  completed: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'exercise',
      numOfSerie: Number,
      repsDone: Number,
      weight: Number,
    },
  ],
});

export const TrainingSession = mongoose.model(
  'trainingSession',
  trainingSessionSchema
);
