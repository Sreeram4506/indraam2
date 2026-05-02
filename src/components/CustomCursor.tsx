import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(follower, {
        x: clientX,
        y: clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2 });
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
        gsap.to(follower, {
          scale: 2.5,
          backgroundColor: 'rgba(242, 204, 143, 0.2)',
          borderColor: 'rgba(242, 204, 143, 0.5)',
          duration: 0.3,
        });
      }
    };

    const onMouseLeave = () => {
      setIsHovering(false);
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(244, 241, 222, 0.3)',
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    document.body.addEventListener('mouseover', onMouseEnter);
    document.body.addEventListener('mouseout', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseover', onMouseEnter);
      document.body.removeEventListener('mouseout', onMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Main tiny dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-saffron rounded-full -translate-x-1/2 -translate-y-1/2"
      />
      {/* Lagging follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-parchment/30 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity duration-300"
      >
        <div className={`w-1 h-1 bg-saffron rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
}
