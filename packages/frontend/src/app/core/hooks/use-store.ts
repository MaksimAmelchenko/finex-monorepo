import { useContext } from 'react';

import { getMainContext } from '../main-context';
import { ManageableStore } from '../manageable-store';
import { AConstructorTypeOf } from '../main-store';

export function useStore<T extends ManageableStore>(Constructor: AConstructorTypeOf<T>): T {
  const mainContext = useContext(getMainContext());
  return mainContext.mainStore.get(Constructor);
}
