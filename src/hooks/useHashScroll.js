import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const id = hash.replace('#', '');
    const element = document.getElementById(id);
    if (!element) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const scroll = () => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    requestAnimationFrame(scroll);
  }, [pathname, hash]);
}
