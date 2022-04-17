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
    jwtRef: 'test2',
    jwtExp: '61000',
    jwtRefExp: '30d',
  },
};

let envConfig = {};

export default merge(baseConfig, envConfig);
