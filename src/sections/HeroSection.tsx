import { lazy, Suspense, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ParticleText = lazy(() => import('../components/ParticleText'));
const FlowingNodeGraph = lazy(() => import('../components/FlowingNodeGraph'));

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  entranceComplete: boolean;
}

export default function HeroSection({ entranceComplete }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Entrance animation timeline
  useEffect(() => {
    if (!entranceComplete || !sectionRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Tagline words reveal with stagger
    if (taglineRef.current) {
      const words = taglineRef.current.querySelectorAll('.word');
      tl.fromTo(words,
        { y: 120, opacity: 0, rotateX: -45, skewY: 3 },
        { y: 0, opacity: 1, rotateX: 0, skewY: 0, duration: 1.4, stagger: 0.1 },
        0.2
      );
    }

    // Subtitle slide up
    tl.fromTo(subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.8
    );

    // CTA buttons
    tl.fromTo(ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      1.0
    );

    // Visual showcase entrance
    tl.fromTo(visualRef.current,
      { opacity: 0, scale: 0.8, rotate: -5 },
      { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'power4.out' },
      0.6
    );

    // Scroll hint
    tl.fromTo(scrollHintRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      2
    );

    return () => { tl.kill(); };
  }, [entranceComplete]);

  // Parallax scroll effect
  useEffect(() => {
    if (!entranceComplete || !sectionRef.current || isMobile) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const p = self.progress;

        if (scrollHintRef.current) {
          scrollHintRef.current.style.opacity = String(1 - p * 4);
        }

        if (taglineRef.current) {
          taglineRef.current.style.transform = `translateY(${p * -80}px)`;
          taglineRef.current.style.opacity = String(1 - p * 1.5);
        }

        if (subtitleRef.current) {
          subtitleRef.current.style.transform = `translateY(${p * -60}px)`;
          subtitleRef.current.style.opacity = String(1 - p * 2);
        }

        if (visualRef.current) {
          visualRef.current.style.transform = `translateY(${p * 60}px) scale(${1 + p * 0.05})`;
        }
      },
    });

    return () => st.kill();
  }, [entranceComplete, isMobile]);

  if (!entranceComplete) return (
    <section id="hero" className="relative min-h-screen bg-obsidian" style={{ zIndex: 1 }} />
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden select-none bg-obsidian text-parchment"
      style={{ zIndex: 1 }}
    >
      {/* Ambient background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-saffron/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-terracotta/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-screen py-32">
          {/* Left: Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Main headline - Particle text on desktop, styled text on mobile */}
            {!isMobile ? (
              <div className="w-full h-[120px] mb-4">
                <Suspense fallback={<div className="w-full h-full" />}>
                  <ParticleText text="INDRAAM STUDIO" fontSize={80} align="left" />
                </Suspense>
              </div>
            ) : null}

            {/* Tagline */}
            <div ref={taglineRef} className="mb-8 perspective-1000 overflow-hidden">
              {isMobile && (
                <h1 className="font-display text-[clamp(36px,10vw,48px)] leading-[0.9] tracking-tight mb-4">
                  <span className="word inline-block">INDRAAM</span>{' '}
                  <span className="word inline-block text-transparent" style={{ WebkitTextStroke: '1px rgba(244, 241, 222, 0.5)' }}>STUDIO</span>
                </h1>
              )}
              <h2 className="font-display text-[clamp(28px,4vw,52px)] leading-[1.05] tracking-tight">
                <span className="word inline-block">We</span>{' '}
                <span className="word inline-block">engineer</span>{' '}
                <span className="word inline-block text-saffron italic">autonomous</span>{' '}
                <span className="word inline-block">systems</span>{' '}
                <br className="hidden lg:block" />
                <span className="word inline-block">that</span>{' '}
                <span className="word inline-block text-saffron italic">think,</span>{' '}
                <span className="word inline-block text-saffron italic">adapt,</span>{' '}
                <span className="word inline-block">&</span>{' '}
                <span className="word inline-block">deliver.</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="font-body text-fog/50 text-base lg:text-lg leading-relaxed max-w-lg mb-10 border-l-2 border-saffron/20 pl-6"
            >
              From <span className="text-parchment/80">Agentic AI</span> to full-stack applications —
              we architect digital ecosystems that don't just run, they <span className="text-saffron/80 italic">reason</span>.
            </p>

            {/* CTA */}
            <div ref={ctaRef} className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto flex justify-center group relative px-8 py-4 bg-saffron text-obsidian font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(242,204,143,0.3)]"
              >
                <div className="absolute inset-0 bg-parchment translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center gap-3 font-bold">
                  Book Free Audit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1.5 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </button>

              <button
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto flex justify-center group relative px-8 py-4 border border-white/15 text-parchment font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:border-saffron/50"
              >
                <div className="absolute inset-0 bg-saffron/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center gap-3">
                  View Work
                  <span className="inline-block w-1.5 h-1.5 bg-saffron rounded-full group-hover:scale-150 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Right: Visual showcase - Flowing Node Graph */}
          {!isMobile && (
            <div className="lg:col-span-5 relative mt-12 lg:mt-0" ref={visualRef}>
              <div className="relative w-full aspect-square max-w-[300px] md:max-w-none mx-auto">
                <Suspense fallback={<div className="w-full h-full" />}>
                  <FlowingNodeGraph />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-fog/30">
          Scroll to explore
        </span>
        <div className="relative w-[1px] h-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-saffron/60 to-transparent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
