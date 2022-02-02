import { ApiRepository } from './api-repository';
import { IAuthApi } from './auth-repository';
import { ISessionResponse, ISignUpRequestResponse } from '../../types/auth';

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

  signOut(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
