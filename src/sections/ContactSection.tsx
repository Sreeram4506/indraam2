import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.contact-word');
        gsap.fromTo(words,
          { y: 100, opacity: 0, rotateX: -30 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1.2, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 80%' }
          }
        );
      }

      // Form fields entrance
      if (formRef.current) {
        const fields = formRef.current.querySelectorAll('.form-field');
        gsap.fromTo(fields,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: formRef.current, start: 'top 75%' }
          }
        );
      }

      // Info panel
      if (infoRef.current) {
        gsap.fromTo(infoRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0,
            duration: 1, ease: 'expo.out',
            scrollTrigger: { trigger: infoRef.current, start: 'top 80%' }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-obsidian py-32 lg:py-48 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background accents */}
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-saffron/3 rounded-full blur-[150px] pointer-events-none hidden lg:block" />

      <div className="px-6 md:px-20 max-w-7xl mx-auto relative z-10">
        {/* Section label */}
        <span className="font-mono text-[10px] tracking-[0.5em] text-saffron uppercase mb-6 block">
          04 // Get in Touch
        </span>
        <div className="h-px w-16 bg-saffron/30 mb-16" />

        {/* Heading */}
        <div ref={headingRef} className="mb-20 perspective-1000 overflow-hidden">
          <h2 className="font-display text-[clamp(40px,8vw,100px)] leading-[0.95] tracking-tight">
            <span className="contact-word inline-block">Got</span>{' '}
            <span className="contact-word inline-block">a</span>{' '}
            <span className="contact-word inline-block text-saffron italic">vision</span>
            <span className="contact-word inline-block">?</span>
            <br />
            <span className="contact-word inline-block">Let's</span>{' '}
            <span className="contact-word inline-block">make</span>{' '}
            <span className="contact-word inline-block">it</span>{' '}
            <span className="contact-word inline-block text-saffron italic">real</span>
            <span className="contact-word inline-block">.</span>
          </h2>
        </div>

        {/* Form + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <form
              ref={formRef}
              className="space-y-10"
              onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll be in touch.'); }}
            >
              <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-fog/40 mb-3">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-transparent border-b border-white/10 pb-4 text-parchment text-lg placeholder:text-fog/20 focus:border-saffron/50 focus:outline-none transition-colors duration-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-fog/40 mb-3">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="john@company.com"
                    className="w-full bg-transparent border-b border-white/10 pb-4 text-parchment text-lg placeholder:text-fog/20 focus:border-saffron/50 focus:outline-none transition-colors duration-500"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-fog/40 mb-3">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Your company name"
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-parchment text-lg placeholder:text-fog/20 focus:border-saffron/50 focus:outline-none transition-colors duration-500"
                />
              </div>

              <div className="form-field">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-fog/40 mb-3">
                  What can we help with?
                </label>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Agentic AI', 'Web App', 'Mobile App', 'Computer Vision', 'Data Pipeline', 'Other'].map((tag) => (
                    <label key={tag} className="group cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <span className="inline-block px-5 py-3 border border-white/10 font-mono text-[10px] uppercase tracking-widest text-fog/40 peer-checked:border-saffron/50 peer-checked:text-saffron peer-checked:bg-saffron/5 hover:border-white/20 hover:text-fog/60 transition-all duration-300">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-fog/40 mb-3">
                  Tell us about your project
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your vision..."
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-parchment text-lg placeholder:text-fog/20 focus:border-saffron/50 focus:outline-none transition-colors duration-500 resize-none"
                />
              </div>

              <div className="form-field pt-4">
                <button
                  type="submit"
                  className="group relative inline-flex items-center gap-4 px-10 py-5 min-h-[48px] bg-saffron text-obsidian font-mono text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(242,204,143,0.2)]"
                >
                  <div className="absolute inset-0 bg-parchment translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-600 ease-out" />
                  <span className="relative z-10 font-bold">Send Message</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transform group-hover:translate-x-1.5 group-hover:-translate-y-1 transition-transform duration-300">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div ref={infoRef} className="lg:col-span-5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-10">
              {/* Email */}
              <div className="group">
                <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-saffron/50 mb-3">Email</span>
                <a href="mailto:hello@indraam.com" className="font-display text-2xl lg:text-3xl text-parchment hover:text-saffron transition-colors duration-500">
                  hello@indraam.com
                </a>
                <div className="h-[1px] w-0 bg-saffron group-hover:w-full transition-all duration-700 mt-2" />
              </div>

              {/* Phone */}
              <div className="group">
                <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-saffron/50 mb-3">Phone</span>
                <a href="tel:+12036402437" className="font-display text-xl text-parchment/80 hover:text-saffron transition-colors duration-500">
                  +1 (203) 640-2437
                </a>
              </div>

              {/* Location */}
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-saffron/50 mb-3">Location</span>
                <p className="font-body text-fog/60 text-sm leading-relaxed">
                  United States<br />
                  Available worldwide
                </p>
              </div>

              {/* Quick CTA buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <a href="tel:+12036402437" className="group flex items-center justify-between px-6 py-4 border border-white/10 hover:border-saffron/30 transition-all duration-500">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-fog/60 group-hover:text-parchment transition-colors">
                    Schedule a Call
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fog/30 group-hover:text-saffron transition-colors">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a href="mailto:hello@indraam.com" className="group flex items-center justify-between px-6 py-4 border border-white/10 hover:border-saffron/30 transition-all duration-500">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-fog/60 group-hover:text-parchment transition-colors">
                    Email Us
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fog/30 group-hover:text-saffron transition-colors">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>

              {/* Social */}
              <div className="pt-4">
                <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-fog/20 mb-4">Follow</span>
                <div className="flex gap-3">
                  {['IG', 'TW', 'LI', 'GH'].map((social) => (
                    <div
                      key={social}
                      className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-saffron hover:text-obsidian hover:border-saffron hover:scale-110 transition-all duration-500 cursor-pointer"
                    >
                      <span className="font-mono text-[9px]">{social}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
