import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    title: 'Agentic AI',
    category: 'INTELLIGENCE / AUTOMATION / WORKFLOW',
    description: 'Autonomous AI agents that reason, plan, and execute complex workflows — transforming operations with intelligent automation that adapts in real time.',
  },
  {
    num: '02',
    title: 'Computer Vision',
    category: 'ANALYSIS / DIAGNOSTICS / INSIGHTS',
    description: 'From medical imaging and diagnostics to quality control and security — our vision solutions turn visual data into actionable, real-time insights.',
  },
  {
    num: '03',
    title: 'Web Applications',
    category: 'PERFORMANCE / RESPONSIVE / SCALE',
    description: 'High-performance, responsive web applications built with modern frameworks — delivering seamless user experiences that scale with your business.',
  },
  {
    num: '04',
    title: 'Mobile Apps',
    category: 'CROSS-PLATFORM / NATIVE / ACCESSIBILITY',
    description: 'Cross-platform mobile applications for iOS and Android — built for performance, accessibility, and native-quality user experiences.',
  },
  {
    num: '05',
    title: 'Data Pipelines',
    category: 'INGESTION / TRANSFORMATION / FLOW',
    description: 'End-to-end data pipeline engineering — ingestion, transformation, and orchestration — ensuring your data flows reliably from source to insight.',
  },
  {
    num: '06',
    title: 'Data Warehousing',
    category: 'STORAGE / ANALYTICS / UNIFICATION',
    description: 'Scalable data warehouses that unify your data sources, enabling fast analytics and data-driven decision-making across your organization.',
  },
  {
    num: '07',
    title: 'DevOps & Cloud',
    category: 'CI-CD / INFRASTRUCTURE / RESILIENCE',
    description: 'CI/CD pipelines, infrastructure as code, container orchestration, and cloud architecture — streamlining deployments and keeping systems resilient.',
  },
  {
    num: '08',
    title: 'AI & ML Solutions',
    category: 'MODELS / NLP / COMPETITIVE EDGE',
    description: 'Custom machine learning models, NLP systems, and generative AI tailored to your domain — turning your data into a competitive advantage.',
  },
  {
    num: '09',
    title: 'Compliance & Security',
    category: 'HIPAA / SOC 2 / ARCHITECTURE',
    description: 'HIPAA, SOC 2, and GDPR-ready architectures from the ground up — secure data handling, access controls, encryption, and audit logging built into every solution.',
  }
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardsRef.current;
    if (!section || !container || !cards) return;

    const ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray<HTMLElement>('.service-card');
      const totalCards = cardElements.length;

      // Header entrance
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      );

      // PINNED HORIZONTAL SCROLL
      // This timeline handles the horizontal entrance and the final "stacking"
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalCards * 60}%`, // Longer pinning for comfortable reading
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // 1. Entrance phase: Cards slide in from right to left one by one
      cardElements.forEach((card, i) => {
        // Initial state: Off-screen to the right
        gsap.set(card, { xPercent: 150, opacity: 0, scale: 0.8, rotate: 5 });

        // Slide in to center
        tl.to(card, {
          xPercent: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: 'power2.out',
        }, i * 1.5); // Sequence them with more spacing

        // Animate the description to appear as the card settles
        const desc = card.querySelector('.service-desc');
        if (desc) {
          tl.to(desc, {
             opacity: 1,
             y: 0,
             duration: 0.5,
             ease: 'power2.out'
          }, (i * 1.5) + 0.5); // Start halfway through the card sliding in
        }

        // After settling in center, push previous card slightly back and left (stacking feel)
        if (i > 0) {
          tl.to(cardElements[i - 1], {
            xPercent: -30,
            scale: 0.9,
            opacity: 0.3, // Fade it more so current card is clear
            duration: 0.5,
            ease: 'power1.inOut'
          }, i * 1.5);
        }
      });

      // 2. Final Stacking phase: After all cards are in, they "stack up" into a tighter grid/row
      tl.to(cardElements, {
        xPercent: (i) => (i - (totalCards - 1) / 2) * 15, // Pack tighter for 9 cards
        scale: 0.85,
        opacity: 0.8,
        rotate: (i) => (i % 2 === 0 ? -2 : 2),
        duration: 1,
        ease: 'back.out(1.2)'
      }, 'stack');

      // EXIT ANIMATION: Fade out everything as the next section approaches
      // This prevents the pinned expertise from overlapping with the portfolio
      tl.to(container, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: 'power2.in'
      }, '+=0.1');

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-obsidian border-t border-white/5 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div 
        ref={containerRef} 
        className="relative h-screen w-full flex flex-col items-center justify-center"
      >
        <div ref={headerRef} className="absolute top-12 left-6 md:left-20 z-20">
          <span className="font-mono text-[10px] tracking-[0.5em] text-saffron uppercase mb-4 block">03 // Capabilities</span>
          <h2 className="font-display text-parchment text-[clamp(32px,5vw,64px)] leading-none -ml-1">
            EXPERTISE
          </h2>
        </div>

        {/* Card Container */}
        <div 
          ref={cardsRef} 
          className="relative w-full h-full flex items-center justify-center perspective-1000"
        >
          {services.map((service, i) => (
            <div
              key={service.num}
              onClick={() => setSelectedService(service.title)}
              className="service-card absolute w-[85vw] md:w-[45vw] aspect-[4/5] md:aspect-[16/10] bg-ink/40 backdrop-blur-xl border border-white/10 p-8 md:p-16 flex flex-col justify-between cursor-pointer hover:border-saffron/50 transition-colors group/card"
            >
              <div>
                <div className="flex items-center space-x-4 mb-12">
                  <span className="font-mono text-sm text-saffron">{service.num}</span>
                  <div className="h-px flex-1 bg-saffron/20" />
                </div>
                <h3 className="font-display text-parchment text-[clamp(28px,4vw,64px)] leading-[1.1] mb-6">
                  {service.title}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-saffron/60">
                  {service.category}
                </p>
              </div>

              <p className="service-desc font-body text-fog/60 text-lg leading-relaxed max-w-md opacity-0 translate-y-10">
                {service.description}
              </p>

              {/* Decorative fragment */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <span className="font-display text-8xl leading-none">0{i+1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/95 backdrop-blur-xl">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-lg bg-ink border border-white/10 p-8 md:p-12 shadow-2xl">
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 text-fog hover:text-saffron transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h3 className="font-display text-2xl text-parchment mb-8">Request Expertise</h3>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Request submitted!'); setSelectedService(null); }}>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Service</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-saffron font-mono text-[11px] uppercase tracking-widest focus:border-saffron focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.num} value={s.title} className="bg-obsidian text-parchment">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Name</label>
                <input required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Business Name</label>
                <input required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Contact Number</label>
                <input required type="tel" className="w-full bg-transparent border-b border-white/20 pb-2 text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Email</label>
                <input required type="email" className="w-full bg-transparent border-b border-white/20 pb-2 text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              
              <button type="submit" className="w-full mt-8 relative overflow-hidden group/btn px-8 py-4 border border-saffron/30 text-saffron font-mono text-[10px] uppercase tracking-widest transition-all duration-500 hover:text-obsidian">
                <div className="absolute inset-0 bg-saffron translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-expo" />
                <span className="relative z-10">Submit Request</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
