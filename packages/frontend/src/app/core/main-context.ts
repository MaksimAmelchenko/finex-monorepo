import { Context, createContext } from 'react';
import { MainStore } from './main-store';

export interface MainStoreContext {
  mainStore: MainStore;
}

let mainContext: Context<MainStoreContext>;

/**
 * Initialize mainStore and provide it here before App rendering
 * @param {MainStore} mainStore
 * @return {Context<MainStoreContext>}
 */
export function createMainContext(mainStore: MainStore): Context<MainStoreContext> {
  mainContext = createContext({ mainStore });
  return mainContext;
}

export function getMainContext(): Context<MainStoreContext> {
  return mainContext as Context<MainStoreContext>;
}
