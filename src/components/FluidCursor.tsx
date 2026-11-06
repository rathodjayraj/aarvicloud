import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  life: number;
  decay: number;
  color: string;
}

const FluidCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const glowRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let initialized = false;

    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      
      if (!initialized) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;
        glowRef.current.x = e.clientX;
        glowRef.current.y = e.clientY;
        initialized = true;
        return;
      }

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Spawn particles based on speed
      if (speed > 1) {
        const numParticles = Math.min(Math.floor(speed * 0.15) + 1, 5);
        
        for (let i = 0; i < numParticles; i++) {
          const ratio = i / numParticles;
          const x = mouse.lastX + dx * ratio;
          const y = mouse.lastY + dy * ratio;

          // Pick dynamic colors matching AarviCloud branding
          const rand = Math.random();
          let rgbColor = '59, 130, 246'; // Primary blue
          if (rand > 0.66) {
            rgbColor = '139, 92, 246'; // Accent purple
          } else if (rand > 0.33) {
            rgbColor = '236, 72, 153'; // Pink highlight
          }

          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            vx: -dx * 0.1 + (Math.random() - 0.5) * 1.5,
            vy: -dy * 0.1 + (Math.random() - 0.5) * 1.5,
            size: Math.random() * 4 + 4, // Smaller, subtle particle sizes (4px - 8px)
            initialSize: Math.random() * 4 + 4,
            life: 1.0,
            decay: Math.random() * 0.015 + 0.012, // Slow decay for a silky smooth trail
            color: rgbColor
          });
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Beautiful burst of particles on click
      const burstCount = 16;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 4 + 2;
        
        const rand = Math.random();
        let rgbColor = '59, 130, 246'; // Primary blue
        if (rand > 0.66) {
          rgbColor = '139, 92, 246'; // Accent purple
        } else if (rand > 0.33) {
          rgbColor = '236, 72, 153'; // Pink highlight
        }

        particlesRef.current.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 5 + 3,
          initialSize: Math.random() * 5 + 3,
          life: 1.0,
          decay: Math.random() * 0.025 + 0.02, // Quick burst decay
          color: rgbColor
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      
      // 1. Draw subtle cursor glow aura (spotlight)
      const mouse = mouseRef.current;
      if (initialized) {
        glowRef.current.x += (mouse.x - glowRef.current.x) * 0.1;
        glowRef.current.y += (mouse.y - glowRef.current.y) * 0.1;

        const glowGrad = ctx.createRadialGradient(
          glowRef.current.x,
          glowRef.current.y,
          0,
          glowRef.current.x,
          glowRef.current.y,
          90
        );
        
        const glowOpacity = isDarkMode ? 0.12 : 0.05;
        glowGrad.addColorStop(0, `rgba(59, 130, 246, ${glowOpacity})`);
        glowGrad.addColorStop(0.5, `rgba(139, 92, 246, ${glowOpacity * 0.4})`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalCompositeOperation = isDarkMode ? 'screen' : 'source-over';
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(glowRef.current.x, glowRef.current.y, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw particle trail
      ctx.globalCompositeOperation = isDarkMode ? 'screen' : 'source-over';
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;

        // Friction
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Fade out
        p.life -= p.decay;

        const currentSize = p.initialSize * p.life;

        if (p.life <= 0 || currentSize <= 0.1) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle as soft radial gradient glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
        // On dark mode we use lighter blending, on light mode we boost base opacity for contrast
        const opacityMultiplier = isDarkMode ? 0.8 : 1.1;
        const particleOpacity = Math.min(p.life * opacityMultiplier, 1.0);

        grad.addColorStop(0, `rgba(${p.color}, ${particleOpacity})`);
        grad.addColorStop(0.4, `rgba(${p.color}, ${particleOpacity * 0.4})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default FluidCursor;
