import { action, computed, makeObservable, observable } from 'mobx';

import { BootstrapStore } from '../../stores/bootstrap-store';
import { CommonStorageStore } from './common-storage-store';
import { IResetPasswordRequestResponse, ISessionResponse, ISignUpRequestResponse } from '../../types/auth';
import { MainStore } from '../main-store';
import { ManageableStore } from '../manageable-store';
import { SessionStorageStore } from './session-storage-store';

export interface IAuthApi {
  signIn: (username: string, password: string) => Promise<ISessionResponse>;
  changePassword: (password: string, newPassword: string) => Promise<unknown>;
  signUp: (name: string, username: string, password: string) => Promise<ISignUpRequestResponse>;
  signUpConfirmation: (token: string) => Promise<unknown>;
  resetPassword: (username: string) => Promise<IResetPasswordRequestResponse>;
  resetPasswordConfirmation: (token: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface ISignInParams {
  username: string;
  password: string;
}

interface SignUpParams {
  name: string;
  username: string;
  password: string;
}

export class AuthRepository extends ManageableStore {
  static storeName = 'AuthRepository';

  token: string | null = null;

  constructor(mainStore: MainStore, private api: IAuthApi) {
    super(mainStore);
    makeObservable<AuthRepository, 'processGrant'>(this, {
      token: observable,
      hasAuth: computed,
      processGrant: action,
      clear: action,
    });

    const commonStorageStore = this.getStore(CommonStorageStore);
    const sessionStorageStore = this.getStore(SessionStorageStore);
    const username = commonStorageStore.get('username');
    const token = sessionStorageStore.get('token');
    if (token && username) {
      // TODO handle the error
      this.processLogin(token, username);
    }
  }

  /**
   * Whether we signed-in under any user or not
   * @return {boolean}
   */
  get hasAuth(): boolean {
    return Boolean(this.token);
  }

  /**
   * Do sign-in request to API, and remembers returned data
   * @param {ISignInParams} params
   * @return {Promise<void>}
   */
  signIn = ({ username, password }: ISignInParams): Promise<void> => {
    return this.api.signIn(username, password).then(({ authorization }) => this.processLogin(authorization, username));
  };

  signUp = ({ name, username, password }: SignUpParams): Promise<ISignUpRequestResponse> => {
    return this.api.signUp(name, username, password);
  };

  signUpConfirmation = (token: string) => {
    return this.api.signUpConfirmation(token);
  };

  resetPassword = (username: string): Promise<IResetPasswordRequestResponse> => {
    return this.api.resetPassword(username);
  };

  resetPasswordConfirmation = (token: string, password: string): Promise<void> => {
    return this.api.resetPasswordConfirmation(token, password);
  };

  /**
   * Sign out of current session
   * Also clears all repositories on successful operation
   */

  signOut = (): Promise<boolean> => {
    this.api.signOut().catch(() => {});
    this.clearAuth();
    return Promise.resolve(true);
  };

  changePassword(password: string, newPassword: string): Promise<unknown> {
    return this.api.changePassword(password, newPassword);
  }

  // /**
  //  * Clear all auth data, logical logout for the client
  //  * For real logout, please use SignOut method
  //  */

  clearAuth(): void {
    this._mainStore.clearStores();
  }

  clear(): void {
    this.token = null;
    this.getStore(SessionStorageStore).removeItem('token');
  }

  async processLogin(token: string, username: string): Promise<void> {
    this.getStore(CommonStorageStore).set('username', username);
    return this.processGrant(token);
  }

  private async processGrant(token: string): Promise<void> {
    this.token = token;
    this.getStore(SessionStorageStore).set('token', token);
    return this.getStore(BootstrapStore).get();
  }
}
