import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  alpha: number;
  decay: number;
}

export default function BackgroundAmbient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      "rgba(226, 125, 128, ", // blush
      "rgba(207, 161, 74, ",  // gold
      "rgba(139, 0, 0, ",     // ruby red
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial particles
    const maxParticles = 40;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const size = Math.random() * 2.5 + 0.5;
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * (canvas?.width || window.innerWidth),
        y: randomY
          ? Math.random() * (canvas?.height || window.innerHeight)
          : (canvas?.height || window.innerHeight) + 20,
        size,
        color: colorTemplate,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.1,
        // Cycle rate to fade in and out gently
        decay: Math.random() * 0.002 + 0.001,
      };
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Gentle drift back and forth
        p.speedX += (Math.random() - 0.5) * 0.01;
        p.speedX = Math.max(-0.25, Math.min(0.25, p.speedX));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha.toFixed(2) + ")";
        ctx.fill();

        // If offscreen or alpha is fully decayed, recycle
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0b0b0f]">
      {/* Dynamic ambient color nodes (large blur spots that float slowly) */}
      <div className="absolute top-[15%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-romantic-darkred/20 ambient-glow floating-bg-glow opacity-30" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-romantic-rose/15 ambient-glow floating-bg-glow opacity-30 [animation-delay:4s]" />
      <div className="absolute top-[60%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-romantic-gold/5 ambient-glow floating-bg-glow opacity-25 [animation-delay:8s]" />

      {/* Floating particles layer */}
      <canvas
        id="ambient-canvas"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
      />
    </div>
  );
}
