import { ManageableStore } from '../manageable-store';

/**
 * Use this object to store and get session's data
 */
export class SessionStorageStore<StoredData extends Record<string, string>> extends ManageableStore {
  static storeName = 'SessionStorageStore';

  /**
   * This function sets some session data
   * @param {string} key
   * @param {T} value
   * @return {any}
   */
  set<T extends keyof StoredData>(key: T, value: StoredData[T]) {
    return sessionStorage.setItem(String(key), JSON.stringify(value));
  }

  /**
   * Returns any value from session storage
   * Does not throws
   * @param {string} key
   * @param {T} value
   * @return {T | undefined}
   */
  get<T extends keyof StoredData>(key: T): StoredData[T] | undefined {
    try {
      const item = sessionStorage.getItem(String(key));
      return item ? JSON.parse(item) : undefined;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Removes item from session storage
   * @param key
   */
  removeItem<T extends keyof StoredData>(key: T): void {
    sessionStorage.removeItem(String(key));
  }

  clear(): void {
    sessionStorage.clear();
  }
}
