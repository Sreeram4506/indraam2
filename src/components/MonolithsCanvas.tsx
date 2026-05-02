import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

class ArchitecturalFragment extends THREE.Group {
  sharedMaterial: THREE.MeshStandardMaterial;

  constructor() {
    super();
    this.userData = {
      speed: Math.random() * 0.003 + 0.001,
      rotSpeed: {
        x: Math.random() * 0.002,
        y: Math.random() * 0.002,
        z: Math.random() * 0.002,
      },
      timeOffset: Math.random() * Math.PI * 2,
    };

    this.sharedMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.2,
      flatShading: true,
    });

    const blockCount = Math.floor(Math.random() * 6) + 4;
    for (let i = 0; i < blockCount; i++) {
      const type = Math.random();
      let geometry: THREE.BufferGeometry;
      if (type < 0.4) {
        geometry = new THREE.BoxGeometry(1, 1, 1);
      } else if (type < 0.7) {
        geometry = new THREE.TetrahedronGeometry(0.8, 0);
      } else {
        geometry = new THREE.OctahedronGeometry(0.7, 0);
      }

      const mesh = new THREE.Mesh(geometry, this.sharedMaterial);
      mesh.scale.set(
        0.5 + Math.random() * 2.5,
        0.2 + Math.random() * 1.3,
        0.5 + Math.random() * 2.5
      );
      mesh.position.set(
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 2.5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.add(mesh);
    }

    this.addGreebles();
  }

  addGreebles() {
    const greebleGeom = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const greebleMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.1,
    });
    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(greebleGeom, greebleMat);
      mesh.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1,
        0.3 + Math.random() * 0.3
      );
      this.add(mesh);
    }
  }

  update(time: number, cycleDuration: number) {
    const t = time * this.userData.speed + this.userData.timeOffset;
    const radiusX = 4 + Math.sin(this.userData.timeOffset) * 2;
    const radiusY = 1.5 + Math.cos(this.userData.timeOffset * 0.5) * 0.5;
    const radiusZ = 3 + Math.sin(this.userData.timeOffset * 1.3) * 1;

    this.position.x = Math.sin(t) * radiusX;
    this.position.y = Math.cos(t * 0.7) * radiusY;
    this.position.z = Math.sin(t * 0.5) * radiusZ - 5;

    this.rotation.x += this.userData.rotSpeed.x;
    this.rotation.y += this.userData.rotSpeed.y;
    this.rotation.z += this.userData.rotSpeed.z;

    const dayTime = (time * 0.05 * 1000) % cycleDuration;
    const phase = dayTime / cycleDuration;
    const emissiveInt =
      0.1 + Math.abs(Math.sin(phase * Math.PI * 2)) * 0.5;
    this.sharedMaterial.emissiveIntensity = emissiveInt;
  }
}

interface MonolithsCanvasProps {
  active: boolean;
}

export default function MonolithsCanvas({ active }: MonolithsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const fragmentsRef = useRef<ArchitecturalFragment[]>([]);
  const wispsRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    sun: THREE.DirectionalLight;
    hemi: THREE.HemisphereLight;
    spots: THREE.SpotLight[];
  } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Remove solid background to allow transparency
    scene.fog = new THREE.FogExp2(0x050401, 0.05); // Reduced fog density

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 12;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    // Lighting
    const ambient = new THREE.AmbientLight(0x404060, 0.1);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffaa55, 0);
    sun.position.set(10, 0, 5);
    sun.castShadow = true;
    scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x6688cc, 0x1a1a2e, 0.3);
    hemi.position.set(0, 50, 0);
    scene.add(hemi);

    const spots: THREE.SpotLight[] = [];
    for (let i = 0; i < 5; i++) {
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

    lightsRef.current = { ambient, sun, hemi, spots };

    // Fragments
    const fragments: ArchitecturalFragment[] = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const frag = new ArchitecturalFragment();
      frag.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20 - 5
      );
      scene.add(frag);
      fragments.push(frag);
    }
    fragmentsRef.current = fragments;

    // Wisps
    const wispsGroup = new THREE.Group();
    const wispCount = isMobile ? 25 : 50;
    const wispGeo = new THREE.CylinderGeometry(0.02, 0.02, 5, 4, 1);
    const wispMat = new THREE.MeshBasicMaterial({
      color: 0xf4f1de,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < wispCount; i++) {
      const mesh = new THREE.Mesh(wispGeo, wispMat.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20 - 5
      );
      mesh.userData = {
        speed: Math.random() * 0.02 + 0.01,
        drift: Math.random() * Math.PI * 2,
        life: Math.random(),
      };
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      wispsGroup.add(mesh);
    }
    scene.add(wispsGroup);
    wispsRef.current = wispsGroup;

    const cycleDuration = 20000;

    function updateLighting(time: number) {
      const lights = lightsRef.current;
      if (!lights) return;
      const dayTime = (time * 0.05 * 1000) % cycleDuration;
      const phase = dayTime / cycleDuration;

      const dawnI = Math.max(0, Math.sin(phase * Math.PI * 4));
      const dayI = Math.max(
        0,
        Math.sin((phase - 0.25) * Math.PI * 4)
      );
      const sunsetI = Math.max(
        0,
        Math.sin((phase - 0.5) * Math.PI * 4)
      );
      const nightI = Math.max(
        0,
        Math.sin((phase - 0.75) * Math.PI * 4)
      );

      lights.ambient.intensity =
        0.05 + dayI * 0.35 + dawnI * 0.15 + sunsetI * 0.1;
      lights.sun.intensity =
        dayI * 1.5 + dawnI * 0.8 + sunsetI * 1.2;

      const sunY = Math.sin(phase * Math.PI * 2 - Math.PI / 2);
      lights.sun.position.y = sunY * 10;
      lights.sun.position.x = Math.cos(phase * Math.PI * 2) * 10;

      const sunColor = new THREE.Color(0xffaa55);
      sunColor.lerp(new THREE.Color(0xffffff), dayI);
      sunColor.lerp(new THREE.Color(0xff5533), sunsetI);
      lights.sun.color.copy(sunColor);

      const groundColor = new THREE.Color(0x1a1a2e);
      groundColor.lerp(new THREE.Color(0x2a1a15), sunsetI * 0.3);
      lights.hemi.groundColor.copy(groundColor);

      const fogColor = new THREE.Color(0x050401);
      fogColor.lerp(new THREE.Color(0x1a1510), dawnI * 0.3);
      fogColor.lerp(new THREE.Color(0x151520), nightI * 0.2);
      fogColor.lerp(new THREE.Color(0x201510), sunsetI * 0.4);
      scene.fog!.color.copy(fogColor);

      for (const spot of lights.spots) {
        spot.intensity = Math.random() * 0.3 * (nightI + 0.1);
      }
    }

    function updateWisps(time: number) {
      if (!wispsRef.current) return;
      wispsRef.current.children.forEach((wisp) => {
        const mesh = wisp as THREE.Mesh;
        mesh.userData.life += 0.01;
        const lifeCycle = Math.sin(mesh.userData.life * Math.PI);
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          lifeCycle * 0.15;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.005;
        mesh.position.x +=
          Math.sin(time * 0.5 + mesh.userData.drift) * 0.01;
        mesh.position.y +=
          Math.sin(time * 0.5 + mesh.userData.drift) * 0.01;

        if (lifeCycle <= 0) {
          mesh.userData.life = 0;
          mesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20 - 5
          );
        }
      });
    }

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      updateLighting(time);

      for (const frag of fragmentsRef.current) {
        frag.update(time, cycleDuration);
      }

      updateWisps(time);

      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onGlobalMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(camera.position, {
        x: x * 1.5,
        y: -y * 1.5 + 2, // Slight offset
        duration: 2.5,
        ease: 'power2.out',
      });
      // Also look slightly towards the mouse
      camera.lookAt(x, -y, 0);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onGlobalMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onGlobalMouseMove);
      renderer.dispose();
      scene.clear();
    };
  }, []);

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
