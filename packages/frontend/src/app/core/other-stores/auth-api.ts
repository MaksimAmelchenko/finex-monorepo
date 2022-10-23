import { ApiRepository } from './api-repository';
import { IAuthApi } from './auth-repository';
import { IResetPasswordRequestResponse, ISessionResponse, ISignUpRequestResponse } from '../../types/auth';

export class AuthApi extends ApiRepository implements IAuthApi {
  static override storeName = 'AuthApi';

  signIn(username: string, password: string): Promise<ISessionResponse> {
    return this.fetch<ISessionResponse>({
      url: '/v2/sign-in',
      method: 'POST',
      body: {
        username,
        password,
      },
    });
  }

  signUp(name: string, username: string, password: string): Promise<ISignUpRequestResponse> {
    return this.fetch<ISignUpRequestResponse>({
      url: '/v2/sign-up',
      method: 'POST',
      body: {
        name,
        email: username,
        password,
        isAcceptTerms: true,
      },
    });
  }

  signUpConfirmation(token: string): Promise<unknown> {
    return this.fetch<ISignUpRequestResponse>({
      url: '/v2/sign-up/confirm',
      method: 'POST',
      body: {
        token,
      },
    });
  }

  resetPassword(username: string): Promise<IResetPasswordRequestResponse> {
    return this.fetch<IResetPasswordRequestResponse>({
      url: '/v2/reset-password',
      method: 'POST',
      body: {
        email: username,
      },
    });
  }

  resetPasswordConfirmation(token: string, password: string): Promise<void> {
    return this.fetch({
      url: '/v2/reset-password/confirm',
      method: 'POST',
      body: {
        token,
        password,
      },
    });
  }

  changePassword(password: string, newPassword: string): Promise<void> {
    return this.fetch<void>({
      url: '/v2/change-password',
      method: 'POST',
      body: {
        password,
        newPassword,
      },
    });
  }

  signOut(): Promise<void> {
    return this.fetch<void>({
      url: '/v1/sign-out',
      method: 'POST',
    });
  }
}
