import { useCallback, useState } from 'react';

import { useEscape } from './use-escape';

export function useCloseOnEscape({ onClose }: { onClose: () => unknown }) {
  const [isCanClose, setCanClose] = useState<boolean>(true);

  useEscape((event: KeyboardEvent) => {
    if (isCanClose) {
      onClose();
    }
  });

  const onCanCloseChange = useCallback((canClose: boolean) => {
    setCanClose(canClose);
  }, []);

  return { onCanCloseChange };
}
