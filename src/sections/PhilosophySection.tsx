import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    num: '01',
    title: 'Human-Centered',
    description: 'Technology should amplify human capability, not replace it. We design systems that feel intuitive and empower the people who use them.',
  },
  {
    num: '02',
    title: 'Built to Last',
    description: 'No shortcuts. Every line of code is architected for resilience, scalability, and the kind of longevity that outlasts trends.',
  },
  {
    num: '03',
    title: 'Obsessive Craft',
    description: 'Details matter. From micro-interactions to system architecture, we obsess over every layer to deliver something extraordinary.',
  },
];

const words = [
  { text: 'Craft', pos: 'left' },
  { text: 'Ambition', pos: 'right' },
  { text: 'Form', pos: 'left' },
  { text: 'Meaning', pos: 'right' },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.matchMedia('(max-width: 1023px)').matches || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        const label = headerRef.current.querySelector('.phi-label');
        const line = headerRef.current.querySelector('.phi-line');
        const heading = headerRef.current.querySelector('.phi-heading');
        const desc = headerRef.current.querySelectorAll('.phi-desc');

        gsap.fromTo(label,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
          }
        );

        gsap.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: 'expo.inOut',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
          }
        );

        gsap.fromTo(heading,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 75%' }
          }
        );

        gsap.fromTo(desc,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 65%' }
          }
        );
      }

      // Principles cards
      principlesRef.current.forEach((el, i) => {
        if (!el) return;

        gsap.fromTo(el,
          { opacity: 0, y: 80, x: i % 2 === 0 ? -30 : 30 },
          {
            opacity: 1, y: 0, x: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        if (!isMobile) {
          // Hover parallax on principles (desktop only)
          const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
            gsap.to(el, { x, y, duration: 0.5, ease: 'power2.out' });
          };
          const handleLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
          };
          el.addEventListener('mousemove', handleMove);
          el.addEventListener('mouseleave', handleLeave);
          
          // Cleanup function store on element (optional or handled in revert)
        }
      });

      // Manifesto text reveal
      if (manifestoRef.current) {
        const words = manifestoRef.current.querySelectorAll('.manifesto-word');
        if (isMobile) {
          // Simple stagger entrance on mobile (no laggy scroll scrub)
          gsap.fromTo(words,
            { opacity: 0.1, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.02,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: manifestoRef.current,
                start: 'top 85%',
              }
            }
          );
        } else {
          // Precise scrub on desktop
          gsap.fromTo(words,
            { opacity: 0.1 },
            {
              opacity: 1,
              stagger: 0.05,
              ease: 'none',
              scrollTrigger: {
                trigger: manifestoRef.current,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: true,
              }
            }
          );
        }
      }

      // Word parallax
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        
        if (isMobile) {
          // Simple fade & slide up on mobile without filter/blur and scrub
          gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
              }
            }
          );
        } else {
          // Desktop scrub with filter blur
          const xMove = i % 2 === 0 ? -120 : 120;
          gsap.fromTo(el,
            { opacity: 0, x: xMove, scale: 0.9, filter: 'blur(8px)' },
            {
              opacity: 1, x: 0, scale: 1, filter: 'blur(0px)',
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        }
      });
    }, section);

    // Interactive spotlight (desktop only)
    let handleMouseMove: (e: MouseEvent) => void;
    if (!isMobile && spotlightRef.current) {
      handleMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        gsap.to(spotlightRef.current, {
          x: e.clientX,
          y: e.clientY - rect.top,
          duration: 0.8,
          ease: 'power2.out'
        });
      };
      section.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (!isMobile && handleMouseMove) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
      ctx.revert();
    };
  }, []);

  const manifestoText = "We don't just build software. We architect living systems — intelligent, adaptive, and relentlessly focused on delivering value that compounds over time.";

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative bg-obsidian overflow-hidden py-32 lg:py-48"
      style={{ zIndex: 10 }}
    >
      {/* Interactive Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none opacity-15 blur-[80px] hidden lg:block"
        style={{ background: 'radial-gradient(circle, rgba(242, 204, 143, 0.4) 0%, transparent 70%)' }}
      />

      <div className="relative px-6 md:px-20 max-w-7xl mx-auto z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-32">
          <span className="phi-label font-mono text-[10px] tracking-[0.5em] text-saffron uppercase mb-8 block opacity-0">
            01 // Our Philosophy
          </span>
          <div className="phi-line h-px w-24 bg-saffron/30 mb-12 origin-left" />

          <h2 className="phi-heading font-display text-parchment text-[clamp(32px,5vw,64px)] leading-[1.05] mb-16 max-w-4xl">
            We believe the best technology is the kind you <span className="text-saffron italic">don't notice</span> — until you realize everything just <span className="text-saffron italic">works</span>.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-black/50 pt-12 max-w-4xl">
            <p className="phi-desc font-body text-parchment/80 text-lg leading-relaxed">
              We dismantle traditional workflows to build something more resilient. Every project is a dialogue between technology and human experience.
            </p>
            <p className="phi-desc font-body text-parchment/80 text-lg leading-relaxed">
              The goal isn't just to be seen — it's to be <em className="text-saffron/80">remembered</em>. We create digital foundations that stand the test of evolving trends.
            </p>
          </div>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {principles.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => { principlesRef.current[i] = el; }}
              className="group relative border border-black/50 p-8 lg:p-10 hover:border-saffron transition-all duration-700 bg-black/[0.01] lg:backdrop-blur-sm overflow-hidden"
            >
              {/* Hover fill effect */}
              <div className="absolute inset-0 bg-saffron/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

              <div className="relative z-10">
                <span className="font-mono text-[10px] tracking-[0.3em] text-saffron/50 uppercase mb-8 block">
                  {p.num}
                </span>
                <h3 className="font-display text-2xl lg:text-3xl text-parchment mb-4 group-hover:text-saffron transition-colors duration-500">
                  {p.title}
                </h3>
                <p className="font-body text-fog/50 text-sm leading-relaxed group-hover:text-fog/70 transition-colors duration-500">
                  {p.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-full h-[1px] bg-saffron/30" />
                <div className="absolute top-0 right-0 h-full w-[1px] bg-saffron/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Manifesto Text - Word by word reveal */}
        <div ref={manifestoRef} className="max-w-4xl mx-auto text-center mb-32 py-16">
          <p className="font-display text-[clamp(24px,3.5vw,48px)] leading-[1.2] tracking-tight">
            {manifestoText.split(' ').map((word, i) => (
              <span key={i} className="manifesto-word inline-block mr-[0.3em]">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Large Parallax Words */}
        <div className="flex flex-col space-y-2 md:space-y-0 relative">
          {words.map((word, i) => (
            <div
              key={word.text}
              ref={(el) => { wordRefs.current[i] = el; }}
              className={`relative ${word.pos === 'right' ? 'self-end text-right' : 'self-start text-left'}`}
            >
              <span
                className="font-display text-parchment select-none pointer-events-none opacity-80 hover:opacity-100 transition-opacity duration-1000"
                style={{
                  fontSize: 'clamp(70px, 18vw, 250px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.8,
                }}
              >
                {word.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Side accents */}
      <div className="absolute right-0 top-1/4 h-[500px] w-px bg-gradient-to-b from-transparent via-saffron/10 to-transparent" />
      <div className="absolute left-10 bottom-20 h-px w-32 bg-saffron/20" />
    </section>
  );
}
