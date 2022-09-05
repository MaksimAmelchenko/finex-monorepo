import * as Bunyan from 'bunyan';
import * as Cookies from 'cookies';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Knex } from 'knex';

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
  trx?: Knex.Transaction;
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
  permissions: Permissions;
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

export type Permissions = {
  accounts: Record<string, Permit>;
  projects: Record<string, Permit>;
};
