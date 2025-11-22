

import React, { useRef, useEffect } from 'react';
import { ThemeType, AnimationSpeed } from '../types';

interface AmbientBackgroundProps {
  theme: ThemeType;
  enabled: boolean;
  speed: AnimationSpeed;
}

class Particle {
  x: number;
  y: number;
  baseSpeedX: number;
  baseSpeedY: number;
  size: number;
  opacity: number;
  opacitySpeed: number;
  type: ThemeType;

  constructor(canvasWidth: number, canvasHeight: number, type: ThemeType) {
    this.type = type;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    
    // Initialize properties based on theme
    switch (type) {
      case ThemeType.SNOW:
        this.baseSpeedX = Math.random() * 0.2 - 0.1; 
        this.baseSpeedY = Math.random() * 0.5 + 0.2;    
        this.size = Math.random() * 3 + 2;
        break;
      case ThemeType.FOREST: // Fireflies
        this.baseSpeedX = Math.random() * 0.3 - 0.15;
        this.baseSpeedY = Math.random() * 0.3 - 0.15;
        this.size = Math.random() * 2 + 1;
        break;
      case ThemeType.WATER: // Slow bubbles
        this.baseSpeedX = Math.random() * 0.2 - 0.1;
        this.baseSpeedY = -(Math.random() * 0.3 + 0.1); 
        this.size = Math.random() * 5 + 1;
        break;
      case ThemeType.MOUNTAINS: // Rising thin air/dust
        this.baseSpeedX = (Math.random() - 0.5) * 0.2; // Slight horizontal wobble
        this.baseSpeedY = -(Math.random() * 0.4 + 0.1); // Moves upwards
        this.size = Math.random() * 2 + 1; // Small subtle particles
        break;
      default:
        this.baseSpeedX = 0;
        this.baseSpeedY = 0;
        this.size = 0;
    }
    this.opacity = Math.random() * 0.4 + 0.1;
    this.opacitySpeed = Math.random() * 0.005 + 0.002;
  }

  update(width: number, height: number, speedMultiplier: number) {
    this.x += this.baseSpeedX * speedMultiplier;
    this.y += this.baseSpeedY * speedMultiplier;

    // Pulse opacity for "alive" feel (especially for fireflies/stars)
    this.opacity += this.opacitySpeed * speedMultiplier;
    if (this.opacity > 0.6 || this.opacity < 0.1) {
      this.opacitySpeed = -this.opacitySpeed;
    }

    const buffer = this.size * 2;

    if (this.type === ThemeType.WATER || this.type === ThemeType.MOUNTAINS) {
      if (this.y < -buffer) {
        this.y = height + buffer;
        this.x = Math.random() * width;
      }
    } else if (this.type === ThemeType.SNOW) {
      if (this.y > height + buffer) {
        this.y = -buffer;
        this.x = Math.random() * width;
      }
    } else {
       if (this.x > width + buffer) this.x = -buffer;
       if (this.x < -buffer) this.x = width + buffer;
       if (this.y > height + buffer) this.y = -buffer;
       if (this.y < -buffer) this.y = height + buffer;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ theme, enabled, speed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    
    const initParticles = () => {
      particles = [];
      // Increase density for mountain dust as they are small
      const particleCount = theme === ThemeType.MOUNTAINS ? 80 : 120;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height, theme));
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const getSpeedMultiplier = (s: AnimationSpeed) => {
      switch(s) {
        case 'zen': return 0.4;
        case 'slow': return 0.8;
        case 'normal': return 1.4;
        default: return 1.0;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const speedMult = getSpeedMultiplier(speed);
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height, speedMult);
        p.draw(ctx);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme, enabled, speed]);

  if (!enabled) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};

export default AmbientBackground;