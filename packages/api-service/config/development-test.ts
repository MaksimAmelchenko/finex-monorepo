import * as bunyan from 'bunyan';

export default {
  env: 'dev-test',
  log: {
    level: bunyan.FATAL,
  },
  db: {
    connection: {
      host: 'localhost',
    },
    pool: { min: 2, max: 2 },
  },
};
