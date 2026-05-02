import { useRef, useEffect, useState } from 'react';
import ParticleText from '../components/ParticleText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  entranceComplete: boolean;
}

export default function HeroSection({ entranceComplete }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (entranceComplete && isMobile && mobileTextRef.current) {
      const children = mobileTextRef.current.children;
      
      // Est. 2026 - Fade in
      gsap.fromTo(children[0], 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      // INDRAAM - Diverge left
      gsap.fromTo(children[1],
        { opacity: 0, x: 100, skewX: -10 },
        { opacity: 1, x: 0, skewX: 0, duration: 1.5, ease: 'expo.out', delay: 0.2 }
      );

      // STUDIO - Diverge right
      gsap.fromTo(children[2],
        { opacity: 0, x: -100, skewX: 10 },
        { opacity: 1, x: 0, skewX: 0, duration: 1.5, ease: 'expo.out', delay: 0.3 }
      );

      // Paragraph - Fade in
      gsap.fromTo(children[3],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
      );
    }
  }, [entranceComplete, isMobile]);

  // Scroll hint fades out as you scroll
  useEffect(() => {
    if (!scrollHintRef.current || !entranceComplete) return;

    // Entrance animation for scroll hint
    gsap.fromTo(scrollHintRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 2, ease: 'power3.out' }
    );

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        if (scrollHintRef.current) {
          scrollHintRef.current.style.opacity = String(1 - self.progress * 3);
        }
        // Fade out particle canvas container
        const canvas = sectionRef.current?.querySelector('canvas');
        if (canvas) {
          canvas.style.opacity = String(1 - self.progress * 2);
          canvas.style.visibility = self.progress > 0.9 ? 'hidden' : 'visible';
        }
      },
    });

    return () => st.kill();
  }, [entranceComplete]);

  if (!entranceComplete) return null;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden select-none bg-obsidian text-parchment"
      style={{ zIndex: 1 }}
    >
      {/* DESKTOP UI: Interactive Particle Text */}
      {!isMobile && (
        <>
          <ParticleText text="INDRAAM STUDIO" fontSize={120} />
          <div 
            ref={scrollHintRef}
            className="absolute bottom-12 w-full flex flex-col items-center gap-4 opacity-0 hidden lg:flex"
          >
            <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-fog/40 pointer-events-none">
              Drag to dismantle // Release to restore
            </span>
            {/* Animated scroll arrow */}
            <div className="flex flex-col items-center gap-1 animate-bounce-slow">
              <div className="w-px h-6 bg-gradient-to-b from-saffron/60 to-transparent" />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-saffron/40">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </>
      )}

      {/* MOBILE UI: Cinematic Vertical Stack */}
      {isMobile && (
        <div className="relative w-full h-full flex flex-col items-start justify-center px-8 z-10">
          {/* Background Cinematic Texture for Mobile */}
          <div className="absolute inset-0 z-0">
             <video 
               autoPlay muted loop playsInline
               className="w-full h-full object-cover opacity-30 grayscale"
               src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-4455-large.mp4"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
          </div>

          {/* Typography Grid */}
          <div ref={mobileTextRef} className="relative z-10 flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.6em] text-saffron uppercase mb-8 opacity-0">
              Est. 2026 // STUDIO
            </span>
            <h1 className="font-display text-[clamp(60px,18vw,120px)] leading-[0.85] tracking-tighter text-white opacity-0">
              INDRAAM
            </h1>
            <h1 className="font-display text-[clamp(60px,18vw,120px)] leading-[0.85] tracking-tighter text-transparent opacity-0" style={{ WebkitTextStroke: '1px rgba(244, 241, 222, 0.4)' }}>
              STUDIO
            </h1>
            
            <p className="mt-12 font-body text-fog/60 text-lg max-w-[280px] leading-relaxed opacity-0">
              Shaping digital <span className="text-saffron italic">architectures</span> through minimalist code.
            </p>
          </div>

          {/* Mobile Scroll Hint */}
          <div className="absolute bottom-12 left-8 flex items-center space-x-4">
             <div className="w-[1px] h-12 bg-gradient-to-b from-saffron to-transparent" />
             <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-saffron/60">Scroll</span>
          </div>
        </div>
      )}
    </section>
  );
}
