import { IContent, INotModified, IResponse } from './types';
import { IDownloadFile } from '../../types/file';
import { IRouterContext } from '../../types/app';

export function isNotModified(response: IResponse): response is INotModified {
  return (<INotModified>response).status === 304;
}

export function isFile(response: IResponse): response is IDownloadFile {
  return Boolean((<IDownloadFile>response).filename);
}

export function isContent(response: IResponse): response is IContent<any> {
  return !isNotModified(response) && !isFile(response);
}

export default function send(routerContext: IRouterContext, response: IResponse): void {
  if (isNotModified(response)) {
    routerContext.status = response.status;
    return;
  }

  if (isContent(response)) {
    const { body = {}, contentType = 'application/json; charset=utf-8', status = 200, ETag } = response;

    routerContext.status = status;
    routerContext.body = body;
    routerContext.set('Content-Type', contentType);
    if (ETag) {
      routerContext.set('ETag', ETag);
    }
    return;
  }

  if (isFile(response)) {
    const { content, contentType, filename } = response;
    routerContext.set('Content-Type', contentType);
    routerContext.set('Content-Disposition', `inline; filename="${filename}"`);
    routerContext.body = content;
    // if (ETag) {
    //   routerContext.set('ETag', ETag);
    // }
    return;
  }
}
