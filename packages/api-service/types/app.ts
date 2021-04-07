import * as Bunyan from 'bunyan';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Cookies from 'cookies';

import { IUploadedFile } from './file';

export type ILogger = Bunyan;

export interface IModel {
  metadata: {
    createdAt: string;
    updatedAt: string;
    permit?: number;
  };
}

export type IRouterContext = Router.RouterContext<any, ContextCustomT>;

export interface IRequestContext extends ContextCustomT {
  params: {
    [key: string]: any;
    files?: IUploadedFile[];
  };
  sessionId?: string;
  userId?: string;
  userAgent?: string;
  additionalParams?: any;
  cookies?: Cookies;
  authorization?: string;
  projects?: string[];
}

export interface ContextCustomT {
  requestId: string;
  log: ILogger;
}

export type Middleware = Koa.Middleware<any, ContextCustomT>;

export type KoaContext = Koa.ParameterizedContext<any, ContextCustomT>;

export interface IError {
  code: string;
  status: number;
  message: string;
  moreInfo?: string;
  stack?: string;
  data?: any;
}

export enum Permit {
  Read = 1,
  Update = 3,
  Owner = 7,
}

export type TDate = string;
export type TDateTime = string;
export type TUrl = string;
export type THtml = string;
export type TText = string;
export type TJson = any;
