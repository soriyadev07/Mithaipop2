/**
 * Clean Single-Page Application Navigation Utility
 * Updates browser URL history and dispatches popstate event for seamless route synchronization
 */

export const navigateTo = (url: string, replace = false): void => {
  if (typeof window === 'undefined') return;

  const currentFull = window.location.pathname + window.location.search + window.location.hash;
  if (currentFull === url) return;

  if (replace) {
    window.history.replaceState(null, '', url);
  } else {
    window.history.pushState(null, '', url);
  }

  // Notify any popstate listeners immediately
  window.dispatchEvent(new PopStateEvent('popstate'));
};
