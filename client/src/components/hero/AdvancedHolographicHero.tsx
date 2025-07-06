import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './HolographicHero.css';

/**
 * Advanced Holographic Hero Section with Canvas-based 3D effects
 * Creates a stunning visual experience with cyberpunk holographic style
 * using pure canvas API for maximum compatibility
 */

// Vertex class for 3D operations
class Vertex {
  x: number;
  y: number;
  z: number;
  
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  // Rotate vertex around X axis
  rotateX(angle: number): Vertex {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const y = this.y * cos - this.z * sin;
    const z = this.y * sin + this.z * cos;
    return new Vertex(this.x, y, z);
  }
  
  // Rotate vertex around Y axis
  rotateY(angle: number): Vertex {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.z * sin;
    const z = this.x * sin + this.z * cos;
    return new Vertex(x, this.y, z);
  }
  
  // Rotate vertex around Z axis
  rotateZ(angle: number): Vertex {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    return new Vertex(x, y, this.z);
  }
  
  // Project 3D vertex to 2D screen space
  project(width: number, height: number, fov: number, distance: number): {x: number, y: number, scale: number} {
    const factor = fov / (distance + this.z);
    const x = this.x * factor + width / 2;
    const y = this.y * factor + height / 2;
    return {
      x,
      y,
      scale: factor
    };
  }
}

// Edge class connecting two vertices
class Edge {
  a: number;
  b: number;
  // Holographic color options
  color: string;
  pulseSpeed: number;
  pulseMin: number;
  pulseMax: number;
  
  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
    
    // Randomize each edge for more dynamic appearance
    this.color = Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7';
    this.pulseSpeed = 0.5 + Math.random() * 2;
    this.pulseMin = 0.1 + Math.random() * 0.3;
    this.pulseMax = 0.7 + Math.random() * 0.3;
  }
}

// Shape class for 3D objects
class Shape {
  vertices: Vertex[];
  edges: Edge[];
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  
  constructor(vertices: Vertex[], edges: Edge[]) {
    this.vertices = vertices;
    this.edges = edges;
    this.rotation = { x: 0, y: 0, z: 0 };
    this.position = { x: 0, y: 0, z: 0 };
  }
  
  // Rotate shape by updating all vertices
  rotate(x: number, y: number, z: number): void {
    this.rotation.x += x;
    this.rotation.y += y;
    this.rotation.z += z;
  }
  
  // Get transformed vertices after all rotations and translations
  getTransformedVertices(width: number, height: number, fov: number, distance: number): {x: number, y: number, scale: number}[] {
    return this.vertices.map(vertex => {
      // Apply position offset
      const v = new Vertex(
        vertex.x + this.position.x,
        vertex.y + this.position.y,
        vertex.z + this.position.z
      );
      
      // Apply all rotations
      const vRotated = v
        .rotateX(this.rotation.x)
        .rotateY(this.rotation.y)
        .rotateZ(this.rotation.z);
      
      // Project to 2D
      return vRotated.project(width, height, fov, distance);
    });
  }
}

// Create a cube shape
function createCube(size: number): Shape {
  const vertices = [
    new Vertex(-size, -size, -size), // 0: bottom-back-left
    new Vertex(size, -size, -size),  // 1: bottom-back-right
    new Vertex(size, size, -size),   // 2: top-back-right
    new Vertex(-size, size, -size),  // 3: top-back-left
    new Vertex(-size, -size, size),  // 4: bottom-front-left
    new Vertex(size, -size, size),   // 5: bottom-front-right
    new Vertex(size, size, size),    // 6: top-front-right
    new Vertex(-size, size, size)    // 7: top-front-left
  ];
  
  const edges = [
    // Back face
    new Edge(0, 1),
    new Edge(1, 2),
    new Edge(2, 3),
    new Edge(3, 0),
    
    // Front face
    new Edge(4, 5),
    new Edge(5, 6),
    new Edge(6, 7),
    new Edge(7, 4),
    
    // Connecting edges
    new Edge(0, 4),
    new Edge(1, 5),
    new Edge(2, 6),
    new Edge(3, 7),
    
    // Additional cross edges for more holographic complexity
    new Edge(0, 2),
    new Edge(1, 3),
    new Edge(4, 6),
    new Edge(5, 7),
    new Edge(0, 6),
    new Edge(1, 7)
  ];
  
  return new Shape(vertices, edges);
}

// Create octahedron shape
function createOctahedron(size: number): Shape {
  const vertices = [
    new Vertex(0, 0, size),       // 0: top
    new Vertex(size, 0, 0),       // 1: right
    new Vertex(0, size, 0),       // 2: front
    new Vertex(-size, 0, 0),      // 3: left
    new Vertex(0, -size, 0),      // 4: back
    new Vertex(0, 0, -size)       // 5: bottom
  ];
  
  const edges = [
    // Top connections
    new Edge(0, 1),
    new Edge(0, 2),
    new Edge(0, 3),
    new Edge(0, 4),
    
    // Bottom connections
    new Edge(5, 1),
    new Edge(5, 2),
    new Edge(5, 3),
    new Edge(5, 4),
    
    // Middle connections
    new Edge(1, 2),
    new Edge(2, 3),
    new Edge(3, 4),
    new Edge(4, 1)
  ];
  
  return new Shape(vertices, edges);
}

// Create particle cloud
function createParticleCloud(count: number, radius: number): {
  positions: Array<{x: number, y: number, z: number}>,
  sizes: number[],
  colors: string[],
  speeds: Array<{x: number, y: number, z: number}>
} {
  const positions = [];
  const sizes = [];
  const colors = [];
  const speeds = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random spherical coordinates
    const r = radius * (0.2 + Math.random() * 0.8);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    // Convert to Cartesian coordinates
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    positions.push({ x, y, z });
    sizes.push(Math.random() * 3 + 1);
    colors.push(Math.random() > 0.6 ? '#FF5AF7' : '#6B00D7');
    
    // Add random movement speeds
    speeds.push({
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.2
    });
  }
  
  return { positions, sizes, colors, speeds };
}

// Digital Rain Animation Component
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

// HolographicAnimation component - handles the canvas animation
function HolographicAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize objects
    const cube = createCube(40);
    const octahedron = createOctahedron(60);
    octahedron.position.z = 60;
    octahedron.position.y = -20;
    
    const smallCube = createCube(15);
    smallCube.position.x = 80;
    smallCube.position.y = -30;
    
    const secondSmallCube = createCube(20);
    secondSmallCube.position.x = -90;
    secondSmallCube.position.y = 40;
    
    const shapes = [cube, octahedron, smallCube, secondSmallCube];
    
    // Create particle cloud
    const particles = createParticleCloud(100, 150);
    
    // Grid properties
    const grid = {
      size: 200,
      divisions: 10,
      lineWidth: 0.5,
      color1: '#6B00D7',
      color2: '#FF5AF7',
      zOffset: 120
    };
    
    // Camera/view properties
    const view = {
      x: 0,
      y: 0,
      z: 300,
      fov: 250
    };
    
    // Function to resize canvas
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      setCanvasSize({ width, height });
    };
    
    // Set initial size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Function to draw grid
    const drawGrid = (time: number) => {
      const { width, height } = canvasSize;
      const size = grid.size;
      const half = size / 2;
      const spacing = size / grid.divisions;
      
      // Animate grid movement
      const zOffset = grid.zOffset;
      const angle = time * 0.0002;
      
      // Get four corners of the grid
      const createGridVertex = (x: number, y: number, z: number) => {
        return new Vertex(x, y, z)
          .rotateX(Math.PI / 2) // Lay flat
          .rotateX(Math.sin(time * 0.0003) * 0.1) // Subtle tilt animation
          .rotateZ(angle);
      };
      
      // Create grid corners
      const gridCorners = [
        createGridVertex(-half, -half, zOffset),
        createGridVertex(half, -half, zOffset),
        createGridVertex(half, half, zOffset),
        createGridVertex(-half, half, zOffset)
      ];
      
      // Project corners to screen space
      const projectedCorners = gridCorners.map(vertex => 
        vertex.project(width, height, view.fov, view.z));
      
      // Draw outer border of the grid
      ctx.beginPath();
      ctx.moveTo(projectedCorners[0].x, projectedCorners[0].y);
      for (let i = 1; i < projectedCorners.length; i++) {
        ctx.lineTo(projectedCorners[i].x, projectedCorners[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#FF5AF7';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw grid lines
      for (let i = 0; i <= grid.divisions; i++) {
        const t = i / grid.divisions;
        
        // Horizontal lines
        const start = new Vertex(-half, -half + t * size, zOffset)
          .rotateX(Math.PI / 2)
          .rotateX(Math.sin(time * 0.0003) * 0.1)
          .rotateZ(angle);
        const end = new Vertex(half, -half + t * size, zOffset)
          .rotateX(Math.PI / 2)
          .rotateX(Math.sin(time * 0.0003) * 0.1)
          .rotateZ(angle);
          
        const startProj = start.project(width, height, view.fov, view.z);
        const endProj = end.project(width, height, view.fov, view.z);
        
        ctx.beginPath();
        ctx.moveTo(startProj.x, startProj.y);
        ctx.lineTo(endProj.x, endProj.y);
        ctx.strokeStyle = i % 2 === 0 ? grid.color1 : grid.color2;
        ctx.lineWidth = i % 5 === 0 ? 1.5 : grid.lineWidth;
        ctx.globalAlpha = 0.3 + Math.sin(time * 0.001 + i * 0.5) * 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Vertical lines
        const vStart = new Vertex(-half + t * size, -half, zOffset)
          .rotateX(Math.PI / 2)
          .rotateX(Math.sin(time * 0.0003) * 0.1)
          .rotateZ(angle);
        const vEnd = new Vertex(-half + t * size, half, zOffset)
          .rotateX(Math.PI / 2)
          .rotateX(Math.sin(time * 0.0003) * 0.1)
          .rotateZ(angle);
          
        const vStartProj = vStart.project(width, height, view.fov, view.z);
        const vEndProj = vEnd.project(width, height, view.fov, view.z);
        
        ctx.beginPath();
        ctx.moveTo(vStartProj.x, vStartProj.y);
        ctx.lineTo(vEndProj.x, vEndProj.y);
        ctx.strokeStyle = i % 2 === 0 ? grid.color2 : grid.color1;
        ctx.lineWidth = i % 5 === 0 ? 1.5 : grid.lineWidth;
        ctx.globalAlpha = 0.3 + Math.sin(time * 0.001 + i * 0.5) * 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };
    
    // Animation frame handler
    let rafId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Clear canvas with translucent black for motion trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid(time);
      
      // Update and draw shapes
      shapes.forEach((shape, index) => {
        // Different rotation speeds for variety
        const rotationSpeed = (index + 1) * 0.0004;
        shape.rotate(
          rotationSpeed * delta,
          rotationSpeed * 1.5 * delta,
          rotationSpeed * 0.7 * delta
        );
        
        // Get projected vertices
        const projectedVertices = shape.getTransformedVertices(
          canvasSize.width,
          canvasSize.height,
          view.fov,
          view.z
        );
        
        // Draw edges
        shape.edges.forEach((edge, edgeIndex) => {
          const v1 = projectedVertices[edge.a];
          const v2 = projectedVertices[edge.b];
          
          // Pulse effect
          const pulse = edge.pulseMin + (Math.sin(time * 0.001 * edge.pulseSpeed) * 0.5 + 0.5) * 
                       (edge.pulseMax - edge.pulseMin);
          
          // Draw edge with glow effect
          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          
          // Edge with gradient
          const gradient = ctx.createLinearGradient(v1.x, v1.y, v2.x, v2.y);
          gradient.addColorStop(0, `rgba(107, 0, 215, ${pulse})`);
          gradient.addColorStop(0.5, `rgba(255, 90, 247, ${pulse * 1.5})`);
          gradient.addColorStop(1, `rgba(107, 0, 215, ${pulse})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2 * Math.max(v1.scale, v2.scale);
          ctx.stroke();
          
          // Outer glow
          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.strokeStyle = edge.color === '#6B00D7' ? 
            `rgba(107, 0, 215, ${pulse * 0.5})` : 
            `rgba(255, 90, 247, ${pulse * 0.5})`;
          ctx.lineWidth = 6 * Math.max(v1.scale, v2.scale);
          ctx.stroke();
        });
        
        // Draw vertices
        projectedVertices.forEach(vertex => {
          ctx.beginPath();
          ctx.arc(vertex.x, vertex.y, 3 * vertex.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#FF5AF7';
          ctx.fill();
          
          // Vertex glow
          ctx.beginPath();
          ctx.arc(vertex.x, vertex.y, 8 * vertex.scale, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            vertex.x, vertex.y, 0,
            vertex.x, vertex.y, 8 * vertex.scale
          );
          glow.addColorStop(0, 'rgba(255, 90, 247, 0.6)');
          glow.addColorStop(1, 'rgba(255, 90, 247, 0)');
          ctx.fillStyle = glow;
          ctx.fill();
        });
      });
      
      // Update and draw particles
      particles.positions.forEach((pos, i) => {
        // Update position with random movement
        pos.x += particles.speeds[i].x * delta;
        pos.y += particles.speeds[i].y * delta;
        pos.z += particles.speeds[i].z * delta;
        
        // Boundary checking - wrap around
        const bound = 150;
        if (Math.abs(pos.x) > bound) pos.x *= -0.9;
        if (Math.abs(pos.y) > bound) pos.y *= -0.9;
        if (Math.abs(pos.z) > bound) pos.z *= -0.9;
        
        // Project particle to screen space
        const vertex = new Vertex(pos.x, pos.y, pos.z);
        const proj = vertex.project(canvasSize.width, canvasSize.height, view.fov, view.z);
        
        // Calculate size and opacity based on z-position
        const size = particles.sizes[i] * proj.scale;
        const dist = Math.abs(pos.z);
        const opacity = Math.max(0.1, Math.min(0.7, 1 - dist / 200));
        
        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fillStyle = particles.colors[i];
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size * 3, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(
          proj.x, proj.y, 0,
          proj.x, proj.y, size * 3
        );
        glow.addColorStop(0, `${particles.colors[i]}`);
        glow.addColorStop(1, 'rgba(107, 0, 215, 0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = opacity * 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      rafId = requestAnimationFrame(animate);
    };
    
    // Start animation
    rafId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasSize]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}

// Main Hero Component
export default function AdvancedHolographicHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,0,215,0.2),transparent_70%)]" />
      
      {/* Digital rain effect */}
      <DigitalRain />
      
      {/* 3D Holographic Animation */}
      <div className="absolute inset-0 z-0">
        <HolographicAnimation />
      </div>
      
      {/* Shimmering overlay */}
      <div className="absolute inset-0 shimmer z-1"></div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-glow">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Chronos</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">Vault</span>
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
      
      {/* Holographic decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-lg"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl"></div>
    </div>
  );
}
