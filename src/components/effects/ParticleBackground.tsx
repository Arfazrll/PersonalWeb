import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  glow: number;
}

interface ConnectionLine {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  opacity: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseMovingTimeout: NodeJS.Timeout;
    let connectionLines: ConnectionLine[] = [];
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate particles when resizing
      initParticles();
    };
    
    // Initialize particles
    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.min(Math.floor(window.innerWidth * window.innerHeight / 10000), 120);
      
      // Determine primary color based on theme
      const isDark = resolvedTheme === 'dark';
      const primaryColorBase = theme === 'purple' 
        ? isDark ? '168, 85, 247' : '168, 85, 247'
        : theme === 'blue'
          ? isDark ? '59, 130, 246' : '59, 130, 246'
          : isDark ? '99, 102, 241' : '99, 102, 241';
        
      const secondaryColorBase = theme === 'purple'
        ? isDark ? '244, 114, 182' : '244, 114, 182'
        : theme === 'blue'
          ? isDark ? '245, 158, 11' : '245, 158, 11'
          : isDark ? '16, 185, 129' : '16, 185, 129';
      
      for (let i = 0; i < numberOfParticles; i++) {
        // Randomly choose between primary and accent colors
        const colorBase = Math.random() > 0.7 ? secondaryColorBase : primaryColorBase;
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color: `rgba(${colorBase}, ${Math.random() * 0.3 + 0.1})`,
          glow: Math.random() > 0.8 ? 3 + Math.random() * 5 : 0, // Some particles glow
        });
      }
    };
    
    // Update particle positions
    const updateParticles = () => {
      connectionLines = []; // Reset connection lines
      
      for (const particle of particles) {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Handle bounds with a bounce effect
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX * 0.9; // Slow down a bit on bounce
          particle.x = particle.x < 0 ? 0 : canvas.width;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY * 0.9; // Slow down a bit on bounce
          particle.y = particle.y < 0 ? 0 : canvas.height;
        }
        
        // Slight gravitational pull to the center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 200) {
          particle.speedX += (dx / distance) * 0.0003;
          particle.speedY += (dy / distance) * 0.0003;
        }
        
        // Add slight random movement
        if (Math.random() > 0.98) {
          particle.speedX += (Math.random() - 0.5) * 0.01;
          particle.speedY += (Math.random() - 0.5) * 0.01;
        }
        
        // Maximum speed limit
        const maxSpeed = 0.5;
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > maxSpeed) {
          particle.speedX = (particle.speedX / speed) * maxSpeed;
          particle.speedY = (particle.speedY / speed) * maxSpeed;
        }
        
        // Add mouse influence
        if (isMouseMoving) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;
          
          if (distance < maxDistance) {
            const influence = (maxDistance - distance) / maxDistance * 0.05;
            particle.speedX += (dx / distance) * influence;
            particle.speedY += (dy / distance) * influence;
            
            // Limit speed after mouse influence
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > 1) {
              particle.speedX = (particle.speedX / speed) * 1;
              particle.speedY = (particle.speedY / speed) * 1;
            }
          }
        }
      }
      
      // Create connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            // Choose color based on both particles
            const [r1, g1, b1] = particles[i].color.match(/\d+/g)?.map(Number) || [99, 102, 241];
            const [r2, g2, b2] = particles[j].color.match(/\d+/g)?.map(Number) || [99, 102, 241];
            const r = Math.floor((r1 + r2) / 2);
            const g = Math.floor((g1 + g2) / 2);
            const b = Math.floor((b1 + b2) / 2);
            const opacity = (maxDistance - distance) / maxDistance * 0.2;
            
            connectionLines.push({
              fromX: particles[i].x,
              fromY: particles[i].y,
              toX: particles[j].x,
              toY: particles[j].y,
              opacity,
              color: `rgba(${r}, ${g}, ${b}, ${opacity})`
            });
          }
        }
      }
    };
    
    // Draw particles on canvas
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // First draw connection lines for better layering
      for (const line of connectionLines) {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(line.fromX, line.fromY);
        ctx.lineTo(line.toX, line.toY);
        ctx.stroke();
      }
      
      // Then draw particles
      for (const particle of particles) {
        // Draw glow effect for some particles
        if (particle.glow > 0) {
          const glowColor = particle.color.replace(/[\d.]+\)$/g, `${particle.opacity * 0.5})`);
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = particle.glow;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow for efficiency
        ctx.shadowBlur = 0;
      }
    };
    
    // Animation loop
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      clearTimeout(mouseMovingTimeout);
      mouseMovingTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 200);
    };
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initialize
    handleResize();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, resolvedTheme]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

export default ParticleBackground;