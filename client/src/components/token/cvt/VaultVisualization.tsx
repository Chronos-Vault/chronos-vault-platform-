import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface VaultVisualizationProps {
  vaultId: number;
  status: 'released' | 'upcoming' | 'inProgress';
  theme: string;
  year: number;
  percentage: number;
}

const VaultVisualization: React.FC<VaultVisualizationProps> = ({
  vaultId,
  status,
  theme,
  year,
  percentage
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);
  
  // Create and manage the 3D scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(getThemeBackgroundColor(theme));
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create the vault object
    const vaultGroup = createVault(vaultId, status, theme, year, percentage);
    scene.add(vaultGroup);
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (isRotating || status === 'released') {
        vaultGroup.rotation.y += 0.005;
      }
      
      // Add subtle floating animation regardless of rotation state
      vaultGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      renderer.dispose();
    };
  }, [vaultId, status, theme, year, percentage, isRotating]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-pointer" 
        onMouseEnter={() => setIsRotating(true)}
        onMouseLeave={() => setIsRotating(false)}
      />
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-md text-sm backdrop-blur-sm">
        {getVaultName(vaultId)} • {year}
      </div>
    </div>
  );
};

// Helper function to create vault 3D object
function createVault(
  vaultId: number, 
  status: 'released' | 'upcoming' | 'inProgress',
  theme: string,
  year: number,
  percentage: number
): THREE.Group {
  const group = new THREE.Group();
  
  // Create the outer vault shape
  const vaultGeometry = new THREE.CapsuleGeometry(1, 1.5, 16, 32);
  const vaultMaterial = new THREE.MeshStandardMaterial({
    color: getThemeColor(theme),
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: status === 'released' ? 0.8 : 0.6,
  });
  const vault = new THREE.Mesh(vaultGeometry, vaultMaterial);
  vault.rotation.x = Math.PI / 2; // Rotate to stand upright
  group.add(vault);
  
  // Add decorative rings around the vault
  const ringGeometry = new THREE.TorusGeometry(1.1, 0.05, 8, 32);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: getThemeAccentColor(theme),
    metalness: 0.9,
    roughness: 0.1,
    emissive: getThemeAccentColor(theme),
    emissiveIntensity: status === 'released' ? 0.5 : 0.2,
  });
  
  // Top ring
  const topRing = new THREE.Mesh(ringGeometry, ringMaterial);
  topRing.position.y = 0.75;
  topRing.rotation.x = Math.PI / 2;
  group.add(topRing);
  
  // Bottom ring
  const bottomRing = new THREE.Mesh(ringGeometry, ringMaterial);
  bottomRing.position.y = -0.75;
  bottomRing.rotation.x = Math.PI / 2;
  group.add(bottomRing);
  
  // Middle ring
  const middleRing = new THREE.Mesh(ringGeometry, ringMaterial);
  middleRing.rotation.x = Math.PI / 2;
  group.add(middleRing);
  
  // Add percentage indicator
  const indicatorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5 * (percentage / 100), 32, 1, true);
  const indicatorMaterial = new THREE.MeshStandardMaterial({
    color: getThemeAccentColor(theme),
    transparent: true,
    opacity: 0.4,
    emissive: getThemeAccentColor(theme),
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide,
  });
  
  const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
  indicator.position.y = -0.75 + (1.5 * (percentage / 100) / 2);
  group.add(indicator);
  
  // Add lock/unlock symbol
  const symbolSize = 0.3;
  const symbolGeometry = new THREE.PlaneGeometry(symbolSize, symbolSize);
  
  // Create a canvas to draw the lock/unlock symbol
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  if (context) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    if (status === 'released') {
      // Draw unlock symbol
      context.strokeStyle = '#00ff00';
      context.lineWidth = 10;
      
      // Shackle
      context.arc(64, 40, 25, Math.PI, Math.PI * 2, false);
      context.lineTo(89, 70);
      
      // Body
      context.moveTo(39, 70);
      context.lineTo(89, 70);
      context.lineTo(89, 110);
      context.lineTo(39, 110);
      context.lineTo(39, 70);
    } else {
      // Draw lock symbol
      context.strokeStyle = '#ff0000';
      context.lineWidth = 10;
      
      // Shackle
      context.arc(64, 40, 25, 0, Math.PI, true);
      
      // Body
      context.moveTo(39, 40);
      context.lineTo(39, 110);
      context.lineTo(89, 110);
      context.lineTo(89, 40);
      context.lineTo(64, 40);
    }
    context.stroke();
    
    // Add year text
    context.fillStyle = status === 'released' ? '#008800' : '#880000';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillText(year.toString(), 64, 85);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  const symbolMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });
  
  const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
  symbol.position.set(0, 0, 1.05);
  symbol.rotation.x = Math.PI / 2;
  symbol.rotation.z = Math.PI;
  group.add(symbol);
  
  // Add glow effect if released
  if (status === 'released') {
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: getThemeAccentColor(theme),
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
  }
  
  return group;
}

// Helper functions to get colors based on theme
function getThemeColor(theme: string): number {
  switch (theme) {
    case 'genesis':
      return 0x8a2be2; // BlueViolet
    case 'quantum':
      return 0x1e90ff; // DodgerBlue
    case 'cosmic':
      return 0x4b0082; // Indigo
    case 'nebula':
      return 0xff69b4; // HotPink
    case 'aurora':
      return 0x00a86b; // Jade
    case 'infinity':
      return 0x9370db; // MediumPurple
    default:
      return 0x808080; // Gray
  }
}

function getThemeAccentColor(theme: string): number {
  switch (theme) {
    case 'genesis':
      return 0xba55d3; // MediumOrchid
    case 'quantum':
      return 0x00bfff; // DeepSkyBlue
    case 'cosmic':
      return 0x9400d3; // DarkViolet
    case 'nebula':
      return 0xff1493; // DeepPink
    case 'aurora':
      return 0x2e8b57; // SeaGreen
    case 'infinity':
      return 0x9932cc; // DarkOrchid
    default:
      return 0xa9a9a9; // DarkGray
  }
}

function getThemeBackgroundColor(theme: string): number {
  switch (theme) {
    case 'genesis':
      return 0x120524; // Dark purple background
    case 'quantum':
      return 0x01142c; // Dark blue background
    case 'cosmic':
      return 0x0c0025; // Dark indigo background
    case 'nebula':
      return 0x1a0a15; // Dark pink background
    case 'aurora':
      return 0x001a12; // Dark green background
    case 'infinity':
      return 0x0f0a1a; // Dark purple background
    default:
      return 0x121212; // Dark gray background
  }
}

function getVaultName(id: number): string {
  const names = [
    'Genesis Vault',
    'Quantum Nexus Vault',
    'Cosmic Horizon Vault',
    'Nebula Vortex Vault',
    'Aurora Zenith Vault',
    'Infinity Convergence Vault'
  ];
  return names[id - 1] || `Vault ${id}`;
}

export default VaultVisualization;