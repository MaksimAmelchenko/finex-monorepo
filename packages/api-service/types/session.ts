import { IModel } from './app';

export interface ISession extends IModel {
  id: string;
  userId: string;
  projectId: string;
  isActive: boolean;
  ip: string;
  requestCount: number;
  lastAccessAt: string;
  timeout: string;
  userAgent: string;
}

// export interface IServiceSession {
//   id: string;
//   serviceId: string;
//   requestCount: number;
//   createdAt: string;
//   lastAccessedAt: string;
//   timeout: string;
//   isActive: boolean;
// }

export interface IJwtPayload {
  sessionId: string;
}

export interface ICreateParams {
  timeout: string;
  projectId: number;
  userAgent: string;
}

export interface IServiceSessionCreateParams {
  timeout: string;
}

export interface IGatewayCreateParams {
  timeout: string;
  projectId: number;
  userAgent: string;
}

export interface IUpdateParams {
  lastAccessAt?: string;
}
