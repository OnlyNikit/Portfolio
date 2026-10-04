import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export function ThreeBackground() {
  const containerRef = useRef(null);
  const { threeSettings } = usePortfolio();
  const { themeConfig } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (threeSettings && !threeSettings.hero3dEnabled) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && threeSettings?.reducedMotionFallback) {
      return;
    }

    const scene = new THREE.Scene();
    const bgCol = new THREE.Color(themeConfig.bgHex);
    scene.fog = new THREE.FogExp2(bgCol.getHex(), 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 240;

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    // Particle Cloud
    const particleCount = threeSettings ? threeSettings.particleDensity * 12 : 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(themeConfig.primaryColor);
    const color2 = new THREE.Color(themeConfig.secondaryColor);
    const color3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

      const mixed = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Floating Geometric Wireframe Objects
    const shapesGroup = new THREE.Group();

    const icosaGeom = new THREE.IcosahedronGeometry(22, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeConfig.primaryColor),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const icosaMesh = new THREE.Mesh(icosaGeom, icosaMat);
    icosaMesh.position.set(-160, 60, -50);
    shapesGroup.add(icosaMesh);

    const torusGeom = new THREE.TorusGeometry(18, 5, 12, 36);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeConfig.secondaryColor),
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    torusMesh.position.set(170, -70, -30);
    shapesGroup.add(torusMesh);

    const octGeom = new THREE.OctahedronGeometry(16, 0);
    const octMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeConfig.primaryColor),
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const octMesh = new THREE.Mesh(octGeom, octMat);
    octMesh.position.set(130, 90, -80);
    shapesGroup.add(octMesh);

    scene.add(shapesGroup);

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.08;
      mouseY = (event.clientY - windowHalfY) * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0003;

      icosaMesh.rotation.x += 0.005;
      icosaMesh.rotation.y += 0.007;

      torusMesh.rotation.x -= 0.004;
      torusMesh.rotation.y += 0.006;

      octMesh.rotation.y -= 0.005;
      octMesh.rotation.z += 0.004;

      camera.position.x = targetX * 0.4;
      camera.position.y = -targetY * 0.4;
      camera.lookAt(scene.position);

      if (renderer) renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pMaterial.dispose();
      icosaGeom.dispose();
      icosaMat.dispose();
      torusGeom.dispose();
      torusMat.dispose();
      octGeom.dispose();
      octMat.dispose();
      if (renderer) renderer.dispose();
    };
  }, [threeSettings, themeConfig]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" />;
}
