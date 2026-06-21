import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, and WebGLRenderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    
    // Add fog to enhance depth perception
    scene.fog = new THREE.FogExp2(0x030712, 0.0016);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 520;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Generate a circular glowing texture programmatically
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(165, 180, 252, 0.85)'); // Indigo core
      gradient.addColorStop(0.6, 'rgba(99, 102, 241, 0.25)');  // Outer glow
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const particleTexture = createCircleTexture();

    // 3. Create 3D Particle Cloud
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorIndigo = new THREE.Color('#6366f1');
    const colorPurple = new THREE.Color('#a855f7');
    const colorTeal = new THREE.Color('#14b8a6');

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles randomly inside a spherical shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = (Math.random() * 0.45 + 0.55) * 620; // Distance range

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color scheme distribution
      let mixedColor;
      const rng = Math.random();
      if (rng < 0.45) {
        mixedColor = colorIndigo.clone().lerp(colorPurple, Math.random());
      } else if (rng < 0.8) {
        mixedColor = colorIndigo.clone().lerp(colorTeal, Math.random());
      } else {
        mixedColor = new THREE.Color('#1e293b'); // faint background star
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 9,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Central Holographic Engine Globe (Outer)
    const globeGeometry = new THREE.IcosahedronGeometry(200, 2);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Central Holographic Engine Globe (Inner)
    const innerGlobeGeometry = new THREE.IcosahedronGeometry(100, 1);
    const innerGlobeMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const innerGlobe = new THREE.Mesh(innerGlobeGeometry, innerGlobeMaterial);
    scene.add(innerGlobe);

    // 5. Holographic Grid Helper
    const gridHelper = new THREE.GridHelper(1300, 32, 0x6366f1, 0x1f2937);
    gridHelper.position.y = -320;
    gridHelper.material.opacity = 0.16;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 6. Interactive Mouse coordinates
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    
    const handleMouseMove = (event) => {
      // Transform client coords to normalized device coords [-1, 1]
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Window resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Main loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow rotational drift
      particleSystem.rotation.y = elapsedTime * 0.012;
      particleSystem.rotation.x = elapsedTime * 0.004;

      globe.rotation.y = -elapsedTime * 0.025;
      globe.rotation.x = elapsedTime * 0.008;

      innerGlobe.rotation.y = elapsedTime * 0.055;
      innerGlobe.rotation.z = -elapsedTime * 0.018;

      // Parallax effect on camera
      target.x = mouse.x * 130;
      target.y = mouse.y * 130;

      camera.position.x += (target.x - camera.position.x) * 0.05;
      camera.position.y += (target.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 9. WebGL resource disposal to avoid memory leaks
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      innerGlobeGeometry.dispose();
      innerGlobeMaterial.dispose();
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#030712'
      }}
    />
  );
};
