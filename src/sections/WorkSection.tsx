import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { useNavigate } from 'react-router';
import { projects } from '../data/projects';
import { addInterest } from '../lib/interests';

export default function WorkSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundAccentRef = useRef<HTMLDivElement>(null);
  const trackPortfolioInterest = (project: (typeof projects)[number]) => {
    addInterest({
      source: 'portfolio',
      projectNum: project.num,
      projectTitle: project.title,
      projectCategory: project.category,
    });
  };

  const handleExploreProject = (project: (typeof projects)[number]) => {
    trackPortfolioInterest(project);
    navigate(`/project/${project.num}`);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animations — Cinematic kinetic reveal
      if (headerRef.current) {
        const label = headerRef.current.querySelector('.section-label');
        const title = headerRef.current.querySelector('.section-title');
        
        gsap.fromTo(label,
          { opacity: 0, x: -30, letterSpacing: '1em' },
          { opacity: 1, x: 0, letterSpacing: '0.5em', duration: 1.5, ease: 'power4.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
          }
        );
        
        // Character-by-character reveal for title
        const titleText = title?.textContent || '';
        if (title) {
          title.textContent = '';
          titleText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            title.appendChild(span);
          });

          gsap.fromTo(title.childNodes,
            { opacity: 0, y: 100, rotateX: -90, transformOrigin: 'top' },
            {
              opacity: 1, y: 0, rotateX: 0,
              duration: 1.2, stagger: 0.05, ease: 'expo.out',
              scrollTrigger: { trigger: headerRef.current, start: 'top 75%' }
            }
          );
        }
      }

      // SECTION PROGRESS BAR
      gsap.to('.portfolio-progress-bar', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // BACKGROUND SCROLL TEXT PARALLAX
      gsap.to('.portfolio-bg-text', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // BACKGROUND ACCENT PARALLAX
      gsap.to(backgroundAccentRef.current, {
        yPercent: 30,
        xPercent: -20,
        rotate: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // PROJECT ITEMS
      projectRefs.current.forEach((el, i) => {
        if (!el) return;

        const videoContainer = el.querySelector('.video-container');
        const media = el.querySelector('.portfolio-media');
        const content = el.querySelector('.project-content');
        const num = el.querySelector('.project-num');
        const button = el.querySelector('.project-button');

        if (!videoContainer || !media || !content || !num || !button) return;

        // 0. Pin the project in the center so the user can watch the video and read info
        ScrollTrigger.create({
          trigger: el,
          start: 'center center',
          end: '+=100%', // Pins for one viewport height
          pin: true,
          pinSpacing: true,
        });

        // 1. 3D Tilt reveal for video container - NOW SCRUBBED
        gsap.fromTo(videoContainer,
          { 
            clipPath: 'inset(0 100% 0 0)', 
            rotateY: 25, 
            scale: 0.9, 
            opacity: 0, 
            x: i % 2 === 0 ? -150 : 150 
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            rotateY: 0,
            scale: 1,
            opacity: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'center center',
              scrub: true,
            }
          }
        );

        // 2. Continuous Parallax for media inside
        gsap.fromTo(media,
          { yPercent: -15, scale: 1.2 },
          {
            yPercent: 15,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );

        // 3. Floating number parallax - Intensified
        gsap.to(num, {
          y: -250,
          rotate: i % 2 === 0 ? 5 : -5,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });

        // 4. Content entrance with stronger horizontal slide - NOW SCRUBBED
        const details = content.querySelectorAll('.detail-reveal');
        const decorLine = el.querySelector('.project-line');
        const projectTitle = el.querySelector('.project-title');

        gsap.fromTo(content,
          { opacity: 0, x: i % 2 === 0 ? 150 : -150, skewX: i % 2 === 0 ? 10 : -10 },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom+=100',
              end: 'center center',
              scrub: true,
            }
          }
        );

        // Staggered details & line drawing coming from the sides - NOW SCRUBBED
        gsap.fromTo(decorLine,
          { scaleX: 0, x: i % 2 === 0 ? 50 : -50 },
          {
            scaleX: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom+=200',
              end: 'center center',
              scrub: true,
            }
          }
        );

        gsap.fromTo(details,
          { 
            opacity: 0, 
            x: i % 2 === 0 ? 60 : -60, 
            skewX: i % 2 === 0 ? 10 : -10 
          },
          {
            opacity: 1, x: 0, skewX: 0,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom+=300',
              end: 'center center',
              scrub: true,
            }
          }
        );

        // Subtle Title Magnetic interaction on the whole row
        let titleXTo: any, titleYTo: any, titleRotTo: any;
        if (projectTitle) {
          titleXTo = gsap.quickTo(projectTitle, 'x', { duration: 1, ease: 'power2.out' });
          titleYTo = gsap.quickTo(projectTitle, 'y', { duration: 1, ease: 'power2.out' });
          titleRotTo = gsap.quickTo(projectTitle, 'rotate', { duration: 1, ease: 'power2.out' });
        }

        const handleTitleMove = (e: MouseEvent) => {
           if (!projectTitle || !titleXTo) return;
           const rect = el.getBoundingClientRect();
           const relX = (e.clientX - rect.left) / rect.width - 0.5;
           const relY = (e.clientY - rect.top) / rect.height - 0.5;
           
           titleXTo(relX * 30);
           titleYTo(relY * 20);
           titleRotTo(relX * 2);
        };
        el.addEventListener('mousemove', handleTitleMove);
        el.addEventListener('mouseleave', () => {
           gsap.to(projectTitle, { x: 0, y: 0, rotate: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)' });
        });

        // 5. Magnetic Button Effect (Simulated via mouse move on the parent row)
        let btnXTo: any, btnYTo: any;
        if (button) {
          btnXTo = gsap.quickTo(button, 'x', { duration: 0.6, ease: 'power2.out' });
          btnYTo = gsap.quickTo(button, 'y', { duration: 0.6, ease: 'power2.out' });
        }

        const handleMouseMove = (e: MouseEvent) => {
          if (!button || !btnXTo) return;
          const rect = button.getBoundingClientRect();
          const btnX = rect.left + rect.width / 2;
          const btnY = rect.top + rect.height / 2;
          
          const dx = e.clientX - btnX;
          const dy = e.clientY - btnY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 150) {
            btnXTo(dx * 0.3);
            btnYTo(dy * 0.3);
          } else {
            gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
          }
        };
        el.addEventListener('mousemove', handleMouseMove);
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-obsidian pt-0 pb-32 md:pt-0 md:pb-64 overflow-hidden z-20"
      style={{ zIndex: 20 }}
    >
      {/* Cinematic Background Elements */}
      <div 
        ref={backgroundAccentRef}
        className="absolute top-1/4 -right-1/4 w-[80vw] h-[80vw] bg-saffron/5 rounded-full blur-[150px] pointer-events-none z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
         <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
         <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      {/* Large Background Scroll Text */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 opacity-[0.03]">
        <div className="portfolio-bg-text font-display text-[30vw] text-white whitespace-nowrap leading-none will-change-transform">
          SELECTED PROJECTS SELECTED PROJECTS SELECTED PROJECTS
        </div>
      </div>

      {/* Project Progress Indicator */}
      <div className="absolute left-6 md:left-12 top-0 h-full w-px bg-white/5 z-10 hidden md:block">
        <div className="portfolio-progress-bar sticky top-0 left-0 w-full h-screen bg-saffron/20 origin-top scale-y-0" />
      </div>

      <div className="px-6 md:px-20 max-w-7xl mx-auto relative z-10">
        <div ref={headerRef} className="mb-12 md:mb-20">
          <span className="section-label font-mono text-[10px] tracking-[0.5em] text-saffron uppercase mb-8 block">02 // Selected Works</span>
          <h2 className="section-title font-display text-parchment text-[clamp(60px,12vw,180px)] leading-none -ml-2 perspective-1000">
            PORTFOLIO
          </h2>
        </div>

        <div className="space-y-24 md:space-y-40">
          {projects.map((project, i) => (
            <div
              key={project.num}
              ref={(el) => { projectRefs.current[i] = el; }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-32 items-center bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:rounded-none`}
            >
              {/* Video Wrap with 3D Container */}
              <div className="video-container relative w-full md:w-[65%] aspect-[16/9] overflow-hidden group perspective-1000 will-change-transform">
                {/* Colored Glow behind video */}
                <div 
                  className="absolute inset-0 z-0 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000"
                  style={{ background: project.color }}
                />
                
                <div className="relative w-full h-full overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors duration-700">
                  <div className="portfolio-media w-full h-full bg-gradient-to-br from-obsidian via-ink to-obsidian/90 flex flex-col items-center justify-center text-center px-6 will-change-transform">
                    <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-saffron/70 mb-3">Portfolio</span>
                    <span className="font-display text-[clamp(26px,4vw,52px)] leading-none text-parchment">Coming Soon</span>
                  </div>
                  
                  {/* Scanline / Grain Overlay */}
                  <div className="absolute inset-0 bg-white/[0.03] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                       style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.05) 1px, rgba(255,255,255,0.05) 2px)' }} 
                  />

                  {/* Floating Overlay Info */}
                  <div className="absolute top-8 left-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                        <span className="font-mono text-[9px] tracking-[0.4em] text-saffron uppercase">Live Visual</span>
                     </div>
                  </div>
                </div>

                {/* Parallax Project Number */}
                <div className="project-num absolute -bottom-16 -right-8 z-30 pointer-events-none select-none">
                   <span className="font-display text-[20vw] text-white/[0.03] leading-none">0{i+1}</span>
                </div>
              </div>

              {/* Text Content with Magnetic Button */}
              <div className="project-content w-full md:w-[35%] flex flex-col items-start">
                <div className="flex items-center gap-4 mb-6 overflow-hidden">
                   <div className="project-line w-12 h-px bg-saffron/40 origin-left" />
                   <span className="detail-reveal font-mono text-[10px] uppercase tracking-[0.3em] text-saffron">
                    {project.category}
                  </span>
                </div>
                
                <h3 className="project-title font-display text-parchment text-[clamp(40px,5vw,80px)] leading-[0.9] mb-10 group-hover:text-saffron transition-colors duration-700">
                  {project.title}
                </h3>
                
                <p className="detail-reveal font-body text-fog/60 text-xl leading-relaxed mb-16 border-l border-white/5 pl-8">
                  {project.description}
                </p>
                
                <button 
                  onClick={() => handleExploreProject(project)}
                  className="project-button hidden md:flex group relative items-center justify-center w-32 h-32 rounded-full border border-white/10 hover:border-saffron hover:bg-saffron hover:text-obsidian transition-all duration-500 overflow-hidden cursor-pointer"
                >
                   <span className="relative z-10 font-mono text-[9px] uppercase tracking-widest font-bold">Explore</span>
                   <div className="absolute inset-0 bg-saffron scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500" />
                </button>
                <button
                  onClick={() => handleExploreProject(project)}
                  className="md:hidden w-full mt-4 py-4 border border-saffron/30 bg-saffron/5 text-saffron font-mono text-[10px] uppercase tracking-widest text-center"
                >
                  Explore Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
