import { Locale } from '../types/app';

export default {
  appName: 'api.finex.io',
  port: 3000,
  log: {
    level: 'trace',
  },
  locales: [Locale.Ru, Locale.En, Locale.De],
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
    transport: 'smtp',
    smtp: {
      host: 'MAIL__SMTP__HOST',
      auth: {
        user: 'MAIL__SMTP__AUTH__USERNAME',
        pass: 'MAIL__SMTP__AUTH__PASSWORD',
      },
    },
    from: 'FINEX <no-reply@finex.io>',
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
  currencyRate: {
    secret: 'CURRENCY_RATE__SECRET',
    openExchangeRates: {
      appId: 'CURRENCY_RATE__OPEN_EXCHANGE_RATES__APP_ID',
    },
  },
  connections: {
    secret: 'CONNECTIONS__SECRET',
  },
  nordigen: {
    secretId: 'NORDIGEN__SECRET_ID',
    secretKey: 'NORDIGEN__SECRET_KEY',
  },
};
