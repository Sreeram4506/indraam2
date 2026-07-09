import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBottomRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Curtain reveal - split screen wipe
        const exitTl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
            onComplete();
          },
        });

        exitTl
          .to(textRef.current, {
            scale: 1.3,
            opacity: 0,
            filter: 'blur(15px)',
            duration: 0.6,
            ease: 'power3.in',
          })
          .to(lineRef.current, {
            scaleX: 0,
            duration: 0.3,
            ease: 'power3.in',
          }, '<')
          .to(counterRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
          }, '<')
          .to(overlayTopRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power4.inOut',
          }, '-=0.1')
          .to(overlayBottomRef.current, {
            yPercent: 100,
            duration: 0.8,
            ease: 'power4.inOut',
          }, '<');
      },
    });

    // Staggered letter entrance
    tl.fromTo(
      wordsRef.current.filter(Boolean),
      {
        y: 120,
        rotateX: -90,
        opacity: 0,
      },
      {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.06,
        ease: 'expo.out',
      },
      0.2
    );

    // Sync progress value animation with the timeline (lasting 2.2 seconds)
    const progressObj = { value: 0 };
    tl.to(progressObj, {
      value: 100,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      }
    }, 0.35);

    // Progress line animation
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 2.2, ease: 'power2.out' },
      0.35
    );

    // Hold at 100% for a premium cinematic pause
    tl.to({}, { duration: 0.5 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const letters = 'INDRAAM'.split('');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Split curtain overlays */}
      <div
        ref={overlayTopRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-obsidian z-10"
      />
      <div
        ref={overlayBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-obsidian z-10"
      />

      {/* Content layer */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Main text */}
        <div
          ref={textRef}
          className="flex items-center overflow-hidden perspective-1000"
        >
          {letters.map((letter, i) => (
            <span
              key={i}
              ref={(el) => { wordsRef.current[i] = el; }}
              className="font-display text-[clamp(48px,12vw,140px)] text-parchment inline-block"
              style={{
                transformOrigin: 'bottom center',
                letterSpacing: '0.08em',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div className="mt-4 font-mono text-[10px] tracking-[0.6em] uppercase text-saffron/60">
          Creative Studio
        </div>

        {/* Progress line */}
        <div className="mt-12 w-48 h-[1px] bg-black/10 relative overflow-hidden">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-saffron origin-left"
          />
        </div>

        {/* Counter */}
        <span
          ref={counterRef}
          className="mt-4 font-mono text-xs tracking-[0.2em] text-fog/40 tabular-nums"
        >
          {Math.min(Math.round(progress), 100)}
        </span>
      </div>
    </div>
  );
}
