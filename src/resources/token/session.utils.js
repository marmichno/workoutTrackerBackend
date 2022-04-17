import { Session } from './session.model.js';
import mongoose from 'mongoose';

const toId = mongoose.Types.ObjectId;

export const saveToken = async (userId, token) => {
  try {
    const doc = await Session.create({
      userId: toId(userId),
      token: token,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const removeToken = async (token) => {
  try {
    const removed = await Session.findOneAndRemove({
      token: token,
    });

    if (!removed) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
