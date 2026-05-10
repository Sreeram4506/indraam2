import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  ease: number;
}

interface ParticleTextProps {
  text: string;
  fontSize?: number;
  active?: boolean;
  align?: 'left' | 'center' | 'right';
}

const ParticleText: React.FC<ParticleTextProps> = ({ 
  text, 
  fontSize = 100,
  active = true,
  align = 'center'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 50 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isEnteringRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const resize = () => {
      // Use offset dimensions to match the actual rendered size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let dynamicFontSize = fontSize;
      ctx.font = `900 ${dynamicFontSize}px 'Outfit', sans-serif`;
      let textWidth = ctx.measureText(text).width;
      
      while (textWidth > canvas.width * 0.85 && dynamicFontSize > 20) {
        dynamicFontSize -= 5;
        ctx.font = `900 ${dynamicFontSize}px 'Outfit', sans-serif`;
        textWidth = ctx.measureText(text).width;
      }

      ctx.fillStyle = 'white';
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      
      let xPos = canvas.width / 2;
      if (align === 'left') xPos = 0;
      if (align === 'right') xPos = canvas.width;
      
      ctx.fillText(text, xPos, canvas.height / 2);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const gap = 2;

      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
          const alpha = pixels[index + 3];
          
          if (alpha > 128) {
            const startX = canvas.width / 2;
            const startY = canvas.height / 2;

            particlesRef.current.push({
              x: startX,
              y: startY,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: 2.5, // Uniform size larger than the gap to form a solid block
              color: '#F4F1DE',
              ease: 0.02 + Math.random() * 0.04, 
            });
          }
        }
      }

      isEnteringRef.current = true;
      setTimeout(() => {
        isEnteringRef.current = false;
      }, 4000);
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
          // Restart animation if it was paused
          if (rafRef.current === 0) {
            animate();
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const animate = () => {
      if (!active || !isVisible) {
        rafRef.current = 0;
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isEntering = isEnteringRef.current;
      const dxMouse = mouseRef.current.x - lastMouseRef.current.x;
      const dyMouse = mouseRef.current.y - lastMouseRef.current.y;
      const mouseSpeed = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      lastMouseRef.current.x = mouseRef.current.x;
      lastMouseRef.current.y = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        if (!isEntering) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const { radius } = mouseRef.current;
          // Removed 'living' oscillation to make the text look completely solid and normal when at rest
          const targetX = p.originX;
          const targetY = p.originY;

          const radiusNoise = (Math.sin(p.originX * 0.05) + Math.cos(p.originY * 0.05)) * 12;
          const effectiveRadius = radius + radiusNoise;
          
          if (distance < effectiveRadius && mouseSpeed > 0.2) {
            const force = Math.pow((effectiveRadius - distance) / effectiveRadius, 1.4);
            
            // Soft scribble effect
            const scribble = (Math.random() - 0.5) * 8 * force;
            p.vx += (Math.random() - 0.5) * scribble;
            p.vy += (Math.random() - 0.5) * scribble;

            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
            
            const weight = p.size * 0.8;
            const strength = Math.min(mouseSpeed * 2.5, 60) / weight; 
            
            p.vx -= Math.cos(angle) * force * strength;
            p.vy -= Math.sin(angle) * force * strength;
            
            p.color = '#F2CC8F'; // Accent color when disturbed
          } else {
            p.color = '#F4F1DE'; // Normal solid color
          }

          // HIGHLY DAMPED SPRING PHYSICS
          const springK = 0.005 + (p.ease * 0.05); 
          const ax = (targetX - p.x) * springK;
          const ay = (targetY - p.y) * springK;
          
          p.vx += ax;
          p.vy += ay;
          
          // High damping (0.92) for a very smooth, "syrupy" retraction
          p.vx *= 0.92; 
          p.vy *= 0.92;
        } else {
          // SNAP-IN ENTRANCE
          // Faster snap to origin during initial reveal
          const entranceEase = p.ease * 2.5;
          p.x += (p.originX - p.x) * entranceEase;
          p.y += (p.originY - p.y) * entranceEase;
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    resize();
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, fontSize, active]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full pointer-events-none z-0" 
      style={{ touchAction: 'none', display: 'block' }}
    />
  );
};

export default ParticleText;
