import { useEffect, useState } from 'react';
import { useLenis } from '../hooks/useLenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import HeroSection from '../sections/HeroSection';
import PhilosophySection from '../sections/PhilosophySection';
import ServicesSection from '../sections/ServicesSection';
import WorkSection from '../sections/WorkSection';
import FooterSection from '../sections/FooterSection';
import CustomCursor from '../components/CustomCursor';

export default function Home() {
  const [preloaderDone] = useState(true);
  const [entranceComplete] = useState(true);

  useLenis();

  useEffect(() => {
    // Refresh ScrollTrigger after immediate mount
    ScrollTrigger.refresh();
    
    // Check for hash and scroll
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    // Some components might need a slight delay to measure layout
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-obsidian text-parchment">
      <CustomCursor />
      <div className="noise-overlay" />
      <Navigation visible={preloaderDone} />

      <main>
        <HeroSection entranceComplete={entranceComplete} />
        <PhilosophySection />
        <ServicesSection />
        <WorkSection />
        <FooterSection />
      </main>
    </div>
  );
}
