import { action, makeObservable, observable } from 'mobx';

import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';

export enum Window {
  AddExpenseTransaction,
  AddIncomeTransaction,
  AddCashFlow,
  AddDebt,
  AddTransfer,
  AddExchange,
  None,
}

export class MainLayoutStoreMobile extends ManageableStore {
  static storeName = 'MainLayoutStoreMobile';

  window: Window = Window.None;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this, {
      window: observable,
      showWindow: action,
      hideWindow: action,
      clear: action,
    });
  }

  showWindow(window: Window): void {
    this.window = window;
  }

  hideWindow(): void {
    this.window = Window.None;
  }

  clear(): void {}
}
