import { useRef, useEffect, useState } from 'react';
import ParticleText from '../components/ParticleText';
import InteractiveGraph from '../components/InteractiveGraph';
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
  const graphContainerRef = useRef<HTMLDivElement>(null);
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

      // Button - Fade in
      if (children[4]) {
        gsap.fromTo(children[4],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 }
        );
      }
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

    // Graph container animation
    if (graphContainerRef.current) {
      gsap.fromTo(graphContainerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, delay: 1, ease: 'power4.out' }
      );
    }

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

        // Fade out graph
        if (graphContainerRef.current) {
          graphContainerRef.current.style.opacity = String(1 - self.progress * 1.5);
          graphContainerRef.current.style.transform = `scale(${1 - self.progress * 0.2})`;
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden select-none bg-obsidian text-parchment bg-grid"
      style={{ zIndex: 1 }}
    >
      {/* DESKTOP UI */}
      {!isMobile && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Content Layout */}
          <div className="container mx-auto px-12 flex items-center justify-between z-10">
            {/* Left side: Text content */}
            <div className="flex-1 max-w-xl flex flex-col justify-center">
              <div className="w-full h-[120px] mb-6">
                <ParticleText text="INDRAAM STUDIO" fontSize={80} align="left" />
              </div>
              <p className="font-body text-fog/60 text-xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-500 fill-mode-both relative z-10 mb-10">
                We transform your business through <span className="text-saffron italic underline underline-offset-8 decoration-saffron/20">Agentic AI</span> and <span className="text-saffron italic underline underline-offset-8 decoration-saffron/20">robust software engineering</span>, building autonomous ecosystems that reason, scale, and deliver real-time intelligence.
              </p>
              <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-left-8 duration-1000 delay-700 fill-mode-both">
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-fit group relative px-8 py-4 bg-saffron text-obsidian font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:bg-parchment"
                >
                  <span className="relative z-10 flex items-center gap-3 font-bold">
                    Book Free Audit
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </button>

                <button 
                  onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-fit group relative px-8 py-4 bg-transparent border border-saffron/30 text-saffron font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:text-obsidian hover:border-saffron"
                >
                  <div className="absolute inset-0 bg-saffron translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-3">
                    Portfolio
                  </span>
                </button>
              </div>
            </div>

            {/* Right side: Interactive Graph */}
            <div ref={graphContainerRef} className="flex-1 h-full flex items-center justify-center">
              <InteractiveGraph />
            </div>
          </div>

          {/* Scroll Hint */}
          <div 
            ref={scrollHintRef}
            className="absolute bottom-12 w-full flex flex-col items-center gap-4 opacity-0 hidden lg:flex"
          >
            <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-fog/40 pointer-events-none">
              Explore our connected intelligence
            </span>
            <div className="flex flex-col items-center gap-1 animate-bounce-slow">
              <div className="w-px h-6 bg-gradient-to-b from-saffron/60 to-transparent" />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-saffron/40">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE UI */}
      {isMobile && (
        <div className="relative w-full h-full flex flex-col items-start justify-center px-8 z-10 pt-20">
          {/* Background Cinematic Texture */}
          <div className="absolute inset-0 z-0">
             <video 
               autoPlay muted loop playsInline
               className="w-full h-full object-cover opacity-20 grayscale"
               src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-4455-large.mp4"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
          </div>

          {/* Graph on Mobile (Smaller and above/below text) */}
          <div ref={graphContainerRef} className="w-full h-[300px] mb-8 relative z-10">
            <InteractiveGraph />
          </div>

          {/* Typography Grid */}
          <div ref={mobileTextRef} className="relative z-10 flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.6em] text-saffron uppercase mb-4 opacity-0">
              Est. 2026 // STUDIO
            </span>
            <h1 className="font-display text-[clamp(40px,12vw,60px)] leading-[0.85] tracking-tighter text-white opacity-0">
              INDRAAM
            </h1>
            <h1 className="font-display text-[clamp(40px,12vw,60px)] leading-[0.85] tracking-tighter text-transparent opacity-0" style={{ WebkitTextStroke: '1px rgba(244, 241, 222, 0.4)' }}>
              STUDIO
            </h1>
            
            <p className="mt-8 font-body text-fog/60 text-base max-w-[280px] leading-relaxed opacity-0 mb-8">
              Empowering businesses through <span className="text-saffron italic">Agentic AI</span> and robust software engineering.
            </p>

            <div className="flex flex-wrap items-center gap-4 opacity-0">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-fit group relative px-6 py-4 bg-saffron text-obsidian font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:bg-parchment"
              >
                <span className="relative z-10 flex items-center gap-3 font-bold">
                  Book Free Audit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </button>

              <button 
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-fit group relative px-6 py-4 bg-transparent border border-saffron/30 text-saffron font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:text-obsidian hover:border-saffron"
              >
                <div className="absolute inset-0 bg-saffron translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 flex items-center gap-3">
                  Portfolio
                </span>
              </button>
            </div>
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
