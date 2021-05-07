import { action, computed, makeObservable, observable } from 'mobx';
import { MainStore } from '../main-store';
import { CommonStorageStore } from './common-storage-store';
import { ManageableStore } from '../manageable-store';
import { ISessionResponse } from '../../types/auth';
import { BootstrapStore } from '../../stores/bootstrap-store';

export interface IAuthApi {
  signIn: (username: string, password: string) => Promise<ISessionResponse>;
  signOut: () => Promise<void>;
}

interface ISignInParams {
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
    const username = commonStorageStore.get('username');
    const token = commonStorageStore.get('token');
    if (token && username) {
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

  /**
   * Sign out of current session
   * Also clears all repositories on successful operation
   */

  signOut = (): Promise<boolean> => {
    this.api.signOut().catch(() => {});
    this.clearAuth();
    return Promise.resolve(true);
  };

  // /**
  //  * Clear all auth data, logical logout for the client
  //  * For real logout, please use SignOut method
  //  */

  clearAuth(): void {
    this._mainStore.clearStores();
  }

  clear(): void {
    this.token = null;
    this.getStore(CommonStorageStore).removeItem('token');
  }

  private async processLogin(token: string, username: string): Promise<void> {
    this.getStore(CommonStorageStore).set('username', username);
    return this.processGrant(token);
  }

  private async processGrant(token: string): Promise<void> {
    this.token = token;
    this.getStore(CommonStorageStore).set('token', token);
    return this.getStore(BootstrapStore).get();
  }
}
