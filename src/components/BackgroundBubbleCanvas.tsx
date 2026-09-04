import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  type: 'symbol' | 'bubble';
  text?: string;
  opacity: number;
  hue: number;
  rotation: number;
  vRot: number;
}

const MATH_SYMBOLS = ['+', '−', '×', '÷', '=', '7', '9', '3', '8', 'π', '4', '12', '√', '2'];

export const BackgroundBubbleCanvas: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles
    const particleCount = reducedMotion ? 12 : 32;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isSymbol = Math.random() > 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSymbol ? Math.random() * 16 + 18 : Math.random() * 32 + 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.3),
        type: isSymbol ? 'symbol' : 'bubble',
        text: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
        opacity: Math.random() * 0.25 + 0.12,
        hue: Math.floor(Math.random() * 360),
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep vibrant oceanic background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090d1f');
      bgGrad.addColorStop(0.5, '#0d1b38');
      bgGrad.addColorStop(1, '#060a17');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient light glows in corners
      const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.25, 10, width * 0.2, height * 0.25, width * 0.5);
      glow1.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.75, 10, width * 0.8, height * 0.75, width * 0.5);
      glow2.addColorStop(0, 'rgba(168, 85, 247, 0.07)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // Draw each particle
      particles.forEach((p) => {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;

          // Wrap edges
          if (p.y + p.size < 0) {
            p.y = height + p.size;
            p.x = Math.random() * width;
          }
          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'symbol' && p.text) {
          ctx.font = `600 ${p.size}px 'Fredoka', cursive, sans-serif`;
          ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, 0, 0);
        } else {
          // Ambient bubble
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          
          const bubbleGrad = ctx.createRadialGradient(-p.size * 0.3, -p.size * 0.3, p.size * 0.1, 0, 0, p.size);
          bubbleGrad.addColorStop(0, `hsla(${p.hue}, 90%, 85%, ${p.opacity * 1.5})`);
          bubbleGrad.addColorStop(0.6, `hsla(${p.hue}, 80%, 65%, ${p.opacity * 0.5})`);
          bubbleGrad.addColorStop(1, `hsla(${p.hue}, 90%, 60%, ${p.opacity * 0.8})`);
          
          ctx.fillStyle = bubbleGrad;
          ctx.fill();

          // Bubble rim highlight
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 1.2})`;
          ctx.stroke();

          // Specular glint
          ctx.beginPath();
          ctx.ellipse(-p.size * 0.35, -p.size * 0.35, p.size * 0.25, p.size * 0.14, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 1.8})`;
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
