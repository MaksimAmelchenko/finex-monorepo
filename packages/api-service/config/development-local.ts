export default {
  env: 'dev-local',
  db: {
    connection: {
      host: 'localhost',
    },
  },
  mail: {
    templates: {
      viewsPath: './emails/src/templates',
      resourcePath: './emails/src',
    },
  },
};
