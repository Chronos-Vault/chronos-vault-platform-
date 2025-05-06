import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './HolographicHero.css';
import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Effects, Text3D, Text, useTexture, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import { motion } from 'framer-motion';

// Floating Vault Component
function FloatingVault({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [springs, api] = useSpring(() => ({
    position: position as any,
    rotation: [0, 0, 0],
    config: { mass: 2, tension: 50, friction: 15 }
  }));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gentle floating motion
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  // Vault geometry with holographic material
  return (
    <animated.mesh
      ref={meshRef}
      position={springs.position}
      rotation={springs.rotation as any}
      scale={scale}
      onPointerOver={() => api.start({ scale: scale * 1.2 })}
      onPointerOut={() => api.start({ scale: scale })}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#6B00D7"
        emissive="#FF5AF7"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
        transparent={true}
        opacity={0.7}
      />
      <boxGeometry args={[1.05, 1.05, 1.05]} />
      <meshStandardMaterial
        color="#FF5AF7"
        wireframe={true}
        transparent={true}
        emissive="#FF5AF7"
        emissiveIntensity={1}
      />
    </animated.mesh>
  );
}

// Holographic Grid Component
function HolographicGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.PI / 2; // Flat on the x-z plane
      gridRef.current.position.y = -1.5; // Below the vault
    }
  });

  return (
    <group ref={gridRef}>
      <gridHelper 
        args={[20, 20, '#6B00D7', '#FF5AF7']} 
        position={[0, 0, 0]}
      />
      <gridHelper 
        args={[20, 4, '#FF5AF7', '#6B00D7']} 
        position={[0, -0.01, 0]}
      />
    </group>
  );
}

// Particles Component
function Particles({ count = 500 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<THREE.Object3D[]>([]);
  
  useEffect(() => {
    if (!mesh.current) return;

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Object3D();
      const radius = 5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Convert spherical to Cartesian coordinates
      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);
      
      particle.scale.setScalar(Math.random() * 0.05 + 0.02);
      particle.updateMatrix();
      
      particles.current.push(particle);
      mesh.current.setMatrixAt(i, particle.matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count]);
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const time = clock.getElapsedTime() * 0.2;
    
    for (let i = 0; i < count; i++) {
      const particle = particles.current[i];
      
      // Rotate particles around center
      const theta = time + i * 0.01;
      const radius = particle.position.length() + Math.sin(time + i) * 0.1;
      
      particle.position.x = radius * Math.sin(particle.position.y) * Math.cos(theta);
      particle.position.z = radius * Math.sin(particle.position.y) * Math.sin(theta);
      
      particle.updateMatrix();
      mesh.current.setMatrixAt(i, particle.matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#FF5AF7" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Main Scene with post-processing effects
function Scene() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight position={[5, 5, 5]} intensity={0.8} />
      <spotLight position={[-5, 5, 5]} intensity={0.4} color="#FF5AF7" />
      
      <FloatingVault position={[0, 0, 0]} scale={1.2} />
      <HolographicGrid />
      <Particles count={200} />
      
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#FF5AF7"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Poppins-Bold.ttf"
      >
        CHRONOS VAULT
      </Text>
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
        <ChromaticAberration
          offset={[0.003, 0.003]}
          blendFunction={BlendFunction.NORMAL}
        />
        <Glitch
          delay={[1.5, 3.5]}
          duration={[0.1, 0.3]}
          strength={[0.02, 0.08]}
          mode={GlitchMode.SPORADIC}
        />
      </EffectComposer>
      
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

// Holographic Digital Rain Component
function DigitalRain() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="digital-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="rain-column" style={{ 
            left: `${i * 5}%`, 
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 5 + 10}s`
          }}>
            {Array.from({ length: 30 }).map((_, j) => (
              <div key={j} className="rain-drop"
                style={{ 
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.5
                }}
              >
                {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Holographic Hero Component
export default function HolographicHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,0,215,0.3),transparent_70%)]" />
      
      {/* Digital rain effect */}
      <DigitalRain />
      
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-glow">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Secure Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">Digital Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            The ultimate multi-chain digital vault platform with military-grade security and time-lock mechanisms
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg text-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-neon-purple">
              Create Vault
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-purple-500 text-purple-100 font-medium rounded-lg text-lg hover:bg-purple-900/30 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
    </div>
  );
}
