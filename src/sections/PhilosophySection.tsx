import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const words = [
  { text: 'Craft', pos: 'left' },
  { text: 'Ambition', pos: 'right' },
  { text: 'Form', pos: 'left' },
  { text: 'Meaning', pos: 'right' },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Label slide-in — ONE-TIME REVEAL
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1, x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { 
                trigger: labelRef.current, 
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
          }
        );
      }
 
      // Accent line draws in — ONE-TIME REVEAL
      if (accentLineRef.current) {
        gsap.fromTo(accentLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'expo.inOut',
            scrollTrigger: { 
                trigger: accentLineRef.current, 
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
          }
        );
      }
 
      // Intro text — ONE-TIME REVEAL for better readability
      if (introRef.current) {
        const lines = introRef.current.querySelectorAll('.phi-line');
        gsap.fromTo(lines,
          { opacity: 0, y: 60, skewX: 5 },
          {
            opacity: 1, y: 0, skewX: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: { 
                trigger: introRef.current, 
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
          }
        );
      }
 
      // Word reveal — keep as horizontal parallax scrub but more visible
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const xMove = i % 2 === 0 ? -150 : 150;
        gsap.fromTo(el,
          { opacity: 0, x: xMove, scale: 0.85, filter: 'blur(10px)' },
          {
            opacity: 0.8, x: 0, scale: 1, filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: { 
              trigger: el, 
              start: 'top bottom', 
              end: 'bottom top', 
              scrub: true 
            }
          }
        );
      });
    }, section);
 
    // Interactive spotlight
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = section.getBoundingClientRect();
      gsap.to(spotlightRef.current, {
        x: clientX,
        y: clientY - rect.top,
        duration: 0.8,
        ease: 'power2.out'
      });
    };
    section.addEventListener('mousemove', handleMouseMove);
 
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, []);
 
  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative bg-obsidian overflow-hidden py-32"
      style={{ zIndex: 2 }}
    >
      {/* Interactive Spotlight Overlay */}
      <div 
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none opacity-20 blur-[60px]"
        style={{
            background: 'radial-gradient(circle, rgba(242, 204, 143, 0.4) 0%, transparent 70%)',
        }}
      />
 
      {/* Section content */}
      <div className="relative py-12 md:py-24 px-6 md:px-20 max-w-7xl mx-auto z-10">
        <div className="mb-24">
          <span ref={labelRef} className="font-mono text-[10px] tracking-[0.5em] text-saffron uppercase mb-12 block opacity-0">
            01 // Our Ethos
          </span>
          <div ref={accentLineRef} className="h-px w-24 bg-saffron/30 mb-12 origin-left" />
          <div ref={introRef} className="max-w-4xl">
            <h2 className="phi-line font-display text-parchment text-[clamp(32px,5vw,64px)] leading-[1.1] mb-12">
              Architecture isn't just about space. It's about the <span className="text-saffron italic">invisible energy</span> between the lines.
            </h2>
            <div className="phi-line grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                <p className="font-body text-parchment/90 text-lg leading-relaxed">
                  We dismantle traditional workflows to build something more resilient. Every project is a dialogue between technology and human experience.
                </p>
                <p className="font-body text-parchment/90 text-lg leading-relaxed">
                  The goal isn't just to be seen — it's to be remembered. We create digital foundations that stand the test of evolving trends.
                </p>
            </div>
          </div>
        </div>
 
        {/* Large Parallax Words */}
        <div className="flex flex-col space-y-4 md:space-y-0 relative">
          {words.map((word, i) => (
            <div
              key={word.text}
              ref={(el) => { wordRefs.current[i] = el; }}
              className={`relative ${
                word.pos === 'right' ? 'self-end text-right' : 'self-start text-left'
              }`}
            >
              <span
                className="font-display text-white select-none pointer-events-none opacity-40 hover:opacity-10 transition-opacity duration-1000"
                style={{
                  fontSize: 'clamp(80px, 20vw, 280px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.8
                }}
              >
                {word.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute right-0 top-1/4 h-[500px] w-px bg-gradient-to-b from-transparent via-saffron/10 to-transparent" />
      <div className="absolute left-10 bottom-20 h-px w-32 bg-saffron/20" />
    </section>
  );
}
