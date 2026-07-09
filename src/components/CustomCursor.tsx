import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const [cursorLabel, setCursorLabel] = useState('');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const moveDotTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const moveDotYTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const moveRingTo = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power2.out' });
    const moveRingYTo = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      moveDotTo(clientX);
      moveDotYTo(clientY);
      moveRingTo(clientX);
      moveRingYTo(clientY);
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.7, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { scale: 2, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: isHoveringRef.current ? 2 : 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer');

      if (interactive) {
        isHoveringRef.current = true;

        // Check for data-cursor-label
        const labelEl = target.closest('[data-cursor]') as HTMLElement;
        const label = labelEl?.dataset.cursor || '';
        setCursorLabel(label);

        gsap.to(ring, {
          scale: label ? 3 : 2,
          borderColor: 'rgba(242, 204, 143, 0.4)',
          backgroundColor: 'rgba(242, 204, 143, 0.05)',
          duration: 0.4,
          ease: 'power2.out',
        });

        gsap.to(dot, {
          scale: 0.5,
          backgroundColor: '#F2CC8F',
          duration: 0.3,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer');

      if (interactive) {
        isHoveringRef.current = false;
        setCursorLabel('');

        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(26, 26, 26, 0.2)',
          backgroundColor: 'transparent',
          duration: 0.4,
          ease: 'power2.out',
        });

        gsap.to(dot, {
          scale: 1,
          backgroundColor: '#F2CC8F',
          duration: 0.3,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseover', onMouseOver);
      document.body.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-saffron rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-parchment/20 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        {/* Label */}
        <span
          className={`font-mono text-[7px] uppercase tracking-widest text-saffron transition-opacity duration-300 whitespace-nowrap ${
            cursorLabel ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {cursorLabel}
        </span>
      </div>
    </div>
  );
}
