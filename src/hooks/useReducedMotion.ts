import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** The reader's prefers-reduced-motion setting, kept current when it changes. */
export function useReducedMotion(): boolean {
  const query = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(REDUCED_MOTION_QUERY) : null;
  const [isReduced, setIsReduced] = useState(query ? query.matches : false);

  useEffect(() => {
    if (!query) return undefined;
    const handleChange = (event: MediaQueryListEvent) => setIsReduced(event.matches);
    // addListener covers Safari before 14, as bundle.js does.
    if (query.addEventListener) query.addEventListener('change', handleChange);
    else query.addListener(handleChange);
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', handleChange);
      else query.removeListener(handleChange);
    };
    // Subscribes once on mount, matching bundle.js; the query string never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isReduced;
}
