import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Grid, OrbitControls, RoundedBox, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThreeJsHolographicHeroProps {
  onCreateVault: () => void;
  onExploreVaults: () => void;
}

// Animated holographic cube
function HolographicCube({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const cubeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!cubeRef.current) return;
    
    // Rotate the cube
    cubeRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
    cubeRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
  });
  
  return (
    <RoundedBox 
      ref={cubeRef} 
      args={[1.5, 1.5, 1.5]} 
      radius={0.1} 
      position={position}
      smoothness={4}
    >
      <meshPhysicalMaterial 
        color="#6B00D7"
        transmission={0.8}
        roughness={0.1} 
        metalness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#FF5AF7"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </RoundedBox>
  );
}

// Animated holographic torus
function HolographicTorus({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const torusRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!torusRef.current) return;
    
    // Rotate the torus
    torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });
  
  return (
    <Torus 
      ref={torusRef} 
      args={[1, 0.4, 16, 32]} 
      position={position}
    >
      <meshPhysicalMaterial 
        color="#FF5AF7"
        transmission={0.7}
        roughness={0.1} 
        metalness={0.6}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#6B00D7"
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
      />
    </Torus>
  );
}

// Animated holographic particles
function HolographicParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Mesh[]>([]);
  const particleCount = 20;
  
  // Create refs for all particles
  if (particleRefs.current.length !== particleCount) {
    particleRefs.current = Array(particleCount).fill(null);
  }
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    // Animate each particle
    particleRefs.current.forEach((particle, i) => {
      if (!particle) return;
      
      const offset = i * 0.1;
      particle.position.y = Math.sin(state.clock.getElapsedTime() * 0.5 + offset) * 0.5;
      particle.scale.setScalar(0.8 + Math.sin(state.clock.getElapsedTime() * 0.3 + offset) * 0.2);
    });
  });
  
  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 4 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 4;
        const scale = 0.05 + Math.random() * 0.1;
        
        return (
          <Icosahedron 
            key={i}
            args={[1, 1]} 
            position={[x, y, z]}
            scale={scale}
            ref={(el) => {
              if (el) particleRefs.current[i] = el;
            }}
          >
            <meshBasicMaterial 
              color="#FF5AF7"
              transparent
              opacity={0.7}
              toneMapped={false}
            />
          </Icosahedron>
        );
      })}
    </group>
  );
}

// Main 3D scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 5, 5]} intensity={0.5} />
      <spotLight position={[-5, 5, -5]} intensity={0.5} color="#FF5AF7" />
      
      {/* Main holographic objects */}
      <HolographicCube position={[-2, 0, 0]} />
      <HolographicTorus position={[2, 0, 0]} />
      <HolographicParticles />
      
      {/* Grid for sci-fi effect */}
      <Grid 
        infiniteGrid 
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#FF5AF7"
        sectionSize={3.3}
        sectionThickness={1.5}
        sectionColor="#6B00D7"
        fadeDistance={30}
        fadeStrength={1.5}
        position={[0, -2, 0]}
      />
      
      {/* Add environment for reflections */}
      <Environment preset="night" />
      
      {/* Add controls with limits */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

const ThreeJsHolographicHero: React.FC<ThreeJsHolographicHeroProps> = ({ onCreateVault, onExploreVaults }) => {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-12 min-h-[90vh] flex flex-col justify-center">
      {/* Canvas for 3D content with proper sizing */}
      <div className="absolute inset-0 z-10">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Content overlay */}
      <div className="container relative z-20 mx-auto px-4 max-w-5xl">
        {/* Main header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40 mb-6">
            <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
              <Shield className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
              <span>TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">
            Unbreakable Vault Technology
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Pioneering the most sophisticated security architecture ever developed for digital assets
          </p>
        </div>
        
        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
          <Button 
            onClick={onCreateVault} 
            className="bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white px-8 py-6 rounded-lg text-lg"
          >
            Create Your Vault
          </Button>
          
          <Button 
            onClick={onExploreVaults}
            variant="outline" 
            className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10 px-8 py-6 rounded-lg text-lg"
          >
            Explore Vaults
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ThreeJsHolographicHero;