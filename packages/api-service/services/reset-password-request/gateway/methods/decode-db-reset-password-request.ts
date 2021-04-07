import { IDBResetPasswordRequest, IResetPasswordRequest } from '../../../../types/reset-password-request';

export function decodeDBResetPasswordRequest(resetPasswordRequest: IDBResetPasswordRequest): IResetPasswordRequest {
  return {
    id: resetPasswordRequest.id,
    token: resetPasswordRequest.token,
    email: resetPasswordRequest.email,
    resetAt: resetPasswordRequest.reset_at,
    metadata: {
      createdAt: resetPasswordRequest.created_at,
      updatedAt: resetPasswordRequest.updated_at,
    },
  };
}
