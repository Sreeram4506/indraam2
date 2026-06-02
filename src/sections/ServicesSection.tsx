import { useEffect, useRef, useState, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { expertise as services } from '../data/expertise';
import { addInterest } from '../lib/interests';

gsap.registerPlugin(ScrollTrigger);

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

  const active = services[activeService] || services[0];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addInterest({
      source: 'expertise',
      service: String(formData.get('service') || selectedService || ''),
      name: String(formData.get('name') || '').trim(),
      businessName: String(formData.get('businessName') || '').trim(),
      contactNumber: String(formData.get('contactNumber') || '').trim(),
      email: String(formData.get('email') || '').trim(),
    });

    alert('Request submitted!');
    e.currentTarget.reset();
    setSelectedService(null);
  };

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
                <div key={service.num} className="flex flex-col border-b border-white/5">
                  <div
                    className={`service-item group flex items-center gap-6 py-5 cursor-pointer transition-all duration-500 ${
                      activeService === i
                        ? 'lg:border-saffron/30'
                        : 'hover:border-white/15'
                    }`}
                    onMouseEnter={() => window.innerWidth >= 1024 && setActiveService(i)}
                    onClick={() => {
                      if (window.innerWidth >= 1024) {
                        setSelectedService(service.title);
                      } else {
                        setActiveService(activeService === i ? -1 : i);
                      }
                    }}
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
                    <div className={`hidden lg:block w-2 h-2 rounded-full transition-all duration-500 ${
                      activeService === i
                        ? 'bg-saffron scale-100'
                        : 'bg-transparent scale-0'
                    }`} />

                    {/* Arrow / Plus-Minus for mobile */}
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className={`hidden lg:block transition-all duration-500 ${
                        activeService === i
                          ? 'text-saffron opacity-100 translate-x-0'
                          : 'text-fog/20 opacity-0 -translate-x-2'
                      }`}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                    
                    {/* Mobile toggle icon */}
                    <div className={`lg:hidden w-6 h-6 flex items-center justify-center transition-transform duration-300 ${activeService === i ? 'rotate-180 text-saffron' : 'text-fog/40'}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Mobile Accordion Detail Content */}
                  <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${activeService === i ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-[52px] pr-4 space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{service.icon}</span>
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-saffron/60">
                          {service.category}
                        </span>
                      </div>
                      
                      <p className="font-body text-fog/60 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service.title);
                        }}
                        className="group relative inline-flex items-center gap-3 px-6 py-3 border border-saffron/30 text-saffron font-mono text-[10px] uppercase tracking-widest transition-all duration-500 hover:text-obsidian overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-saffron translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10">Request</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 transform group-hover:translate-x-1 transition-transform">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="hidden lg:block lg:col-span-7 relative">
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Service</label>
                <select
                  name="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-saffron font-mono text-[16px] md:text-[11px] uppercase tracking-widest focus:border-saffron focus:outline-none transition-colors appearance-none cursor-pointer"
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
                <input name="name" required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-[16px] md:text-sm text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Business Name</label>
                <input name="businessName" required type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-[16px] md:text-sm text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Contact Number</label>
                <input name="contactNumber" required type="tel" className="w-full bg-transparent border-b border-white/20 pb-2 text-[16px] md:text-sm text-parchment focus:border-saffron focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-fog/60 mb-2">Email</label>
                <input name="email" required type="email" className="w-full bg-transparent border-b border-white/20 pb-2 text-[16px] md:text-sm text-parchment focus:border-saffron focus:outline-none transition-colors" />
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
