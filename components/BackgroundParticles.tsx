import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface BackgroundParticlesProps {
  theme: Theme;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      opacitySpeed: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5;
        this.opacitySpeed = (Math.random() - 0.5) * 0.01;
      }

      update(w: number, h: number) {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity += this.opacitySpeed;

        if (this.opacity <= 0.1 || this.opacity >= 0.6) {
          this.opacitySpeed = -this.opacitySpeed;
        }

        if (this.y < 0) {
          this.y = h;
          this.x = Math.random() * w;
        }
        if (this.x < 0 || this.x > w) {
            this.speedX = -this.speedX;
        }
      }

      draw(ctx: CanvasRenderingContext2D, theme: Theme) {
        ctx.fillStyle = theme === 'dark' 
            ? `rgba(255, 255, 255, ${this.opacity})` 
            : `rgba(0, 0, 0, ${this.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx, theme);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default BackgroundParticles;