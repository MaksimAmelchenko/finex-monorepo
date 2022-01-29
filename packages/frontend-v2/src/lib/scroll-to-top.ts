export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  try {
    window.scroll({
      top: 0,
      left: 0,
      behavior,
    });
  } catch (error) {
    // just a fallback for older browsers
    window.scrollTo(0, 0);
  }
}
