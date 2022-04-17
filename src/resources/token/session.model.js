import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model('session', sessionSchema);
