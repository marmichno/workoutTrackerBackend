import config from '../config/index.js';
import { User } from '../resources/user/user.model.js';
import jwt from 'jsonwebtoken';
import { saveToken, removeToken } from '../resources/token/session.utils.js';
import mongoose from 'mongoose';

const toId = mongoose.Types.ObjectId;

export const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const newRefToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwtRef, {
    expiresIn: config.secrets.jwtRefExp,
  });
};

export const verifyToken = (token) =>
  jwt.verify(token, config.secrets.jwt, (err, payload) => {
    if (err) {
      return {
        errorMessage: err.message,
        payload: {},
      };
    } else {
      return {
        errorMessage: '',
        payload: payload,
      };
    }
  });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, config.secrets.jwtRef, (err, payload) => {
    if (err) {
      return {
        errorMessage: err.message,
        payload: {},
      };
    } else {
      return {
        errorMessage: '',
        payload: payload,
      };
    }
  });

export const refreshToken = async (req, res) => {
  if (!req.body.token) {
    return res.status(401).send({ message: 'wrong request' });
  }

  let token = req.body.token;

  try {
    const payload = verifyRefreshToken(token);

    if (payload.errorMessage) {
      return res.status(401).end();
    }

    const removedToken = await removeToken(req.body.token);

    if (!removedToken) {
      return res.status(401).end();
    }

    const refreshToken = newToken(payload);
    const refreshRefToken = newRefToken(payload);

    const createdToken = await saveToken(toId(payload.id), refreshRefToken);

    if (!createdToken) {
      return res.status(401).end();
    }

    return res
      .status(201)
      .send({ token: refreshToken, refreshToken: refreshRefToken });
  } catch (e) {
    console.error(e);
    res.status(401).end();
  }
};

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.nickname) {
    return res
      .status(400)
      .send({ message: 'Email, password, nickname required' });
  }
  try {
    const user = await User.create(req.body);
    return res.status(201).send({ message: 'user created' });
  } catch (e) {
    console.error(e);
    return res.status(400).end();
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Email, password required' });
  }

  const user = await User.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res.status(401).send({ message: 'Not authorized' });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).send({ message: 'Not authorized' });
    }
    const token = newToken(user);
    const refreshToken = newRefToken(user);
    const savedToken = await saveToken(user._id, refreshToken);

    if (!savedToken) {
      return res.status(401).send({ message: 'token is not saved' });
    }

    return res.status(200).send({ token: token, refreshToken: refreshToken });
  } catch (e) {
    console.error(e);
    return res.status(401).send({ message: 'Not authorized' });
  }
};

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'wrong request' });
  }
  let token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send({ message: 'something wrong with token' });
  }
  try {
    const payload = verifyToken(token);

    if (payload.errorMessage) {
      if (payload.errorMessage === 'jwt expired') {
        return res.status(401).send('jwt expired');
      } else {
        return res.status(401).end();
      }
    }
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).end();
  }
};
