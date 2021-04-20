export default {
  env: 'dev',
  db: {
    connection: {
      host: 'dev-db',
    },
    migrations: {
      user: 'cf',
      password: 'mysecretpassword',
    },
  },
};
