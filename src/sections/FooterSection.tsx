import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !marqueeRef.current) return;

    // Marquee animation
    const m1 = marqueeRef.current.querySelector('.marquee-inner');
    const tween1 = gsap.to(m1, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: 'none',
    });
    tween1.totalTime(1500);

    const isMobile = window.matchMedia('(max-width: 1023px)').matches || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);

    let st: any = null;
    if (!isMobile) {
      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const dir = self.direction === 1 ? 1 : -1;
          gsap.to(tween1, { timeScale: dir, duration: 0.5, overwrite: true });
        },
      });
    }

    // Fade in modules
    gsap.fromTo(
      containerRef.current?.querySelectorAll('.footer-mod') || [],
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      }
    );

    // Clock
    const updateClock = () => {
      const now = new Date();
      const clockEl = document.getElementById('footer-clock');
      if (clockEl) {
        clockEl.innerText = now.toLocaleTimeString('en-US', {
          hour12: false,
          timeZone: 'America/New_York'
        }) + ' EST';
      }
    };
    const clockInterval = setInterval(updateClock, 1000);
    updateClock();

    return () => {
      clearInterval(clockInterval);
      if (st) st.kill();
    };
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative bg-obsidian text-parchment overflow-hidden border-t border-white/5"
      style={{ zIndex: 10 }}
    >
      <div ref={containerRef} className="relative z-10 flex flex-col w-full">
        {/* Top HUD bar */}
        <div className="flex flex-col md:flex-row flex-wrap border-b border-white/5">
          <div className="footer-mod flex-1 min-w-[200px] p-5 border-b md:border-b-0 md:border-r border-white/5 flex justify-between items-center">
            <span className="font-mono text-[9px] tracking-widest uppercase text-saffron/60">
              42.3601°N, 71.0589°W
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-saffron rounded-full animate-pulse" />
              <span className="font-mono text-[9px] uppercase text-fog/50" id="footer-clock">00:00:00</span>
            </div>
          </div>
          <div className="footer-mod flex items-center justify-end p-5 flex-1 min-w-[200px]">
            <span className="font-mono text-[9px] tracking-widest uppercase text-fog/40">
              INDRAAM STUDIO &copy; 2026
            </span>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5">
          {/* Statement */}
          <div className="footer-mod p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 group relative overflow-hidden min-h-[280px]">
            <div className="absolute inset-0 bg-saffron/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <p className="font-display text-xl md:text-3xl leading-[1.15] tracking-tight max-w-md text-parchment/90 relative z-10">
              Step into the architecture of tomorrow — where code becomes material and design becomes dialogue.
            </p>
            <div className="mt-10 flex gap-3 relative z-10">
              {['IG', 'TW', 'LI', 'GH'].map((social) => (
                <div
                  key={social}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center hover:bg-saffron hover:text-obsidian hover:border-saffron transition-all duration-500 cursor-pointer"
                >
                  <span className="font-mono text-[8px]">{social}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="footer-mod p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-saffron/50 mb-5">Connect</span>
              <div className="group/email inline-block">
                <p className="font-display text-xl md:text-2xl cursor-pointer text-parchment transition-colors duration-500 group-hover/email:text-saffron">
                  hello@indraam.com
                </p>
                <div className="h-[1px] w-0 bg-saffron group-hover/email:w-full transition-all duration-700 ease-out" />
              </div>
              <p className="font-mono text-sm text-fog/40 mt-3 cursor-pointer hover:text-parchment/60 transition-colors">
                +1 (203) 640-2437
              </p>
            </div>
            <div className="mt-10">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative overflow-hidden group/btn px-7 py-3.5 border border-saffron/20 text-saffron font-mono text-[9px] uppercase tracking-widest transition-all duration-500 hover:text-obsidian"
              >
                <div className="absolute inset-0 bg-saffron translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10">Start a Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="footer-mod border-b border-white/5 overflow-hidden bg-saffron text-obsidian relative py-5">
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
          />
          <div ref={marqueeRef} className="py-1">
            <div className="marquee-inner flex whitespace-nowrap relative z-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className="font-display text-3xl md:text-5xl px-8 uppercase italic tracking-tighter cursor-default hover:skew-x-6 transition-transform duration-500">Creative Architecture</span>
                  <span className="w-2 h-2 bg-obsidian rounded-full mx-3" />
                  <span className="font-display text-3xl md:text-5xl px-8 uppercase tracking-tighter cursor-default hover:skew-x-6 transition-transform duration-500">Digital Solutions</span>
                  <span className="w-2 h-2 bg-obsidian rounded-full mx-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Logo */}
        <div className="footer-mod relative py-16 md:py-28 px-6 flex flex-col items-center justify-center text-center group/logo overflow-hidden pb-safe">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-saffron/5 blur-[100px] rounded-full pointer-events-none opacity-30 group-hover/logo:opacity-60 transition-all duration-1000 z-0 hidden lg:block" />

          <div className="w-full relative cursor-pointer z-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <h1 className="font-display text-[12vw] md:text-[10vw] leading-none tracking-tighter uppercase select-none text-parchment transition-transform duration-700 group-hover/logo:scale-[1.02]">
              Indraam{' '}
              <span
                className="text-transparent transition-colors duration-700 group-hover/logo:text-saffron/20"
                style={{ WebkitTextStroke: '1.5px rgba(244, 241, 222, 0.15)' }}
              >
                Studio
              </span>
            </h1>
          </div>

          <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-3xl px-4 opacity-50 hover:opacity-100 transition-opacity duration-500 relative z-10">
            <div className="flex flex-col items-start">
              <span className="font-mono text-[8px] uppercase tracking-widest text-saffron/60">Status</span>
              <span className="font-mono text-[9px] uppercase text-fog/60">All Systems Nominal</span>
            </div>

            <div
              className="flex flex-col items-center justify-center cursor-pointer hover:text-saffron transition-colors group/totop"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-px h-6 bg-white/15 mb-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-saffron -translate-y-full group-hover/totop:translate-y-0 transition-transform duration-500 ease-out" />
              </div>
              <span className="font-mono text-[8px] uppercase tracking-widest">Top</span>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="font-mono text-[8px] uppercase tracking-widest text-saffron/60">Version</span>
              <span className="font-mono text-[9px] uppercase text-fog/60">V2.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
