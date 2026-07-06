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
import Seo from '../components/Seo';
import { homeKeywords } from '../data/seo';

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('indraam_preloader_seen') === '1';
  });
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(false);

  useLenis();

  useEffect(() => {
    if (preloaderDone) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('indraam_preloader_seen', '1');
      }

      // Trigger entrance animations after preloader
      const entranceTimer = window.setTimeout(() => {
        setEntranceComplete(true);
        ScrollTrigger.refresh();
      }, 60);

      const cursorTimer = window.setTimeout(() => {
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setCursorEnabled(isDesktop && !reduceMotion);
      }, 300);

      // Refresh again after layout settles
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        window.clearTimeout(entranceTimer);
        window.clearTimeout(cursorTimer);
        window.clearTimeout(timer);
      };
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
          window.setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    }
  }, [entranceComplete]);

  return (
    <div className="relative bg-obsidian text-parchment">
      <Seo
        title="Indraam Studio | AI Automation, Web Apps, and Digital Products"
        description="Indraam Studio is a US-based creative and engineering studio building agentic AI systems, automation workflows, web applications, mobile apps, and premium digital products."
        keywords={homeKeywords}
        path="/"
      />
      {/* Preloader */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      {cursorEnabled && <CustomCursor />}
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
