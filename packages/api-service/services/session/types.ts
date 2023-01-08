import { TDateTime } from '../../types/app';

export interface ISession {
  id: string;
  idUser: number;
  idProject: number;
  isActive: boolean;
  ip: string;
  requestsCount: number;
  lastAccessTime: string;
  timeout: string;
  userAgent: string;
  accessUntil: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IJwtPayload {
  sessionId: string;
}

export interface CreateSessionGatewayData {
  timeout: string;
  projectId: string;
  userAgent: string;
  ip: string;
  accessUntil: TDateTime;
}

export type UpdateSessionGatewayChanges = Partial<{
  lastAccessTime: string;
  projectId: string;
  isActive: boolean;
}>;

export type UpdateSessionServiceChanges = UpdateSessionGatewayChanges;
