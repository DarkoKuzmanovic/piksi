import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number, delay: number = 0): number {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTime.current = null;

      function tick(now: number) {
        if (startTime.current === null) startTime.current = now;
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * target));

        if (progress < 1) {
          rafId.current = requestAnimationFrame(tick);
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
    };
  }, [target, duration, delay]);

  return current;
}
