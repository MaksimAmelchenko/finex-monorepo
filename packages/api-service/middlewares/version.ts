import config from '../libs/config';

export default function (ctx, next) {
  const version = config.get('version');
  ctx.set('X-Version', version);
  return next();
}
