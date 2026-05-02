import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);

  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current || !marqueeRef.current) return;

    // ... (previous Three.js setup)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050401); 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1000 : 2000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 20;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = Math.sin(angle) * radius;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xF2CC8F,
      size: 0.12,
      transparent: true,
      opacity: 0.2,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let time = 0;

    // SINGLE MARQUEE ANIMATION LOGIC
    const m1 = marqueeRef.current.querySelector('.marquee-inner');
    
    let tween1 = gsap.to(m1, {
        xPercent: -50,
        repeat: -1,
        duration: 15,
        ease: "none",
    });
    tween1.totalTime(1500); // Advance timeline to allow infinite reverse scrolling

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => { 
        // Directional marquee
        const dir = self.direction === 1 ? 1 : -1;
        gsap.to(tween1, { timeScale: dir, duration: 0.5, overwrite: true });
      },
    });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.005;
      points.rotation.y = time;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Fade in modules
    gsap.fromTo(
      containerRef.current?.querySelectorAll('.footer-mod') || [],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      }
    );

    // DIGITAL CLOCK LOGIC
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

    // VELOCITY TRACKING LOGIC
    let lastScrollPos = window.scrollY;
    const velocityBar = document.getElementById('velocity-bar');
    const trackVelocity = () => {
        const currentScroll = window.scrollY;
        const diff = Math.abs(currentScroll - lastScrollPos);
        const velocity = Math.min(diff / 10, 100);
        if (velocityBar) {
            velocityBar.style.width = `${velocity}%`;
        }
        lastScrollPos = currentScroll;
        rafRef.current = requestAnimationFrame(trackVelocity);
    };
    rafRef.current = requestAnimationFrame(trackVelocity);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(clockInterval);
      window.removeEventListener('resize', onResize);
      st.kill();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative bg-obsidian text-parchment overflow-hidden"
      style={{ zIndex: 10, minHeight: '100vh' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0"
      />
      
      <div ref={containerRef} className="relative z-10 flex flex-col w-full border-t border-white/10">
        
        {/* TOP HUD BAR */}
        <div className="flex border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="footer-mod flex-1 p-6 border-r border-white/10 flex justify-between items-center">
            <span className="font-mono text-[10px] tracking-widest uppercase text-saffron">42.3601 N, 71.0589 W</span>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-saffron rounded-full animate-pulse" />
              <span className="font-mono text-[10px] uppercase text-fog" id="footer-clock">00:00:00</span>
            </div>
          </div>
          <div className="footer-mod hidden md:flex items-center justify-center p-6 border-r border-white/10 w-64 gap-4">
             <span className="font-mono text-[9px] uppercase text-fog/40">Velocity:</span>
             <div className="flex-1 h-1 bg-white/5 relative overflow-hidden">
                <div id="velocity-bar" className="absolute inset-y-0 left-0 bg-saffron w-0 transition-all duration-300" />
             </div>
          </div>
          <div className="footer-mod flex items-center justify-end p-6 flex-1">
            <span className="font-mono text-[10px] tracking-widest uppercase text-fog/60">INDRAAM STUDIO &copy; 2026</span>
          </div>
        </div>

        {/* MIDDLE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/10 min-h-[300px]">
          {/* Main Statement */}
          <div className="footer-mod col-span-1 md:col-span-2 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-saffron/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <p className="font-display text-2xl md:text-4xl leading-[1.1] tracking-tight max-w-lg text-parchment relative z-10">
              Step into the architecture of tomorrow, where code becomes the material and design the dialogue of possibilities.
            </p>
            <div className="mt-12 flex gap-4 relative z-10">
              {['IG', 'TW', 'LI'].map((social) => (
                <div 
                  key={social}
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-saffron hover:text-obsidian hover:scale-110 hover:shadow-[0_0_15px_rgba(242,204,143,0.5)] transition-all duration-500 cursor-pointer group/social"
                >
                  <span className="font-mono text-[10px] group-hover/social:scale-125 transition-transform">{social}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="footer-mod p-8 md:p-12 flex flex-col justify-between col-span-1 md:col-span-2 group">
            <div className="relative inline-block group/email">
              <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-saffron mb-6">Connect:</span>
              <p className="font-display text-2xl md:text-3xl mb-2 cursor-pointer text-parchment transition-all duration-500 group-hover/email:text-saffron">
                hello@indraam.com
              </p>
              <div className="h-[1px] w-0 bg-saffron group-hover/email:w-full transition-all duration-700 ease-out" />
              <p className="font-mono text-sm text-fog mt-4 cursor-pointer hover:text-parchment transition-colors">+1 (203) 640-2437</p>
            </div>
            <div className="mt-12">
               <button className="relative overflow-hidden group/btn px-8 py-4 border border-saffron/30 text-saffron font-mono text-[10px] uppercase tracking-widest transition-all duration-500 hover:text-obsidian">
                 <div className="absolute inset-0 bg-saffron translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-expo" />
                 <span className="relative z-10">Play Experience</span>
               </button>
            </div>
          </div>
        </div>

        {/* SINGLE TEXT MARQUEE SCROLLER */}
        <div className="footer-mod border-b border-white/10 overflow-hidden bg-saffron text-obsidian relative py-6">
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-noise" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          
          <div ref={marqueeRef} className="py-2">
            <div className="marquee-inner flex whitespace-nowrap relative z-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className="font-display text-4xl md:text-6xl px-12 uppercase italic tracking-tighter hover:skew-x-12 transition-transform duration-500 cursor-default">Creative Architecture</span>
                  <span className="w-3 h-3 bg-obsidian rounded-full mx-4" />
                  <span className="font-display text-4xl md:text-6xl px-12 uppercase tracking-tighter hover:skew-x-12 transition-transform duration-500 cursor-default">Digital Solutions</span>
                  <span className="w-3 h-3 bg-obsidian rounded-full mx-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MASSIVE FOOTER LOGO - FINAL END */}
        <div className="footer-mod relative py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center group/logo overflow-hidden">
          {/* Background scanline for the logo area */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-20 w-full animate-scan pointer-events-none z-0" />
          
          {/* Animated Glow Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-saffron/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover/logo:opacity-80 group-hover/logo:scale-110 transition-all duration-1000 z-0" />

          <div className="w-full relative cursor-pointer z-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <h1 className="font-display text-[12vw] leading-none tracking-tighter uppercase select-none text-parchment transition-transform duration-700 group-hover/logo:scale-[1.02]">
              Indraam <span className="text-transparent transition-colors duration-700 group-hover/logo:text-saffron/20" style={{ WebkitTextStroke: '2px rgba(244, 241, 222, 0.2)' }}>Studio</span>
            </h1>
          </div>
          
          <div className="mt-24 flex items-center justify-between w-full max-w-4xl px-4 opacity-40 hover:opacity-100 transition-opacity duration-500 relative z-10">
             <div className="flex flex-col items-start flex-1">
                <span className="font-mono text-[8px] uppercase tracking-widest text-saffron">Status</span>
                <span className="font-mono text-[10px] uppercase">All Systems Nominal</span>
             </div>
             
             <div 
               className="flex flex-col items-center justify-center flex-1 cursor-pointer hover:text-saffron transition-colors group/totop"
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             >
                <div className="w-px h-8 bg-white/20 mb-3 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-saffron -translate-y-full group-hover/totop:translate-y-0 transition-transform duration-500 ease-out" />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest">Back to Top</span>
             </div>

             <div className="flex flex-col items-end justify-end flex-1 text-right">
                <span className="font-mono text-[8px] uppercase tracking-widest text-saffron">Encoding</span>
                <span className="font-mono text-[10px] uppercase">UTF-8 // STUDIO_V2</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
