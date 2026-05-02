import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    // Three.js particle setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create particles in a vortex shape - Reduced for mobile performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1500 : 3000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 15;
      const height = (Math.random() - 0.5) * 10;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf4f1de,
      size: isMobile ? 0.2 : 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let scrollProgress = 0;
    let time = 0;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.01;

      const posArray = geometry.attributes.position.array as Float32Array;
      const chaos = scrollProgress * 3;

      // Phase-based text visibility - Smoother mobile transitions
      if (text1Ref.current) {
        const opacity = scrollProgress < 0.33 ? 1 - scrollProgress * 3.5 : 0;
        const y = scrollProgress < 0.33 ? -scrollProgress * 60 : -60;
        text1Ref.current.style.opacity = String(Math.max(0, opacity));
        text1Ref.current.style.transform = `translateY(${y}px)`;
      }
      if (text2Ref.current) {
        const opacity =
          scrollProgress > 0.25 && scrollProgress < 0.66
            ? 1 - Math.abs(scrollProgress - 0.45) * 4
            : 0;
        const y =
          scrollProgress > 0.25 && scrollProgress < 0.66
            ? (scrollProgress - 0.45) * -60
            : scrollProgress >= 0.66
            ? -60
            : 60;
        text2Ref.current.style.opacity = String(Math.max(0, opacity));
        text2Ref.current.style.transform = `translateY(${y}px)`;
      }
      if (text3Ref.current) {
        const opacity = scrollProgress > 0.55 ? (scrollProgress - 0.55) * 2.5 : 0;
        const y = scrollProgress > 0.55 ? (1 - scrollProgress) * -20 : 30;
        text3Ref.current.style.opacity = String(Math.min(1, opacity));
        text3Ref.current.style.transform = `translateY(${y}px)`;
      }
      if (contactRef.current) {
        const opacity = scrollProgress > 0.88 ? (scrollProgress - 0.88) * 8.33 : 0;
        contactRef.current.style.opacity = String(Math.min(1, opacity));
        contactRef.current.style.visibility = scrollProgress > 0.85 ? 'visible' : 'hidden';
      }

      // Update particles
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        if (chaos > 0.1) {
          const angle = time * (0.5 + chaos * 2) + i * 0.01;
          const radius = 2 + (i / particleCount) * 10 * chaos;
          const turb = (Math.random() - 0.5) * chaos * 0.1;

          posArray[i3] += (Math.cos(angle) * radius - posArray[i3]) * 0.02 + turb;
          posArray[i3 + 1] += (Math.sin(time + i * 0.1) * 2 * chaos - posArray[i3 + 1]) * 0.02 + turb;
          posArray[i3 + 2] += (Math.sin(angle) * radius - posArray[i3 + 2]) * 0.02 + turb;
        } else {
          const t = i / particleCount;
          const spiralAngle = t * Math.PI * 8;
          const spiralRadius = 3 + t * 8;
          posArray[i3] += (Math.cos(spiralAngle) * spiralRadius - posArray[i3]) * 0.03;
          posArray[i3 + 1] += ((t - 0.5) * 6 - posArray[i3 + 1]) * 0.03;
          posArray[i3 + 2] += (Math.sin(spiralAngle) * spiralRadius - posArray[i3 + 2]) * 0.03;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    let resizeTimer: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(onResize, 200);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', debouncedResize);
      st.kill();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      style={{ height: '350vh', zIndex: 2 }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(circle, transparent 20%, rgba(10,10,10,0.7) 100%)',
          }}
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="relative text-center w-full px-6">
            <div
              ref={text1Ref}
              className="font-display text-parchment transition-opacity duration-300"
              style={{
                fontSize: 'clamp(40px, 12vw, 120px)',
                lineHeight: 0.9,
              }}
            >
              Got a vision?
            </div>

            <div
              ref={text2Ref}
              className="font-display text-parchment absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                fontSize: 'clamp(40px, 12vw, 120px)',
                lineHeight: 0.9,
                opacity: 0,
              }}
            >
              <span>Let's make it</span>
            </div>

            <div
              ref={text3Ref}
              className="font-display text-parchment absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                fontSize: 'clamp(40px, 12vw, 120px)',
                lineHeight: 0.9,
                opacity: 0,
              }}
            >
              <span>happen.</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div
          ref={contactRef}
          className="absolute bottom-0 left-0 right-0 opacity-0 invisible"
          style={{ zIndex: 10, padding: '0 8vw 10vh' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8">
            <div className="flex flex-col items-center md:items-start gap-4 md:gap-8">
              <a
                href="mailto:hello@indraam.com"
                className="font-mono text-lg md:text-base text-parchment hover:text-saffron transition-colors duration-300"
              >
                hello@indraam.com
              </a>
              <a
                href="tel:+12036402437"
                className="font-mono text-sm text-fog hover:text-parchment transition-colors duration-300"
              >
                +1 (203) 640-2437
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              <button
                className="font-mono text-[10px] md:text-xs uppercase tracking-[0.12em] text-fog border border-fog/20 px-8 py-4 md:px-6 md:py-3 hover:border-saffron hover:text-saffron transition-all duration-300"
              >
                Call Us
              </button>
              <button
                className="font-mono text-[10px] md:text-xs uppercase tracking-[0.12em] text-obsidian bg-parchment px-8 py-4 md:px-6 md:py-3 hover:bg-saffron transition-colors duration-300"
              >
                Meet Us
              </button>
            </div>
          </div>

          <div className="mt-12 md:mt-8 text-center md:text-left">
            <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.12em] text-fog/40">
              EST. 2026 // US Based Studio
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
