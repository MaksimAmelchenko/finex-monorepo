import { ManageableStore } from '../manageable-store';

/**
 * Use this object to store and get persistent data commonly for all users
 * By default it uses LocalStorage
 */
export class CommonStorageStore<StoredData extends Record<string, string>> extends ManageableStore {
  static storeName = 'CommonStorageStore';

  /**
   * This function persistently sets some data for usage between sessions
   * @param {string} key
   * @param {T} value
   * @return {any}
   */
  set<T extends keyof StoredData>(key: T, value: StoredData[T]) {
    return localStorage.setItem(String(key), JSON.stringify(value));
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
    const item = localStorage.getItem(String(key));
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
    localStorage.removeItem(String(key));
  }

  clear(): void {
    // Do nothing, cause storage supposed to be persistent
  }
}
