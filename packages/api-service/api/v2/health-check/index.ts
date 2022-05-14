import * as Router from 'koa-router';
import { StatusCodes } from 'http-status-codes';

const healthCheck: Router = new Router();

healthCheck.get('/v2/health-check', ctx => {
  ctx.status = StatusCodes.NO_CONTENT;
});

export { healthCheck };
