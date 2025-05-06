import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Lock, LockKeyhole, Network, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import './HolographicHero.css';

interface CyberpunkHolographicHeroProps {
  onCreateVault: () => void;
}

const CyberpunkHolographicHero: React.FC<CyberpunkHolographicHeroProps> = ({ onCreateVault }) => {
  const [securityRating, setSecurityRating] = useState(100);
  const [securityFeatures, setSecurityFeatures] = useState([
    { id: 1, name: 'Military-Grade Encryption', active: true },
    { id: 2, name: 'Triple-Chain Verification', active: true },
    { id: 3, name: 'Quantum-Resistant Algorithms', active: true },
    { id: 4, name: 'Zero-Knowledge Privacy', active: true },
  ]);
  const [scanLines, setScanLines] = useState<Array<{id: number, delay: number}>>([]);
  const [hashDisplay, setHashDisplay] = useState({
    top: 'SXFE7bb82Egdh4j8dFcg3X1HE2t000c6',
    bottom: 'ED8cp_j4_g8t33ygbLwk-3pfFHsiNadbXZJ3'
  });
  const [glitchActive, setGlitchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Canvas ref for 3D animations
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // 3D cube vertices
  const cubeVertices = [
    // Front face
    {x: -1, y: -1, z: 1},
    {x: 1, y: -1, z: 1},
    {x: 1, y: 1, z: 1},
    {x: -1, y: 1, z: 1},
    // Back face
    {x: -1, y: -1, z: -1},
    {x: 1, y: -1, z: -1},
    {x: 1, y: 1, z: -1},
    {x: -1, y: 1, z: -1},
  ];
  
  // Cube edges
  const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // front face
    [4, 5], [5, 6], [6, 7], [7, 4], // back face
    [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
  ];
  
  // Octahedron vertices
  const octaVertices = [
    {x: 0, y: 0, z: 1.5}, // top
    {x: 1, y: 0, z: 0},   // right
    {x: 0, y: 1, z: 0},   // front
    {x: -1, y: 0, z: 0},  // left
    {x: 0, y: -1, z: 0},  // back
    {x: 0, y: 0, z: -1.5} // bottom
  ];
  
  // Octahedron edges
  const octaEdges = [
    [0, 1], [0, 2], [0, 3], [0, 4], // top connections
    [5, 1], [5, 2], [5, 3], [5, 4], // bottom connections
    [1, 2], [2, 3], [3, 4], [4, 1]  // middle
  ];
  
  // Initialize scan lines
  useEffect(() => {
    const lines = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: i * 0.1
    }));
    setScanLines(lines);
  }, []);
  
  // Add occasional glitch effect for sci-fi movie feel
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 8000);

    return () => clearInterval(glitchTimer);
  }, []);

  // Add 3D hover effect for sci-fi movie feel
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.5s ease';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Simulate security hash updates - with reduced frequency and complexity
  useEffect(() => {
    // Only update a single character at a time to reduce CPU load
    const interval = setInterval(() => {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
      
      // Choose which hash to update (top or bottom)
      const updateTop = Math.random() > 0.5;
      
      if (updateTop) {
        // Randomly change just one character in the top hash
        const position = Math.floor(Math.random() * hashDisplay.top.length);
        const newChar = characters.charAt(Math.floor(Math.random() * characters.length));
        const newTopHash = hashDisplay.top.substring(0, position) + 
                          newChar + 
                          hashDisplay.top.substring(position + 1);
        
        setHashDisplay(prev => ({
          ...prev,
          top: newTopHash
        }));
      } else {
        // Randomly change just one character in the bottom hash
        const position = Math.floor(Math.random() * hashDisplay.bottom.length);
        const newChar = characters.charAt(Math.floor(Math.random() * characters.length));
        const newBottomHash = hashDisplay.bottom.substring(0, position) + 
                             newChar + 
                             hashDisplay.bottom.substring(position + 1);
        
        setHashDisplay(prev => ({
          ...prev,
          bottom: newBottomHash
        }));
      }
    }, 5000); // Reduced frequency from 2000ms to 5000ms
    
    return () => clearInterval(interval);
  }, [hashDisplay]);

  // 3D Canvas animation with holographic objects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Rotation angles
    let rotationX = 0;
    let rotationY = 0;
    let rotationZ = 0;
    
    // Grid properties
    const grid = {
      size: 20,
      divisions: 20,
      lineWidth: 1,
      color: '#6B00D7'
    };
    
    // Function to create particle cloud
    const particles = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 15,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.6 ? '#FF5AF7' : '#6B00D7',
        speed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        }
      });
    }
    
    // Function to project 3D point to 2D
    const project = (point, width, height, fov = 200, distance = 5) => {
      const scale = fov / (distance + point.z);
      return {
        x: point.x * scale + width / 2,
        y: point.y * scale + height / 2,
        scale
      };
    };
    
    // Function to rotate point around X axis
    const rotateX = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
      };
    };
    
    // Function to rotate point around Y axis
    const rotateY = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos - point.z * sin,
        y: point.y,
        z: point.x * sin + point.z * cos
      };
    };
    
    // Function to rotate point around Z axis
    const rotateZ = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
        z: point.z
      };
    };
    
    // Function to draw a grid
    const drawGrid = (width, height) => {
      const gridZ = -3;
      const size = grid.size;
      const divisions = grid.divisions;
      const step = size / divisions;
      const halfSize = size / 2;
      
      // Draw grid lines
      ctx.strokeStyle = grid.color;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.2;
      
      for (let i = 0; i <= divisions; i++) {
        const pos = i * step - halfSize;
        
        // Create X axis lines
        let start = {x: -halfSize, y: pos, z: gridZ};
        let end = {x: halfSize, y: pos, z: gridZ};
        
        // Apply rotations
        start = rotateX(start, rotationX);
        start = rotateY(start, rotationY);
        start = rotateZ(start, rotationZ);
        
        end = rotateX(end, rotationX);
        end = rotateY(end, rotationY);
        end = rotateZ(end, rotationZ);
        
        // Project to 2D
        const startProj = project(start, width, height);
        const endProj = project(end, width, height);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(startProj.x, startProj.y);
        ctx.lineTo(endProj.x, endProj.y);
        ctx.stroke();
        
        // Create Y axis lines
        start = {x: pos, y: -halfSize, z: gridZ};
        end = {x: pos, y: halfSize, z: gridZ};
        
        // Apply rotations
        start = rotateX(start, rotationX);
        start = rotateY(start, rotationY);
        start = rotateZ(start, rotationZ);
        
        end = rotateX(end, rotationX);
        end = rotateY(end, rotationY);
        end = rotateZ(end, rotationZ);
        
        // Project to 2D
        const startProj2 = project(start, width, height);
        const endProj2 = project(end, width, height);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(startProj2.x, startProj2.y);
        ctx.lineTo(endProj2.x, endProj2.y);
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    };
    
    // Function to draw 3D object
    const drawObject = (vertices, edges, scale = 1, offsetX = 0, offsetY = 0, offsetZ = 0, width, height, color = '#FF5AF7') => {
      // Scale and offset vertices
      const transformedVertices = vertices.map(v => ({
        x: v.x * scale + offsetX,
        y: v.y * scale + offsetY,
        z: v.z * scale + offsetZ
      }));
      
      // Apply rotations
      let rotatedVertices = transformedVertices.map(v => {
        let point = rotateX(v, rotationX);
        point = rotateY(point, rotationY);
        point = rotateZ(point, rotationZ);
        return point;
      });
      
      // Project to 2D
      const projectedVertices = rotatedVertices.map(v => project(v, width, height));
      
      // Draw edges
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      edges.forEach(edge => {
        const v1 = projectedVertices[edge[0]];
        const v2 = projectedVertices[edge[1]];
        
        // Create gradient for edge
        const gradient = ctx.createLinearGradient(v1.x, v1.y, v2.x, v2.y);
        gradient.addColorStop(0, '#6B00D7');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, '#6B00D7');
        
        // Draw line with glow effect
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 * Math.max(v1.scale, v2.scale);
        ctx.stroke();
        
        // Add glow
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.strokeStyle = 'rgba(255, 90, 247, 0.3)';
        ctx.lineWidth = 4 * Math.max(v1.scale, v2.scale);
        ctx.stroke();
      });
      
      // Draw vertices
      projectedVertices.forEach(vertex => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 3 * vertex.scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add glow to vertex
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 6 * vertex.scale, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(
          vertex.x, vertex.y, 0,
          vertex.x, vertex.y, 6 * vertex.scale
        );
        glow.addColorStop(0, 'rgba(255, 90, 247, 0.8)');
        glow.addColorStop(1, 'rgba(255, 90, 247, 0)');
        ctx.fillStyle = glow;
        ctx.fill();
      });
    };
    
    // Draw particles
    const drawParticles = (width, height) => {
      particles.forEach(p => {
        // Update position
        p.x += p.speed.x;
        p.y += p.speed.y;
        p.z += p.speed.z;
        
        // Wrap around if out of bounds
        if (p.x > 10 || p.x < -10) p.speed.x *= -1;
        if (p.y > 10 || p.y < -10) p.speed.y *= -1;
        if (p.z > 10 || p.z < -10) p.speed.z *= -1;
        
        // Create a rotated point
        let point = {x: p.x, y: p.y, z: p.z};
        point = rotateX(point, rotationX);
        point = rotateY(point, rotationY);
        point = rotateZ(point, rotationZ);
        
        // Project to 2D
        const proj = project(point, width, height);
        
        // Only draw if in front of camera
        if (point.z < 0) return;
        
        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add glow effect
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * 3 * proj.scale, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(
          proj.x, proj.y, 0,
          proj.x, proj.y, p.size * 3 * proj.scale
        );
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };
    
    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Update canvas size if needed
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        setCanvasSize();
      }
      
      // Clear canvas with semi-transparent black (for motion trails)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update rotations
      rotationX += 0.003;
      rotationY += 0.005;
      rotationZ += 0.001;
      
      // Draw the grid
      drawGrid(canvas.width, canvas.height);
      
      // Draw main cube
      drawObject(cubeVertices, cubeEdges, 2, 0, 0, -5, canvas.width, canvas.height);
      
      // Draw octahedron
      drawObject(octaVertices, octaEdges, 1.5, 3, -2, -7, canvas.width, canvas.height, '#6B00D7');
      
      // Draw another smaller cube
      drawObject(cubeVertices, cubeEdges, 1, -3, 2, -6, canvas.width, canvas.height, '#FF5AF7');
      
      // Draw particles
      drawParticles(canvas.width, canvas.height);
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return (
    <section className="relative overflow-hidden bg-[#080808] py-20 flex items-center justify-center min-h-[90vh]">
      {/* Digital rain effect */}
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
      
      {/* 3D Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ background: 'transparent' }} 
      />
      
      {/* Background grid and glows - simpler */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#6B00D7] rounded-full filter blur-[120px] opacity-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[#FF5AF7] rounded-full filter blur-[140px] opacity-10"></div>
      
      {/* Shimmering overlay */}
      <div className="absolute inset-0 shimmer"></div>
      
      <div className="container mx-auto px-4 z-10 max-w-5xl">
        {/* Main header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40 mb-6">
            <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
              <Shield className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
              <span>TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
            </span>
          </div>
          
          <h1 className="font-bold mb-4">
            <span className="hero-title">Unbreakable Vault Technology</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Pioneering the most sophisticated security architecture ever developed for digital assets
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column - Security Dashboard */}
          <div className="relative mx-auto lg:mx-0 max-w-md w-full">
            {/* Top hash display - styled to match image */}
            <div className="text-xs text-[#6B00D7] font-mono mb-3 overflow-hidden whitespace-nowrap text-center bg-[#121212]/50 py-1 rounded-md">
              {hashDisplay.top}
            </div>
            
            {/* Main security card - sci-fi movie style */}
            <div className="relative mb-3" ref={cardRef} style={{ transition: 'transform 0.1s ease' }}>
              <div className={`relative bg-[#121212] border border-[#6B00D7]/40 rounded-xl p-8 shadow-[0_0_40px_rgba(107,0,215,0.6)] overflow-hidden backdrop-blur-sm ${glitchActive ? 'animate-pulse' : ''}`}>
                {/* Enhanced sci-fi scan lines effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  {/* Holographic scan lines - subtle animation */}
                  {scanLines.slice(0, 15).map((line, index) => (
                    <div 
                      key={line.id} 
                      className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7]/30 to-transparent"
                      style={{ 
                        top: `${(line.id * 100) / 15}%`,
                        animation: `scanline-move ${2 + index % 3}s linear infinite`,
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0.2 + (index % 3) * 0.1
                      }} 
                    />
                  ))}
                  
                  {/* Cross hairs */}
                  <div className="absolute h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7]/40 to-transparent top-1/4"></div>
                  <div className="absolute h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7]/40 to-transparent top-3/4"></div>
                  <div className="absolute w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#FF5AF7]/40 to-transparent left-1/4"></div>
                  <div className="absolute w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#FF5AF7]/40 to-transparent left-3/4"></div>
                </div>
                
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6B00D7]/5 to-[#FF5AF7]/5 opacity-50"></div>
                
                {/* Sci-fi grid pattern overlay */}
                <div className="absolute inset-0 opacity-20" 
                  style={{
                    backgroundImage: 'linear-gradient(to right, #FF5AF7 1px, transparent 1px), linear-gradient(to bottom, #FF5AF7 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                ></div>
                
                {/* Security rating - sci-fi style */}
                <div className="text-center mb-6 relative z-10">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-mono letter-spacing-wider">SECURITY RATING:</div>
                  <div className="text-xl font-bold text-[#FF5AF7] glow-text"
                    style={{ textShadow: '0 0 10px rgba(255, 90, 247, 0.7)' }}>
                    {securityRating}%
                  </div>
                </div>
                
                {/* Central Shield Icon - sci-fi movie style */}
                <div className="relative flex justify-center items-center mb-4">
                  {/* Pulsating circles behind shield */}
                  <div className="absolute w-40 h-40 rounded-full bg-[#6B00D7]/5 animate-pulse-slow"></div>
                  <div className="absolute w-32 h-32 rounded-full bg-[#6B00D7]/10" 
                    style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                  <div className="absolute w-24 h-24 rounded-full bg-[#6B00D7]/15" 
                    style={{ animation: 'pulse 3s ease-in-out infinite' }}></div>
                  <div className="absolute w-16 h-16 rounded-full bg-[#6B00D7]/20" 
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}></div>
                  
                  {/* Central shield with glow effect */}
                  <div className="relative z-10" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 90, 247, 0.7))' }}>
                    <Shield className="w-14 h-14 text-[#FF5AF7]" />
                  </div>
                  
                  {/* Connection points - pulsating purple dots with glow */}
                  <div className="absolute w-full h-full pointer-events-none">
                    {[45, 135, 225, 315].map((angle, index) => (
                      <div 
                        key={index}
                        className="absolute rounded-full"
                        style={{
                          top: `${50 + 42 * Math.sin(angle * Math.PI / 180)}%`,
                          left: `${50 + 42 * Math.cos(angle * Math.PI / 180)}%`,
                          width: '10px',
                          height: '10px',
                          background: 'rgba(255, 90, 247, 0.7)',
                          boxShadow: '0 0 10px 2px rgba(255, 90, 247, 0.7)',
                          animation: `pulse ${1.5 + index * 0.5}s ease-in-out infinite`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Connection lines between dots */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                    <line 
                      x1="8%" y1="8%"
                      x2="92%" y2="8%"
                      stroke="rgba(255, 90, 247, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <line 
                      x1="8%" y1="8%"
                      x2="8%" y2="92%"
                      stroke="rgba(255, 90, 247, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <line 
                      x1="92%" y1="8%"
                      x2="92%" y2="92%"
                      stroke="rgba(255, 90, 247, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    <line 
                      x1="8%" y1="92%"
                      x2="92%" y2="92%"
                      stroke="rgba(255, 90, 247, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Bottom hash display - styled to match image */}
            <div className="text-xs text-[#6B00D7] font-mono mt-3 overflow-hidden whitespace-nowrap text-center bg-[#121212]/50 py-1 rounded-md">
              {hashDisplay.bottom}
            </div>
            
            {/* Blockchain connections - styled like the image */}
            <div className="flex justify-between mt-6">
              <div className="bg-[#121212]/80 border border-[#333] rounded-lg px-3 py-2 flex items-center w-[48%]">
                <div className="mr-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5AF7]"></div>
                </div>
                <div className="text-xs md:text-sm">ETH Secured</div>
              </div>
              
              <div className="bg-[#121212]/80 border border-[#333] rounded-lg px-3 py-2 flex items-center w-[48%]">
                <div className="mr-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5AF7]"></div>
                </div>
                <div className="text-xs md:text-sm">TON Secured</div>
              </div>
            </div>
          </div>
          
          {/* Right column - Features and CTA */}
          <div className="space-y-8">
            {/* Security features - exactly matching the image */}
            <div className="flex flex-col space-y-3">
              {securityFeatures.map((feature) => (
                <div 
                  key={feature.id} 
                  className="bg-[#121212]/80 border border-[#6B00D7]/30 rounded-full py-2.5 px-5 inline-flex items-center w-fit"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5AF7] mr-3"></div>
                  <span className="text-sm text-white font-medium">{feature.name}</span>
                </div>
              ))}
            </div>
            
            {/* Call to action */}
            <div className="relative pt-10">
              <div className="absolute -top-5 left-0 w-full">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent opacity-50"></div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={onCreateVault} 
                  className="w-full py-6 text-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity border-0 shadow-lg shadow-[#6B00D7]/20"
                >
                  <Lock className="mr-2" /> Create Secure Vault
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-lg border-2 border-[#6B00D7] hover:border-[#FF5AF7] hover:bg-[#6B00D7]/10 transition-all text-white"
                  asChild
                >
                  <Link href="/multi-signature-vault">
                    <LockKeyhole className="mr-2" /> Multi-Signature Vault
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CyberpunkHolographicHero;