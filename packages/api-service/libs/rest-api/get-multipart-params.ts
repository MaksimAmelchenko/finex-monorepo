import { IRouterContext } from '../../types/app';
import { IUploadedFile } from '../../types/file';
import { RequestHandler } from 'express';

function decodeFileInfo(file): IUploadedFile {
  return {
    name: file.originalname,
    contentType: file.mimetype,
    content: file.buffer,
    size: file.size,
  };
}

export function getMultipartParams(
  uploader: RequestHandler
): (routerContext: IRouterContext) => Promise<Record<string, unknown>> {
  return async function (ctx: IRouterContext): Promise<Record<string, unknown>> {
    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      uploader(ctx.req, ctx.res, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });

    const params: any = Object.assign({}, ctx.req['body'] || {}, ctx.query || {}, ctx.params || {});

    if (ctx.req['file']) {
      params.file = decodeFileInfo(ctx.req['file']);
    } else {
      delete params.file;
    }

    if (ctx.req['files']) {
      params.files = ctx.req['files'].map(decodeFileInfo);
    } else {
      delete params.files;
    }

    // omit file/files content
    ctx.log.trace({
      params: {
        ...params,
        file: params.file && {
          name: params.file.name,
          contentType: params.file.contentType,
          size: params.file.size,
        },
        files:
          params.files &&
          params.files.map(({ name, contentType, size }) => ({
            name,
            contentType,
            size,
          })),
      },
    });

    return params;
  };
}
