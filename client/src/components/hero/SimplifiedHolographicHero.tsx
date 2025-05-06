import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './HolographicHero.css';

// Digital Rain Animation
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

// Holographic Vault visualization
function HolographicVault() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let frame = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update animation frame
      frame++;
      
      // Draw holographic cube
      const time = frame * 0.02;
      const size = Math.min(canvas.width, canvas.height) * 0.2;
      const rotation = time * 0.5;
      
      // Draw 3D cube wireframe with glowing effect
      drawHolographicCube(ctx, centerX, centerY, size, rotation, time);
      
      // Draw particles
      drawParticles(ctx, centerX, centerY, size * 2, time, 50);
      
      // Draw grid
      drawHolographicGrid(ctx, canvas.width, canvas.height, time);
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}

// Draw 3D cube wireframe with holographic effect
function drawHolographicCube(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, time: number) {
  // Define cube vertices in 3D space
  const vertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
  ];
  
  // Define edges between vertices
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];
  
  // Apply rotation to vertices
  const rotatedVertices = vertices.map(vertex => {
    // Apply rotation around Y axis
    const cosY = Math.cos(rotation);
    const sinY = Math.sin(rotation);
    const x1 = vertex[0] * cosY - vertex[2] * sinY;
    const z1 = vertex[0] * sinY + vertex[2] * cosY;
    
    // Apply rotation around X axis
    const cosX = Math.cos(rotation * 0.7);
    const sinX = Math.sin(rotation * 0.7);
    const y2 = vertex[1] * cosX - z1 * sinX;
    const z2 = vertex[1] * sinX + z1 * cosX;
    
    // Apply pulsing effect
    const scale = 1 + Math.sin(time) * 0.05;
    
    // Project 3D to 2D
    return [x + x1 * size * scale, y + y2 * size * scale];
  });
  
  // Draw edges with glow effect
  edges.forEach(edge => {
    const v1 = rotatedVertices[edge[0]];
    const v2 = rotatedVertices[edge[1]];
    
    // Gradient for glow effect
    const gradient = ctx.createLinearGradient(v1[0], v1[1], v2[0], v2[1]);
    gradient.addColorStop(0, 'rgba(107, 0, 215, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 90, 247, 1)');
    gradient.addColorStop(1, 'rgba(107, 0, 215, 0.8)');
    
    // Draw glowing line
    ctx.beginPath();
    ctx.moveTo(v1[0], v1[1]);
    ctx.lineTo(v2[0], v2[1]);
    ctx.lineWidth = 2 + Math.sin(time * 2 + edge[0]) * 1.5;
    ctx.strokeStyle = gradient;
    ctx.stroke();
    
    // Add glow
    ctx.beginPath();
    ctx.moveTo(v1[0], v1[1]);
    ctx.lineTo(v2[0], v2[1]);
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(255, 90, 247, 0.2)';
    ctx.stroke();
  });
  
  // Draw vertices
  rotatedVertices.forEach(vertex => {
    ctx.beginPath();
    ctx.arc(vertex[0], vertex[1], 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 90, 247, 0.8)';
    ctx.fill();
    
    // Add glow
    ctx.beginPath();
    ctx.arc(vertex[0], vertex[1], 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 90, 247, 0.3)';
    ctx.fill();
  });
}

// Draw particles
function drawParticles(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, time: number, count: number) {
  for (let i = 0; i < count; i++) {
    // Calculate particle position
    const angle = (i / count) * Math.PI * 2 + time * (0.1 + i * 0.001);
    const distance = radius * (0.5 + Math.sin(time * 0.5 + i * 0.1) * 0.3);
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance * 0.5; // Elliptical orbit
    
    // Particle size and opacity based on time
    const size = 2 + Math.sin(time + i) * 1.5;
    const opacity = 0.4 + Math.sin(time * 0.5 + i * 0.2) * 0.3;
    
    // Draw particle with glow
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 90, 247, ${opacity})`;
    ctx.fill();
    
    // Add glow
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 90, 247, ${opacity * 0.3})`;
    ctx.fill();
  }
}

// Draw holographic grid
function drawHolographicGrid(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const gridSize = 50;
  const gridOffsetX = (time * 20) % gridSize;
  const gridOffsetY = (time * 10) % gridSize;
  
  // Draw horizontal grid lines
  for (let y = -gridSize; y <= height + gridSize; y += gridSize) {
    const y1 = y + gridOffsetY;
    const opacity = 0.2 + Math.sin(time + y / height) * 0.1;
    
    ctx.beginPath();
    ctx.moveTo(0, y1);
    ctx.lineTo(width, y1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(107, 0, 215, ${opacity})`;
    ctx.stroke();
  }
  
  // Draw vertical grid lines
  for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
    const x1 = x + gridOffsetX;
    const opacity = 0.2 + Math.sin(time + x / width) * 0.1;
    
    ctx.beginPath();
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(255, 90, 247, ${opacity})`;
    ctx.stroke();
  }
}

// Main Hero Component
export default function SimplifiedHolographicHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,0,215,0.3),transparent_70%)]" />
      
      {/* Digital rain effect */}
      <DigitalRain />
      
      {/* Holographic vault visualization */}
      <HolographicVault />
      
      {/* Shimmering overlay */}
      <div className="absolute inset-0 shimmer"></div>
      
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
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg text-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-neon-purple holographic-border">
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
      
      {/* Floating glowing particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              background: Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7',
              boxShadow: `0 0 15px ${Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7'}`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `shimmer ${Math.random() * 10 + 10}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
