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
      user: 'DB__MIGRATIONS__USER',
      password: 'DB__MIGRATIONS__PASSWORD',
      directory: './migrations',
      tableName: 'migrations',
    },
  },
  auth: {
    jwtSecret: 'AUTH__JWT_SECRET',
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
      region: 'MAIL__SERVICE__REGION',
      credentials: {
        accessKeyId: 'MAIL__SERVICE__CREDENTIALS__ACCESS_KEY_ID',
        secretAccessKey: 'MAIL__SERVICE__CREDENTIALS__SECRET_ACCESS_KEY',
      },
    },
  },
  paypal: {
    baseUrl: 'PAYPAL__BASE_URL',
    clientId: 'PAYPAL__CLIENT_ID',
    secret: 'PAYPAL__SECRET',
    webhookId: 'PAYPAL__WEBHOOK_ID',
  },
  yookassa: {
    shopId: 'YOOKASSA__SHOP_ID',
    secretKey: 'YOOKASSA__SECRET_KEY',
  },
};
