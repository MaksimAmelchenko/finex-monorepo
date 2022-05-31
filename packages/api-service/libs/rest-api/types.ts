import * as HttpStatus from 'http-status-codes';
import { OpenAPIV3 } from 'openapi-types';
import { RequestHandler } from 'express';
import { ValidateFunction } from 'ajv';

import { IRequestContext, IRouterContext } from '../../types/app';
import { IDownloadFile } from '../../types/file';

export type Schemas = {
  params?: OpenAPIV3.SchemaObject;
  response?: OpenAPIV3.SchemaObject;
};

export type SchemasValidators = {
  params: ValidateFunction;
  response: ValidateFunction;
};

export enum RestMethod {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Put = 'PUT',
  Delete = 'DELETE',
}

export interface RestRouteOptions<P = any, IsAuthorized extends boolean = true> {
  method?: RestMethod;
  methods?: RestMethod[];
  uri: string;
  uploader?: RequestHandler;
  onEnter?: (routerContext: IRouterContext, requestContext: IRequestContext<P, IsAuthorized>) => Promise<void>;
  schemas?: Schemas;
  handler: (ctx: IRequestContext<P, IsAuthorized>, routeCtx: IRouterContext, next: () => any) => Promise<IResponse>;
  isNeedAuthorization?: boolean;
  // permissions?: App.Permissions;
}

export interface IRestRoute {
  handler(ctx: IRouterContext, next?: () => any): Promise<any>;
}

export interface ICommonResponse {
  ETag?: string;
}

export interface IContent<T> extends ICommonResponse {
  body: T;
  status?: number;
  contentType?: string;
}

export interface IAccepted {
  status: HttpStatus.StatusCodes.ACCEPTED;
}

export interface INoContent {
  status: HttpStatus.StatusCodes.NO_CONTENT;
}

export interface INotModified {
  status: HttpStatus.StatusCodes.NOT_MODIFIED;
}

export type IResponse<T = Record<string, any> | string> =
  | IContent<T>
  | IDownloadFile
  | IAccepted
  | INoContent
  | INotModified;
