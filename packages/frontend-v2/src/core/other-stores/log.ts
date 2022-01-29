import { ManageableStore } from '../manageable-store';
import { MainStore } from '../main-store';

// import { useStore } from '../hooks/use-store';

/**
 * This store is basically logs everything to somewhere (console/api/etc)
 */
export class Log extends ManageableStore {
  static storeName = 'Log';

  /**
   * Create a new apollo client and remembers it
   * @param mainStore
   * @param _debug
   */
  constructor(mainStore: MainStore, protected _debug: boolean) {
    super(mainStore);
  }

  // TODO: Send logs to somewhere

  log(message: string, ...args: any[]): void {
    if (this._debug) {
      console.log(message, ...args);
    }
  }

  fatal(e: Error): void {
    console.error(`Fatal error: `, e);
  }

  error(e: Error): void {
    if (this._debug) {
      console.error(`Error: `, e);
    }
  }

  clear(): void {}
}

/**
 * Obtain Log within the current context
 */
// export function useLog() {
//   useStore<RequireLog>('Log');
// }
