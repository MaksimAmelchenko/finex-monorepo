import { ManageableStore } from '../manageable-store';
import { MainStore } from '../main-store';

/**
 * Use this object to store and get persistent data commonly for all users
 * By default it uses LocalStorage
 */
export class CommonStorageStore<StoredData extends Record<string, string>> extends ManageableStore {
  static storeName = 'CommonStorageStore';

  /**
   * This function persistently sets some data for usage between sessions
   * It stores data for each user separately, if you need set some data for all user,
   * use CommonStorageStore
   * @param {string} key
   * @param {T} value
   * @return {any}
   */
  set<T extends keyof StoredData>(key: T, value: StoredData[T]) {
    return localStorage.setItem(`${key}`, JSON.stringify(value));
  }

  /**
   * Returns any value from persistent storage not-specific for current user,
   * for user-specific data use UserStorageStore
   * Does not throws, except when used out of Auth context (user didn't logged in)
   * @param {string} key
   * @param {T} value
   * @return {T | undefined}
   */
  get<T extends keyof StoredData>(key: T): StoredData[T] | undefined {
    const item = localStorage.getItem(`${key}`);
    try {
      return item ? JSON.parse(item) : undefined;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Removes item from global (non user specific) common store storage
   * @param key
   */
  removeItem<T extends keyof StoredData>(key: T): void {
    localStorage.removeItem(`${key}`);
  }

  clear(): void {
    // Do nothing, cause storage supposed to be persistent
  }
}

/**
 * This is just a library template, please use redefined useCommonStorageValue
 * with appropriate StoredData for your application
 * @param {P} key
 * @return {[(StoredData[P] | undefined) , ((value: StoredData[P]) => void)]}
 */
// export function useCommonStorageValueTemplate<StoredData extends {}, P extends keyof StoredData = keyof StoredData>(
//   key: P,
// ): [StoredData[P] | undefined, (value: StoredData[P]) => void] {
//   const commonStorageStore = useStore<{ CommonStorageStore: CommonStorageStore<StoredData> }>('CommonStorageStore');
//   // @ts-ignore
//   return [commonStorageStore.get(key), commonStorageStore.set.bind(commonStorageStore, key)];
// }
