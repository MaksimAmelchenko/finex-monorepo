import { IModel } from './app';

const PASSWORD_RESET_REQUEST_TTL = 'P1D';

export { PASSWORD_RESET_REQUEST_TTL };

export interface IPasswordResetRequest extends IModel {
  token: string;
  userId: string;
  requestedAt: string;
  validTill: string;
  resetAt?: string;
}

export interface IDBPasswordResetRequest {
  token: string;
  userId: string;
  requestedAt: string;
  validTill: string;
  resetAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPasswordResetRequestCreateParams {
  userId: string;
}

export interface ISessionResponse {
  authorization: string;
  userId: number;
  projectId: number;
}

// export interface IServiceSessionResponse {
//   authorization: string;
// }

export type TSignInResponse = ISessionResponse;
