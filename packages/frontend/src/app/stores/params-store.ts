import { action, makeObservable, observable } from 'mobx';

import { IParams, IParamsRaw } from '../types/params';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';

export class ParamsStore extends ManageableStore {
  static storeName = 'ParamsRepository';

  params: IParams | null = null;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this, {
      params: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume({ dashboard }: IParamsRaw): void {
    this.params = {
      dashboard,
    };
  }

  clear(): void {
    this.params = null;
  }
}
