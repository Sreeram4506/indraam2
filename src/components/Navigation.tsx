import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation, useNavigate } from 'react-router';

gsap.registerPlugin(ScrollTrigger);

interface NavigationProps {
  visible: boolean;
}

export default function Navigation({ visible }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Nav entrance
  useEffect(() => {
    if (!navRef.current || !visible) return;
    gsap.to(navRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });
  }, [visible]);

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setScrolled(scrollY > 50);
        if (logoRef.current) {
          const scale = Math.max(0.85, 1 - (scrollY / 300) * 0.15);
          logoRef.current.style.transform = `scale(${scale})`;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section using native IntersectionObserver (Desktop only)
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);
    if (isMobile) return;

    const sectionIds = ['hero', 'philosophy', 'services', 'work', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navItems = [
    { label: 'Philosophy', id: 'philosophy' },
    { label: 'Services', id: 'services' },
    { label: 'Work', id: 'work' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 opacity-0 -translate-y-2 transition-all duration-700 bg-transparent ${
        scrolled ? 'py-2' : 'py-4'
      }`}
      style={{ padding: '0 5vw' }}
    >
      <div className="flex items-center justify-between h-16 relative">
        {/* Left Side Items */}
        <div className="hidden md:flex items-center gap-12">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300 group ${
                activeSection === item.id
                  ? 'text-saffron'
                  : 'text-fog/40 hover:text-parchment'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-saffron transition-all duration-500 ${
                activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </div>

        {/* Center Logo — desktop only (mobile has logo on left) */}
        <button
          onClick={() => scrollTo('hero')}
          className={`hidden md:block absolute left-1/2 -translate-x-1/2 font-display text-lg tracking-[0.4em] text-parchment hover:text-saffron transition-all duration-1000 pointer-events-auto ${
            scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
          }`}
        >
          <span ref={logoRef} className="block origin-center transition-transform duration-75">
            INDRAAM
          </span>
        </button>

        {/* Right Side Items */}
        <div className="hidden md:flex items-center gap-12">
          {navItems.slice(2).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300 group ${
                activeSection === item.id
                  ? 'text-saffron'
                  : 'text-fog/40 hover:text-parchment'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-saffron transition-all duration-500 ${
                activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </div>

        {/* Mobile Logo (left side) */}
        <button
          onClick={() => scrollTo('hero')}
          className="md:hidden font-display text-base tracking-[0.3em] text-parchment"
        >
          INDRAAM
        </button>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] z-[60]"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[1.5px] bg-parchment transition-all duration-500 origin-left ${
              menuOpen ? 'rotate-45 translate-x-[1px] w-[24px]' : ''
            }`}
          />
          <span
            className={`block h-[1.5px] bg-parchment transition-all duration-300 ${
              menuOpen ? 'opacity-0 w-0' : 'w-4'
            }`}
          />
          <span
            className={`block w-6 h-[1.5px] bg-parchment transition-all duration-500 origin-left ${
              menuOpen ? '-rotate-45 translate-x-[1px] w-[24px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu — no backdrop-blur, solid bg for performance */}
      <div className={`md:hidden fixed inset-0 bg-obsidian flex flex-col items-center justify-center gap-2 transition-all duration-500 pb-safe ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`font-display text-[clamp(36px,10vw,56px)] tracking-wider transition-all duration-500 ${
              activeSection === item.id ? 'text-saffron' : 'text-parchment/60 hover:text-parchment'
            }`}
            style={{
              transitionDelay: menuOpen ? `${i * 80}ms` : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(40px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {item.label}
          </button>
        ))}
        <div className="mt-12 flex flex-col items-center gap-3" style={{
          transitionDelay: menuOpen ? '400ms' : '0ms',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-saffron/40">
            hello@indraam.com
          </span>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-fog/30">
            Est. 2026 // US Based
          </span>
        </div>
      </div>
    </nav>
  );
}
