import { ValidateFunction } from 'ajv';
import { RequestHandler } from 'express';
import { OpenAPIV3 } from 'openapi-types';

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

export interface RestRouteOptions {
  method?: RestMethod;
  methods?: RestMethod[];
  uri: string;
  uploader?: RequestHandler;
  onEnter?: (routerContext: IRouterContext, requestContext: IRequestContext) => Promise<void>;
  schemas?: Schemas;
  handler: (ctx: IRequestContext) => Promise<IResponse>;
  isNeedAuthorization?: boolean;
  // permissions?: App.Permissions;
}

export interface IRestRoute {
  handler(ctx: IRouterContext): Promise<void>;
}

export interface ICommonResponse {
  ETag?: string;
}

export interface IContent<T> extends ICommonResponse {
  body: T;
  status?: number;
  contentType?: string;
}

export interface INotModified {
  status: 304;
}

export type IResponse<T = Record<string, any> | string> = IContent<T> | IDownloadFile | INotModified;
