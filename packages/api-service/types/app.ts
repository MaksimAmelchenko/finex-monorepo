import * as Bunyan from 'bunyan';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Cookies from 'cookies';

export type ILogger = Bunyan;

export interface IModel {
  metadata: {
    createdAt: string;
    updatedAt: string;
    permit?: number;
  };
}

export type IRouterContext = Router.RouterContext<any, ContextCustomT>;

export type IRequestContext<P = any, isAuthorized extends boolean = true> = {
  params: P;
  additionalParams?: any;
  cookies: Cookies;
} & ContextCustomT &
  (isAuthorized extends true ? IAuthorizedRequestContext : INotAuthorizedRequestContext);

export interface ContextCustomT {
  requestId: string;
  log: ILogger;
}

interface INotAuthorizedRequestContext {}

interface IAuthorizedRequestContext {
  sessionId: string;
  projectId: string;
  userId: string;
  // for DB port
  authorization: string;
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

export type Sign = 1 | -1;

export type TDate = string;
export type TDateTime = string;
export type TUrl = string;
export type THtml = string;
export type TText = string;
export type TJson = any;
