import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    title: 'Agentic AI',
    category: 'INTELLIGENCE / AUTOMATION',
    description: 'Autonomous AI agents that reason, plan, and execute complex workflows — transforming operations with intelligent automation that adapts in real time.',
    icon: '⚡',
  },
  {
    num: '02',
    title: 'Computer Vision',
    category: 'ANALYSIS / DIAGNOSTICS',
    description: 'From medical imaging to quality control — our vision solutions turn visual data into actionable, real-time insights.',
    icon: '👁',
  },
  {
    num: '03',
    title: 'Web Applications',
    category: 'PERFORMANCE / SCALE',
    description: 'High-performance, responsive web applications built with modern frameworks — delivering seamless user experiences that scale.',
    icon: '◈',
  },
  {
    num: '04',
    title: 'Mobile Apps',
    category: 'CROSS-PLATFORM / NATIVE',
    description: 'Cross-platform mobile applications for iOS and Android — built for performance, accessibility, and native-quality experiences.',
    icon: '📱',
  },
  {
    num: '05',
    title: 'Data Pipelines',
    category: 'INGESTION / FLOW',
    description: 'End-to-end data pipeline engineering — ingestion, transformation, and orchestration for reliable data flow.',
    icon: '⟐',
  },
  {
    num: '06',
    title: 'Data Warehousing',
    category: 'STORAGE / ANALYTICS',
    description: 'Scalable data warehouses that unify your data sources, enabling fast analytics and data-driven decisions.',
    icon: '⬡',
  },
  {
    num: '07',
    title: 'DevOps & Cloud',
    category: 'CI-CD / INFRASTRUCTURE',
    description: 'CI/CD pipelines, infrastructure as code, container orchestration, and cloud architecture for resilient systems.',
    icon: '☁',
  },
  {
    num: '08',
    title: 'AI & ML Solutions',
    category: 'MODELS / NLP',
    description: 'Custom ML models, NLP systems, and generative AI tailored to your domain — data as competitive advantage.',
    icon: '🧠',
  },
  {
    num: '09',
    title: 'Compliance',
    category: 'HIPAA / SOC 2 / GDPR',
    description: 'HIPAA, SOC 2, and GDPR-ready architectures — secure data handling, encryption, and audit logging built in.',
    icon: '🛡',
  }
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 1, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 80%' }
          }
        );
      }

      // List items entrance
      if (listRef.current) {
        const items = listRef.current.querySelectorAll('.service-item');
        gsap.fromTo(items,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0,
            duration: 0.8, stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 75%' }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Animate detail panel when active service changes
  useEffect(() => {
    if (!detailRef.current) return;
    gsap.fromTo(detailRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
  }, [activeService]);

  const active = services[activeService];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-obsidian py-32 lg:py-48 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-saffron/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="px-6 md:px-20 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="font-mono text-[10px] tracking-[0.5em] text-saffron uppercase mb-6 block">
            02 // Capabilities
          </span>
          <div className="h-px w-16 bg-saffron/30 mb-8" />
          <h2 className="font-display text-parchment text-[clamp(36px,6vw,80px)] leading-[0.95]">
            EXPERTISE
          </h2>
        </div>

        {/* Services Layout: List + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Service List */}
          <div ref={listRef} className="lg:col-span-5">
            <div className="space-y-0">
              {services.map((service, i) => (
                <div
                  key={service.num}
                  className={`service-item group flex items-center gap-6 py-5 border-b border-white/5 cursor-pointer transition-all duration-500 ${
                    activeService === i
                      ? 'border-saffron/30'
                      : 'hover:border-white/15'
                  }`}
                  onMouseEnter={() => setActiveService(i)}
                  onClick={() => setSelectedService(service.title)}
                >
                  <span className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${
                    activeService === i ? 'text-saffron' : 'text-fog/30'
                  }`}>
                    {service.num}
                  </span>

                  <div className="flex-1">
                    <h3 className={`font-display text-xl lg:text-2xl transition-all duration-500 ${
                      activeService === i
                        ? 'text-parchment translate-x-2'
                        : 'text-fog/40 group-hover:text-fog/70'
                    }`}>
                      {service.title}
                    </h3>
                  </div>

                  {/* Active indicator */}
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    activeService === i
                      ? 'bg-saffron scale-100'
                      : 'bg-transparent scale-0'
                  }`} />

                  {/* Arrow */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className={`transition-all duration-500 ${
                      activeService === i
                        ? 'text-saffron opacity-100 translate-x-0'
                        : 'text-fog/20 opacity-0 -translate-x-2'
                    }`}
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-7 relative">
            <div className="lg:sticky lg:top-32">
              <div
                ref={detailRef}
                className="relative border border-white/5 bg-white/[0.01] backdrop-blur-sm p-10 lg:p-14 overflow-hidden"
              >
                {/* Background number */}
                <div className="absolute top-0 right-0 font-display text-[200px] leading-none text-white/[0.02] pointer-events-none select-none -mt-8 -mr-4">
                  {active.num}
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-saffron/20" />
                  <div className="absolute top-0 left-0 h-full w-[1px] bg-saffron/20" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">{active.icon}</span>
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-saffron/60">
                      {active.category}
                    </span>
                  </div>

                  <h3 className="font-display text-[clamp(36px,4vw,64px)] text-parchment leading-[1] mb-8">
                    {active.title}
                  </h3>

                  <p className="font-body text-fog/60 text-lg leading-relaxed mb-10 max-w-lg">
                    {active.description}
                  </p>

                  <button
                    onClick={() => setSelectedService(active.title)}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 border border-saffron/30 text-saffron font-mono text-[10px] uppercase tracking-widest transition-all duration-500 hover:text-obsidian overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-saffron translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10">Request Expertise</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 transform group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tech stack preview */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['React', 'Python', 'AWS', 'TensorFlow', 'Node.js', 'K8s'].map((tech) => (
                  <div key={tech} className="text-center py-3 border border-white/5 font-mono text-[9px] tracking-widest uppercase text-fog/30 hover:text-saffron/50 hover:border-saffron/10 transition-all duration-300">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
