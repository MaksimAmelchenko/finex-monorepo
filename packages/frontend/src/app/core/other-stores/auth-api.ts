import { ApiRepository } from './api-repository';
import { IAuthApi } from './auth-repository';
import { ISessionResponse } from '../../types/auth';

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

  signOut(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
