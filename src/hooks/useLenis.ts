import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  const rafId = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisInstance;
}
