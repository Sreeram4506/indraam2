import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 100);

    // Breathing animation
    let startTime = Date.now();
    const animateBreath = () => {
      if (!turbRef.current) return;
      const now = Date.now();
      const elapsed = (now - startTime) * 0.001;
      const baseFreq = 0.015 + Math.sin(elapsed) * 0.005;
      turbRef.current.setAttribute(
        'baseFrequency',
        `${baseFreq} ${baseFreq}`
      );
      rafRef.current = requestAnimationFrame(animateBreath);
    };
    rafRef.current = requestAnimationFrame(animateBreath);

    // Entrance timeline
    const tl = gsap.timeline({
      onComplete: () => {
        cancelAnimationFrame(rafRef.current);
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
            onComplete();
          },
        });
      },
    });

    // Stroke draw-in
    if (textRef.current) {
      const length = textRef.current.getComputedTextLength?.() || 600;
      gsap.set(textRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      tl.to(
        textRef.current,
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
        },
        0.5
      );
    }

    // Hold for a moment then fade
    tl.to({}, { duration: 0.8 });

    return () => {
      clearInterval(progressInterval);
      cancelAnimationFrame(rafRef.current);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 300 100"
        className="w-64 md:w-80"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="breathe-filter">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="25"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
        </defs>
        <text
          ref={textRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          filter="url(#breathe-filter)"
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: '32px',
            fontWeight: 400,
            fill: 'none',
            stroke: '#F4F1DE',
            strokeWidth: '0.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
          }}
        >
          Indraam Studio
        </text>
      </svg>

      <div className="mt-12 font-mono text-xs tracking-[0.12em] text-fog uppercase">
        {Math.min(Math.round(progress), 100)}%
      </div>
    </div>
  );
}
