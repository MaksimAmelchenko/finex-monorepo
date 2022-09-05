export default {
  env: 'dev-test-local',
  db: {
    connection: {
      host: 'localhost',
      password: 'webpassword',
      database: 'cf',
    },
  },
  mail: {
    templates: {
      viewsPath: './emails/src/templates',
      resourcePath: './emails/src',
    },
  },
};
