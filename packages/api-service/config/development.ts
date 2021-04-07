export default {
  env: 'dev',
  db: {
    connection: {
      host: 'cashflow-dev-db',
    },
    migrations: {
      user: 'cf',
      password: 'mysecretpassword',
    },
  },
};
