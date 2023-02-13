import { useWindowSize } from './use-window-size';

export const sizes = {
  md: 768,
  lg: 1280,
};

export function useDeviceSize(breakpoints = sizes) {
  const { width } = useWindowSize();

  const size = width >= breakpoints.lg ? 'lg' : width >= breakpoints.md ? 'md' : 'sm';

  return {
    isSmall: size === 'sm',
    isMedium: size === 'md',
    isLarge: size === 'lg',
  };
}
