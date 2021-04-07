export default function (ctx, next) {
  if (ctx.path !== '/favicon.ico') {
    return next();
  }
}
