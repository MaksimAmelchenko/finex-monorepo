export default {
  env: 'dev-local',
  appDomain: 'localhost:3000',
  log: {
    level: 'trace',
  },
  db: {
    connection: {
      host: 'localhost',
      password: 'webpassword',
      database: 'cf',
    },
    migrations: {
      user: 'postgres',
      password: 'rootpassword',
    },
  },
  mail: {
    templates: {
      viewsPath: './emails/src/templates',
      resourcePath: './emails/src',
    },
    transport: 'json',
  },
};
