export default {
  env: 'dev-local',
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
      password: 'postgrespassword',
    },
  },
  mail: {
    templates: {
      viewsPath: './emails/src/templates',
      resourcePath: './emails/src',
    },
    transport: 'ses',
  },
};
