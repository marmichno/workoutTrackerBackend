import express from 'express';
import pkg from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

// routers
import exercisesRouter from './resources/exercise/exercise.router.js';

// db
import { connect } from './utils/db.js';
import { signin, signup, protect, refreshToken } from './utils/auth.js';

const { json, urlencoded } = pkg;
export const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.post('/signup', signup);
app.post('/signin', signin);
app.post('/authorization/refreshToken', refreshToken);
app.use('/dashboard/', protect);
app.use('/dashboard/exercises', exercisesRouter);

export const startServer = async () => {
  try {
    await connect('mongodb://localhost:27017/api');
    app.listen(4000, () => {
      console.log(`REST API on http://localhost:27017/api`);
    });
  } catch (e) {
    console.error(e);
  }
};
