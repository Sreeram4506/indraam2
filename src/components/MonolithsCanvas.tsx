import { useEffect, useRef, useState } from 'react';

interface MonolithsCanvasProps {
  active: boolean;
}

export default function MonolithsCanvas({ active }: MonolithsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      window.innerWidth < 1024 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  });

  useEffect(() => {
    // Completely skip Three.js on mobile/tablet — zero GPU cost
    if (isMobile || !canvasRef.current) return;

    let disposed = false;

    // Dynamic import so mobile never downloads Three.js at all
    import('three').then((THREE) => {
      if (disposed || !canvasRef.current) return;
      import('gsap').then((gsapModule) => {
        if (disposed || !canvasRef.current) return;
        const gsap = gsapModule.default;

        const canvas = canvasRef.current!;
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050401, 0.05);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Lighting
        const ambient = new THREE.AmbientLight(0x404060, 0.1);
        scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xffaa55, 0);
        sun.position.set(10, 0, 5);
        scene.add(sun);
        const hemi = new THREE.HemisphereLight(0x6688cc, 0x1a1a2e, 0.3);
        hemi.position.set(0, 50, 0);
        scene.add(hemi);

        const spots: any[] = [];
        for (let i = 0; i < 3; i++) {
          const color = Math.random() > 0.5 ? 0xffaa55 : 0x6688cc;
          const spot = new THREE.SpotLight(color, 0);
          spot.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20 - 5
          );
          scene.add(spot);
          spots.push(spot);
        }

        // Shared material
        const sharedMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2, flatShading: true });
        const greebleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });

        // Shared geometries (reuse instead of creating per-fragment)
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const tetraGeo = new THREE.TetrahedronGeometry(0.8, 0);
        const octaGeo = new THREE.OctahedronGeometry(0.7, 0);
        const greebleGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);

        interface FragData {
          group: any;
          speed: number;
          rotSpeed: { x: number; y: number; z: number };
          timeOffset: number;
        }

        const fragments: FragData[] = [];
        const fragCount = 20;
        for (let i = 0; i < fragCount; i++) {
          const group = new THREE.Group();
          const speed = Math.random() * 0.003 + 0.001;
          const rotSpeed = { x: Math.random() * 0.002, y: Math.random() * 0.002, z: Math.random() * 0.002 };
          const timeOffset = Math.random() * Math.PI * 2;

          const blockCount = Math.floor(Math.random() * 4) + 3;
          for (let j = 0; j < blockCount; j++) {
            const type = Math.random();
            const geo = type < 0.4 ? boxGeo : type < 0.7 ? tetraGeo : octaGeo;
            const mesh = new THREE.Mesh(geo, sharedMat);
            mesh.scale.set(0.5 + Math.random() * 2.5, 0.2 + Math.random() * 1.3, 0.5 + Math.random() * 2.5);
            mesh.position.set((Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2.5);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            group.add(mesh);
          }
          // Greebles
          for (let j = 0; j < 3; j++) {
            const mesh = new THREE.Mesh(greebleGeo, greebleMat);
            mesh.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1, 0.3 + Math.random() * 0.3);
            group.add(mesh);
          }

          group.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20 - 5);
          scene.add(group);
          fragments.push({ group, speed, rotSpeed, timeOffset });
        }

        // Wisps
        const wispGeo = new THREE.CylinderGeometry(0.02, 0.02, 5, 4, 1);
        const wispBaseMat = new THREE.MeshBasicMaterial({ color: 0xf4f1de, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
        const wisps: { mesh: any; speed: number; drift: number; life: number }[] = [];
        const wispCount = 30;
        for (let i = 0; i < wispCount; i++) {
          const mesh = new THREE.Mesh(wispGeo, wispBaseMat.clone());
          mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20 - 5);
          mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          scene.add(mesh);
          wisps.push({ mesh, speed: Math.random() * 0.02 + 0.01, drift: Math.random() * Math.PI * 2, life: Math.random() });
        }

        const cycleDuration = 20000;
        let rafId = 0;
        let isVisible = true;

        // IntersectionObserver to pause when off-screen
        const observer = new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible && rafId === 0) animate();
        }, { threshold: 0 });
        observer.observe(canvas);

        function animate() {
          if (!isVisible || disposed) { rafId = 0; return; }
          rafId = requestAnimationFrame(animate);
          const time = performance.now() * 0.001;

          // Lighting
          const dayTime = (time * 0.05 * 1000) % cycleDuration;
          const phase = dayTime / cycleDuration;
          const dawnI = Math.max(0, Math.sin(phase * Math.PI * 4));
          const dayI = Math.max(0, Math.sin((phase - 0.25) * Math.PI * 4));
          const sunsetI = Math.max(0, Math.sin((phase - 0.5) * Math.PI * 4));
          const nightI = Math.max(0, Math.sin((phase - 0.75) * Math.PI * 4));

          ambient.intensity = 0.05 + dayI * 0.35 + dawnI * 0.15 + sunsetI * 0.1;
          sun.intensity = dayI * 1.5 + dawnI * 0.8 + sunsetI * 1.2;
          const sunY = Math.sin(phase * Math.PI * 2 - Math.PI / 2);
          sun.position.y = sunY * 10;
          sun.position.x = Math.cos(phase * Math.PI * 2) * 10;

          for (const spot of spots) {
            spot.intensity = Math.random() * 0.3 * (nightI + 0.1);
          }

          // Fragments
          for (const f of fragments) {
            const t = time * f.speed + f.timeOffset;
            const rx = 4 + Math.sin(f.timeOffset) * 2;
            const ry = 1.5 + Math.cos(f.timeOffset * 0.5) * 0.5;
            const rz = 3 + Math.sin(f.timeOffset * 1.3) * 1;
            f.group.position.x = Math.sin(t) * rx;
            f.group.position.y = Math.cos(t * 0.7) * ry;
            f.group.position.z = Math.sin(t * 0.5) * rz - 5;
            f.group.rotation.x += f.rotSpeed.x;
            f.group.rotation.y += f.rotSpeed.y;
            f.group.rotation.z += f.rotSpeed.z;

            const emInt = 0.1 + Math.abs(Math.sin(phase * Math.PI * 2)) * 0.5;
            sharedMat.emissiveIntensity = emInt;
          }

          // Wisps
          for (const w of wisps) {
            w.life += 0.01;
            const lifeCycle = Math.sin(w.life * Math.PI);
            (w.mesh.material as any).opacity = lifeCycle * 0.15;
            w.mesh.rotation.x += 0.01;
            w.mesh.rotation.y += 0.005;
            w.mesh.position.x += Math.sin(time * 0.5 + w.drift) * 0.01;
            w.mesh.position.y += Math.sin(time * 0.5 + w.drift) * 0.01;
            if (lifeCycle <= 0) {
              w.life = 0;
              w.mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20 - 5);
            }
          }

          renderer.render(scene, camera);
        }
        animate();

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onMouseMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(camera.position, { x: x * 1.5, y: -y * 1.5 + 2, duration: 2.5, ease: 'power2.out' });
          camera.lookAt(x, -y, 0);
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);

        cleanupRef.current = () => {
          disposed = true;
          cancelAnimationFrame(rafId);
          observer.disconnect();
          window.removeEventListener('resize', onResize);
          window.removeEventListener('mousemove', onMouseMove);
          renderer.dispose();
          boxGeo.dispose(); tetraGeo.dispose(); octaGeo.dispose(); greebleGeo.dispose(); wispGeo.dispose();
          sharedMat.dispose(); greebleMat.dispose(); wispBaseMat.dispose();
          scene.clear();
        };
      });
    });

    return () => {
      disposed = true;
      cleanupRef.current?.();
    };
  }, [isMobile]);

  // On mobile, render nothing
  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: active ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    />
  );
}
