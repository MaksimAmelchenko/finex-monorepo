import { action, makeObservable, observable } from 'mobx';

import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { SideSheet } from '../pages/SettingsMobile/types';

export class AppStore extends ManageableStore {
  static storeName = 'AppStore';

  isOpenedSettings: boolean = false;
  settingSideSheet: SideSheet = SideSheet.None;
  settingSideSheetParams: any = null;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this, {
      isOpenedSettings: observable,
      settingSideSheet: observable,
      settingSideSheetParams: observable,

      openSettings: action,
      closeSettings: action,
      clear: action,
    });
  }

  openSettings(sideSheet: SideSheet, params: any = null): void {
    this.isOpenedSettings = true;
    this.settingSideSheet = sideSheet;
    this.settingSideSheetParams = params;

    console.log('openSettings', sideSheet, params);
  }

  closeSettings(): void {
    this.isOpenedSettings = false;
    this.settingSideSheet = SideSheet.None;
    this.settingSideSheetParams = null;
  }

  clear(): void {}
}
