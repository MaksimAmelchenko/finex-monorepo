/**
 * The MainStore is a container for all other stores, especially for those which needed to be singletones
 * and all other stores that need to be cleared on sign-in/out processes
 */
import { ManageableStore } from './manageable-store';
import { CoreError } from './errors';

export interface AConstructorTypeOf<T> {
  readonly storeName: string;

  new (mainStore: MainStore, ...args: any[]): T;
}

/**
 * Main storage of all DI objects in the system
 */
export class MainStore {
  private $storesMap: Map<string, ManageableStore>;

  constructor() {
    this.$storesMap = new Map();
  }

  /**
   * Init the IMainStore object with special stores,
   * basically registres array of stores.
   * Could be used, when you manually create a store with special constructor params
   * @param {ManageableStore[]} stores
   */
  initialize(stores: ManageableStore[]): void {
    stores.forEach(store => this.registerStore(store));
  }

  /**
   * register a new store here
   * Store of the same class cannot be registred twice
   * @param {ManageableStore} store
   */

  registerStore(store: ManageableStore): void {
    if (!store.getName()) {
      throw new CoreError(`Unable to register store without name ${store.constructor.name}`);
    }

    // we cannot register store of the same class twice
    if (this.$storesMap.has(store.getName())) {
      throw new CoreError(`Main store already contains ${store.getName()}`);
    }

    this.$storesMap.set(store.getName(), store);
  }

  // /**
  //  * Check if such Store already exists in MainStorew
  //  * @param {string | AConstructorTypeOf<any>} name
  //  * @return {boolean}
  //  */
  // has(name: keyof T): boolean {
  //   return this.$storesMap.has(name as string);
  // }

  /**
   * Get store by name or its Constructor
   * @param {Constructor<T>} store constructor
   * @return {T}
   */
  get<T extends ManageableStore>(Constructor: AConstructorTypeOf<T>): T {
    if (!this.$storesMap.has(Constructor.storeName)) {
      console.info('create', Constructor.storeName);
      this.$storesMap.set(Constructor.storeName, new Constructor(this));
    }

    return this.$storesMap.get(Constructor.storeName) as T;
  }

  /**
   * Clear or reset all ManageableStores
   * Basically user on sign-in/out
   */
  clearStores(): void {
    for (const key of this.$storesMap.keys()) {
      // We need to clear each store only once
      const repository = this.$storesMap.get(key);
      if (repository) {
        repository.clear();
      }
    }
  }
}
