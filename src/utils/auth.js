import config from '../config/index.js';
import { User } from '../resources/user/user.model.js';
import jwt from 'jsonwebtoken';

export const newToken = (user) => {
  console.log(user.id);
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
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
    return res.status(200).send({ token });
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
    console.log(payload);
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
