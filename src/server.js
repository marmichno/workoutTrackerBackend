import express from 'express';
import pkg from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

// routers
import categoriesRouter from './resources/categories/categories.router.js';
import configurationRouter from './resources/configuration/configuration.router.js';

// db
import { connect } from './utils/db.js';
import { signin, signup, protect } from './utils/auth.js';

const { json, urlencoded } = pkg;
export const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.post('/signup', signup);
app.post('/signin', signin);
app.use('/api', protect);
app.use('/api/categories', categoriesRouter);
app.use('/api/configuration', configurationRouter);

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
