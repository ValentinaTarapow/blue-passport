import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const { threshold = 0.12, rootMargin = '0px 0px -60px 0px' } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin },
    );

    element.classList.add('reveal');
    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
