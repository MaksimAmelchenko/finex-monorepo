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
  },

  testAccounts: [
    {
      users: {
        user1: {
          userId: '2',
          username: 'test@finex.io',
          password: '***',
        },
      },
    },
  ],
};
