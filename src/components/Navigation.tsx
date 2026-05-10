import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation, useNavigate } from 'react-router';

gsap.registerPlugin(ScrollTrigger);

interface NavigationProps {
  visible: boolean;
}

export default function Navigation({ visible }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const centerLogoRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!navRef.current) return;
    if (visible) {
      gsap.to(navRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, [visible]);

  // Logo Transition Logic
  useEffect(() => {
    if (!centerLogoRef.current) return;

    // Initial state: centered and large (matching hero style)
    gsap.set(centerLogoRef.current, {
        y: '40vh',
        scale: 8,
        opacity: 0,
        filter: 'blur(10px)',
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '500px top',
            scrub: 1,
        }
    });

    tl.to(centerLogoRef.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.inOut'
    });

    return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
    };
  }, []);

  // Track active section
  useEffect(() => {
    const sectionIds = ['hero', 'philosophy', 'services', 'work', 'contact'];
    const observers = sectionIds.map((id) => {
      return ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    return () => {
      observers.forEach((o) => o.kill());
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Philosophy', id: 'philosophy' },
    { label: 'Services', id: 'services' },
    { label: 'Work', id: 'work' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0 -translate-y-2"
      style={{ padding: '0 5vw' }}
    >
      <div className="flex items-center justify-between h-20 relative">
        {/* Left Side Items */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id!)}
              className={`relative font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-300 ${
                activeSection === item.id
                  ? 'text-saffron'
                  : 'text-fog hover:text-parchment'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-saffron rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Center Logo - Animated from Hero */}
        <button
          ref={centerLogoRef}
          onClick={() => scrollTo('hero')}
          className="absolute left-1/2 -translate-x-1/2 font-display text-lg tracking-[0.3em] text-parchment hover:text-saffron transition-colors duration-300 pointer-events-auto"
        >
          INDRAAM
        </button>

        {/* Right Side Items */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.slice(2).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id!)}
              className={`relative font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-300 ${
                activeSection === item.id
                  ? 'text-saffron'
                  : 'text-fog hover:text-parchment'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-saffron rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Spacer (to keep button on right) */}
        <div className="md:hidden flex-1" />

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-6 h-4 flex flex-col justify-between"
        >
          <span
            className={`block w-full h-px bg-parchment transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-full h-px bg-parchment transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-full h-px bg-parchment transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-obsidian/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id!)}
              className={`font-display text-4xl transition-colors duration-300 ${
                activeSection === item.id ? 'text-saffron' : 'text-parchment hover:text-saffron'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
