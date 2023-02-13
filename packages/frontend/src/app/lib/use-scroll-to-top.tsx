import { useEffect } from 'react';

import { scrollToTop } from './scroll-to-top';

export function useScrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  useEffect(() => {
    scrollToTop(behavior);
  }, [behavior]);
}
