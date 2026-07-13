import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace('#', '');
    const element = document.getElementById(id);
    if (!element) return;

    const scroll = () => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    requestAnimationFrame(scroll);
  }, [pathname, hash]);
}
