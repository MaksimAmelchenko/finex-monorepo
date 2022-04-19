export default async function errorMiddleware(ctx, next) {
  try {
    await next();
    if (ctx.status === 404 && !(ctx.body && ctx.body.error && ctx.body.error.code)) {
      ctx.throw(404);
    }
  } catch (err: any) {
    const status = err.status || err.statusCode || 500;
    ctx.status = status;
    ctx.body = {
      error: {
        status,
        message: err.message,
      },
    };
    if (status === 500) {
      ctx.log.fatal({ err });
    } else {
      ctx.log.error({ err });
    }
  }
}
