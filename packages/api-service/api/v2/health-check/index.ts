import * as Router from 'koa-router';

const router: Router = new Router();

router.get('/v2/health-check', ctx => {
  ctx.body = {};
});

export default router;
