/* eslint-disable @typescript-eslint/no-var-requires */
import 'source-map-support/register';
import config from './libs/config';

import * as mount from 'koa-mount';
import * as serve from 'koa-static';
import * as helmet from 'koa-helmet';

import { log, logMiddleware, requestLogMiddleware } from './libs/log';
import { gracefulShutdown } from './libs/graceful-shutdown';

import { entitiesApi } from './api/v1/entities';
import { accountsApi } from './api/v1/accounts';
import { accountsBalancesApi } from './api/v1/accounts-balances';
import { categoriesApi } from './api/v1/categories';
import { contractorsApi } from './api/v1/contractors';
import { currenciesApi } from './api/v1/currencies';
import { dashboardApi } from './api/v1/dashboard';
import { debtsApi } from './api/v1/debts';
import { exchangesApi } from './api/v1/exchanges';
import { ieDetailsApi } from './api/v1/ie-details';
import { iesApi } from './api/v1/ies';
import { moneysApi } from './api/v1/moneys';
import { plansApi } from './api/v1/plans';
import { profileApi } from './api/v1/profile';
import { projectsApi } from './api/v1/projects';
import { reportsApi } from './api/v1/reports';
import { tagsApi } from './api/v1/tags';
import { transfersApi } from './api/v1/transfers';
import { usersApi } from './api/v1/users';
import { unitsApi } from './api/v1/units';

import { invitationsApi } from './api/v2/invitations';

import { authApi } from './api/v2/auth';

import healthCheck from './api/v2/health-check';

import * as Koa from 'koa';

const app: Koa = new Koa();

app.proxy = true;

app.use(helmet());
app.use(healthCheck.routes());
app.use(require('./middlewares/version').default);
app.use(require('./middlewares/cors').default);
app.use(require('./middlewares/favicon').default);
app.use(require('./middlewares/response-time').default);
app.use(logMiddleware(log));
app.use(require('./middlewares/errors').default);
app.use(requestLogMiddleware());
app.use(require('./middlewares/body-parser').default);

app.use(entitiesApi);
app.use(accountsBalancesApi);
app.use(accountsApi);
app.use(categoriesApi);
app.use(contractorsApi);
app.use(currenciesApi);
app.use(dashboardApi);
app.use(debtsApi);
app.use(exchangesApi);
app.use(ieDetailsApi);
app.use(iesApi);
app.use(moneysApi);
app.use(plansApi);
app.use(profileApi);
app.use(projectsApi);
app.use(reportsApi);
app.use(tagsApi);
app.use(transfersApi);
app.use(usersApi);
app.use(unitsApi);

app.use(invitationsApi);

app.use(authApi);

app.use(serve(`${__dirname}/public`));

// serve swagger API docs
// TODO koa-static-cache or nginx
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
app.use(mount('/docs', serve(pathToSwaggerUi)));

app.use(async (ctx, next) => {
  if (ctx.path === '/docs/swagger.json') {
    ctx.body = require('./docs/swagger').swagger({
      serverUrl: `${ctx.secure ? 'https://' : 'http://'}${ctx.request.host}`,
    });
  } else {
    await next();
  }
});
//

if (!module.parent) {
  const port: number = config.get('port');
  const http = require('http');
  const server = http.createServer(app.callback());

  gracefulShutdown(server, {
    log,
    onSignal: async () => {
      log.info('Server is shutting down');
    },
  });

  server.listen(port, () => log.info(`Server started on ${port}`));
}

export { app };