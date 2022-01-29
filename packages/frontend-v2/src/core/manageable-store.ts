/**
 * Basic class of main-store manageable stores
 * Basically implements DI mechanism
 */
import { AConstructorTypeOf, MainStore } from './main-store';

/**
 * Named store, that is managed by the mainStore container
 * define type RequiredStores for its decendatns
 */
export abstract class ManageableStore {
  /**
   * Manageable
   * @param {MainStore} _mainStore
   */

  constructor(protected _mainStore: MainStore) {
    _mainStore.registerStore(this);
  }

  /**
   * Syntax sugar to obtain other store via main store
   * @param constructor
   */
  protected getStore<T extends ManageableStore>(constructor: AConstructorTypeOf<T>): T {
    return this._mainStore.get(constructor);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.storeName;
  }

  /**
   * Should implement clearing or resetting data in the store.
   * Most probably will be called on before signing-out.
   */
  abstract clear(): void;
}
