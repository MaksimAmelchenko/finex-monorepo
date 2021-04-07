import { IRouterContext } from '../../types/app';
import { INotModified, ISendFile } from '../../types/file';

function isNotModified(payload: ISendFile | INotModified): payload is INotModified {
  return (<INotModified>payload).status === 304;
}

export function sendFile(routerContext: IRouterContext, payload: ISendFile | INotModified): void {
  if (isNotModified(payload)) {
    routerContext.status = payload.status;
    return;
  }

  const { contentType, content, ETag } = payload;
  routerContext.set('Content-Type', contentType);
  routerContext.set('Cache-Control', 'max-age=86400'); // 24h
  routerContext.set('ETag', ETag);
  routerContext.body = content;
}
