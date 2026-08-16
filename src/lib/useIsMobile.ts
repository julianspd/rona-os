import { useEffect, useState } from 'react';

/** One definition of "phone", shared by everything that needs it. */
export function useIsMobile(query = '(max-width: 760px)') {
  const [m, setM] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [query]);
  return m;
}
