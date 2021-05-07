import { action, makeObservable, observable } from 'mobx';

export class Device {
  private readonly mediaQuerySmall = window.matchMedia('(max-width: 1023px)');
  isSmallScreen: boolean;

  constructor() {
    makeObservable(this, {
      isSmallScreen: observable,
    });

    this.isSmallScreen = this.mediaQuerySmall.matches;

    this.mediaQuerySmall.addEventListener(
      'change',
      action(() => {
        this.isSmallScreen = this.mediaQuerySmall.matches;
      })
    );
  }
}

export const device: Device = new Device();
