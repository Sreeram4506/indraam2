import { useEffect, useState } from 'react';
import { useLenis } from '../hooks/useLenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import HeroSection from '../sections/HeroSection';
import PhilosophySection from '../sections/PhilosophySection';
import ServicesSection from '../sections/ServicesSection';
import WorkSection from '../sections/WorkSection';
import ContactSection from '../sections/ContactSection';
import FooterSection from '../sections/FooterSection';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);

  useLenis();

  useEffect(() => {
    if (preloaderDone) {
      // Trigger entrance animations after preloader
      setTimeout(() => {
        setEntranceComplete(true);
        ScrollTrigger.refresh();
      }, 100);

      // Refresh again after layout settles
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [preloaderDone]);

  useEffect(() => {
    // Check for hash and scroll
    if (entranceComplete) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    }
  }, [entranceComplete]);

  return (
    <div className="relative bg-obsidian text-parchment">
      {/* Preloader */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <CustomCursor />
      <div className="noise-overlay" />
      <Navigation visible={preloaderDone} />

      <main>
        <HeroSection entranceComplete={entranceComplete} />
        <PhilosophySection />
        <ServicesSection />
        <WorkSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}
