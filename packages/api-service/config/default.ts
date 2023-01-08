import { Locale } from '../types/app';

export default {
  appName: 'api.finex.io',
  appDomain: 'app.finex.io',
  port: 3000,
  log: {
    level: 'trace',
  },
  locales: [Locale.En, Locale.Ru, Locale.De],
  db: {
    client: 'pg',
    connection: {
      host: 'DB__CONNECTION__HOST',
      user: 'web',
      password: 'DB__CONNECTION__PASSWORD',
      database: 'DB__CONNECTION__DATABASE',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      user: 'DB__MIGRATIONS_USER',
      password: 'DB__MIGRATIONS_PASSWORD',
      directory: './migrations',
      tableName: 'migrations',
    },
  },
  auth: {
    jwtSecret: 'AUTH__JWT__SECRET',
  },
  captcha: {
    secret: 'CAPTCHA__SECRET',
  },
  mail: {
    templates: {
      viewsPath: './emails/templates',
      resourcePath: './emails',
    },
    transport: 'ses',
    from: 'FINEX.io <no-reply@finex.io>',
    service: {
      region: 'AWS__REGION',
      credentials: {
        accessKeyId: 'AWS__ACCESS__KEY__ID',
        secretAccessKey: 'AWS__SECRET__ACCESS__KEY',
      },
    },
  },
};
