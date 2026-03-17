import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
}

export type EmitType = 'confetti' | 'sparkle' | 'embers';

interface ParticleAPI {
  emit: (type: EmitType, x: number, y: number) => void;
}

const ParticleContext = createContext<ParticleAPI | null>(null);

export function useParticles(): ParticleAPI {
  const ctx = useContext(ParticleContext);
  if (!ctx) throw new Error('useParticles must be used inside ParticleProvider');
  return ctx;
}

const CONFETTI_COLORS = ['#3B82F6', '#22C55E', '#EAB308', '#EF4444', '#e94560'];
const SPARKLE_COLORS = ['#EAB308', '#FDE047', '#FBBF24'];
const EMBER_COLORS = ['#EF4444', '#F97316', '#EAB308'];

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createParticles(type: EmitType, x: number, y: number): Particle[] {
  if (type === 'confetti') {
    return Array.from({ length: 80 }, () => {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(2, 8);
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 2500,
        maxLife: 2500,
        size: rand(5, 10),
        color: randItem(CONFETTI_COLORS),
        gravity: 0.15,
        rotation: rand(0, Math.PI * 2),
        rotationSpeed: rand(-0.2, 0.2),
      };
    });
  }

  if (type === 'sparkle') {
    return Array.from({ length: 15 }, () => {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1, 4);
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 500,
        maxLife: 500,
        size: rand(2, 5),
        color: randItem(SPARKLE_COLORS),
        gravity: 0,
        rotation: 0,
        rotationSpeed: 0,
      };
    });
  }

  // embers
  return Array.from({ length: 30 }, () => {
    const angle = rand(-Math.PI, 0); // upward hemisphere
    const speed = rand(1, 4);
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1000,
      maxLife: 1000,
      size: rand(2, 6),
      color: randItem(EMBER_COLORS),
      gravity: -0.05,
      rotation: 0,
      rotationSpeed: 0,
    };
  });
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const addParticles = useCallback((newParticles: Particle[]) => {
    particlesRef.current.push(...newParticles);
    if (rafRef.current === null) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Store addParticles in a ref so the loop closure doesn't go stale
  const addParticlesRef = useRef(addParticles);
  addParticlesRef.current = addParticles;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Expose addParticles via a custom event so ParticleProvider can call it
  useEffect(() => {
    const handler = (e: Event) => {
      const { newParticles } = (e as CustomEvent<{ newParticles: Particle[] }>).detail;
      addParticlesRef.current(newParticles);
    };
    window.addEventListener('__piksi_emit_particles__', handler);
    return () => window.removeEventListener('__piksi_emit_particles__', handler);
  }, []);

  function loop(now: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= delta;
      p.rotation += p.rotationSpeed;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.rotationSpeed !== 0) {
        // Rotated rectangle for confetti
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else {
        // Circle for sparkle/embers
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;

    if (particles.length > 0) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      rafRef.current = null;
    }
  }

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
        zIndex: 60,
      }}
    />
  );
}

export function ParticleProvider({ children }: { children: React.ReactNode }) {
  const emit = useCallback((type: EmitType, x: number, y: number) => {
    const newParticles = createParticles(type, x, y);
    window.dispatchEvent(
      new CustomEvent('__piksi_emit_particles__', { detail: { newParticles } })
    );
  }, []);

  return (
    <ParticleContext.Provider value={{ emit }}>
      {children}
      <ParticleCanvas />
    </ParticleContext.Provider>
  );
}
