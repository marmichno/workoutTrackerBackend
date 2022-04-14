import pkg from 'lodash';
const { merge } = pkg;
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: 3000,
  secrets: {
    jwt: 'test',
    jwtExp: '60',
  },
};

let envConfig = {};

export default merge(baseConfig, envConfig);
