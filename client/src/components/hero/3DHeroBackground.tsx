import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDHeroBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 15;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const positionArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Create particles at random positions with colors transitioning between purple and pink
    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Random position within a spherical region
      positionArray[i] = (Math.random() - 0.5) * 50; // x
      positionArray[i + 1] = (Math.random() - 0.5) * 50; // y
      positionArray[i + 2] = (Math.random() - 0.5) * 50; // z
      
      // Color between purple (#6B00D7) and pink (#FF5AF7)
      const t = Math.random();
      colorArray[i] = (107/255) * (1-t) + (255/255) * t;     // R
      colorArray[i + 1] = (0/255) * (1-t) + (90/255) * t;     // G
      colorArray[i + 2] = (215/255) * (1-t) + (247/255) * t;  // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Create material for particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create points mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Create a hexagonal grid pattern
    const gridGroup = new THREE.Group();
    const gridGeometry = new THREE.BufferGeometry();
    const gridMaterial = new THREE.LineBasicMaterial({ 
      color: 0x6B00D7,
      transparent: true,
      opacity: 0.2
    });
    
    const hexSize = 2;
    const gridRadius = 20;
    
    // Create hexagon grid lines
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      for (let r = hexSize; r < gridRadius; r += hexSize) {
        const hexPoints = [];
        
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3 + a;
          hexPoints.push(new THREE.Vector3(
            r * Math.cos(angle),
            r * Math.sin(angle),
            -5 + Math.random() * 2 // Slight z variation
          ));
        }
        
        // Close the hexagon
        hexPoints.push(hexPoints[0].clone());
        
        const hexGeometry = new THREE.BufferGeometry().setFromPoints(hexPoints);
        const hexLine = new THREE.Line(hexGeometry, new THREE.LineBasicMaterial({ 
          color: 0x6B00D7, 
          transparent: true, 
          opacity: 0.05 + 0.15 * (1 - r / gridRadius) // Fade out with distance
        }));
        
        gridGroup.add(hexLine);
      }
    }
    
    // Add orbital rings
    const ringGeometry1 = new THREE.RingGeometry(8, 8.05, 64);
    const ringMaterial1 = new THREE.MeshBasicMaterial({ 
      color: 0xFF5AF7, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.rotation.x = Math.PI / 2;
    
    const ringGeometry2 = new THREE.RingGeometry(12, 12.05, 64);
    const ringMaterial2 = new THREE.MeshBasicMaterial({ 
      color: 0x6B00D7, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    });
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ring2.rotation.x = Math.PI / 3;
    
    const ringGeometry3 = new THREE.RingGeometry(16, 16.05, 64);
    const ringMaterial3 = new THREE.MeshBasicMaterial({ 
      color: 0xFF5AF7, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1
    });
    const ring3 = new THREE.Mesh(ringGeometry3, ringMaterial3);
    ring3.rotation.x = Math.PI / 4;
    
    scene.add(ring1, ring2, ring3, gridGroup);
    
    // Add floating glowing spheres
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial1 = new THREE.MeshBasicMaterial({ 
      color: 0x6B00D7,
      transparent: true,
      opacity: 0.8
    });
    const sphereMaterial2 = new THREE.MeshBasicMaterial({ 
      color: 0xFF5AF7,
      transparent: true,
      opacity: 0.6
    });
    
    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
    sphere1.position.set(5, 3, 2);
    
    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    sphere2.position.set(-6, -2, -3);
    
    const sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
    sphere3.position.set(-3, 5, -1);
    
    const sphere4 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    sphere4.position.set(7, -4, 0);
    
    scene.add(sphere1, sphere2, sphere3, sphere4);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationFrameId: number;
    let animationTime = 0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update time for animations
      animationTime += 0.01;
      
      // Smooth follow for camera based on mouse
      targetX = mouseX * 2;
      targetY = -mouseY * 2;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Rotate particles slowly
      particles.rotation.y = animationTime * 0.05;
      particles.rotation.x = animationTime * 0.025;
      
      // Animate orbital rings
      ring1.rotation.z = animationTime * 0.2;
      ring2.rotation.z = -animationTime * 0.15;
      ring3.rotation.z = animationTime * 0.1;
      
      // Move floating spheres
      sphere1.position.y = 3 + Math.sin(animationTime * 0.5) * 1;
      sphere2.position.y = -2 + Math.sin(animationTime * 0.7) * 1.2;
      sphere3.position.y = 5 + Math.sin(animationTime * 0.6) * 0.8;
      sphere4.position.y = -4 + Math.sin(animationTime * 0.4) * 1.5;
      
      // Slowly rotate the grid
      gridGroup.rotation.y = animationTime * 0.02;
      gridGroup.rotation.x = Math.sin(animationTime * 0.05) * 0.2;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 overflow-hidden"
    />
  );
};

export default ThreeDHeroBackground;