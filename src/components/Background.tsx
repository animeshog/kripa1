import { useEffect, useRef } from 'react';
import { useAudio } from '@/audio/AudioProvider';

type Props = { className?: string };

type Theme = {
  skyTop: string; skyMid: string; skyBot: string;
  auroraA: string; auroraB: string; auroraC: string;
  particle: string; cloud: string; starAlpha: number;
  fireflies: boolean; butterflies: boolean; rain: boolean;
};

const THEMES: Record<string, Theme> = {
  sunrise: {
    skyTop: '#1a1140', skyMid: '#5b2a6e', skyBot: '#f0a868',
    auroraA: 'rgba(167,139,250,0.30)', auroraB: 'rgba(249,168,212,0.28)', auroraC: 'rgba(252,211,77,0.22)',
    particle: '#fff4e0', cloud: 'rgba(255,236,214,0.55)', starAlpha: 0.5, fireflies: true, butterflies: true, rain: false,
  },
  sunny: {
    skyTop: '#7cc4f5', skyMid: '#a8dcf7', skyBot: '#fdf2e9',
    auroraA: 'rgba(125,211,252,0.22)', auroraB: 'rgba(252,211,77,0.20)', auroraC: 'rgba(249,168,212,0.18)',
    particle: '#fff7ed', cloud: 'rgba(255,255,255,0.7)', starAlpha: 0, fireflies: false, butterflies: true, rain: false,
  },
  rain: {
    skyTop: '#2a3340', skyMid: '#3c4a5a', skyBot: '#5a6b7a',
    auroraA: 'rgba(125,211,252,0.18)', auroraB: 'rgba(167,139,250,0.16)', auroraC: 'rgba(255,255,255,0.10)',
    particle: '#cfe3f2', cloud: 'rgba(60,74,90,0.7)', starAlpha: 0, fireflies: false, butterflies: false, rain: true,
  },
  night: {
    skyTop: '#060a1a', skyMid: '#0c1126', skyBot: '#141a3a',
    auroraA: 'rgba(167,139,250,0.32)', auroraB: 'rgba(125,211,252,0.24)', auroraC: 'rgba(249,168,212,0.18)',
    particle: '#fdf6e3', cloud: 'rgba(20,26,58,0.6)', starAlpha: 1, fireflies: true, butterflies: false, rain: false,
  },
};

export default function Background({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { weather } = useAudio();
  const weatherRef = useRef(weather);
  weatherRef.current = weather;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = 0;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Entities
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    type Star = { x: number; y: number; r: number; tw: number; ph: number };
    let stars: Star[] = [];
    const makeStars = () => {
      const n = Math.min(180, Math.floor(w * h / 9000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h * 0.7,
        r: rand(0.4, 1.8), tw: rand(0.5, 2.5), ph: Math.random() * Math.PI * 2,
      }));
    };
    makeStars();
    window.addEventListener('resize', makeStars);

    type Cloud = { x: number; y: number; s: number; v: number; o: number };
    let clouds: Cloud[] = [];
    const makeClouds = () => {
      const n = 6;
      clouds = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: rand(h * 0.1, h * 0.45), s: rand(0.7, 1.6), v: rand(0.08, 0.22), o: rand(0.3, 0.7),
      }));
    };
    makeClouds();

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: string };
    let particles: Particle[] = [];
    const spawnParticle = () => {
      const th = THEMES[weatherRef.current];
      particles.push({
        x: Math.random() * w, y: h + 10,
        vx: rand(-0.2, 0.2), vy: rand(-0.4, -0.9),
        r: rand(1, 3), life: 0, max: rand(300, 600), hue: th.particle,
      });
    };

    type Firefly = { x: number; y: number; vx: number; vy: number; r: number; ph: number; };
    let fireflies: Firefly[] = [];
    const makeFireflies = () => {
      fireflies = Array.from({ length: 28 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3), r: rand(1.2, 2.6), ph: Math.random() * Math.PI * 2,
      }));
    };
    makeFireflies();

    type Butterfly = { x: number; y: number; vx: number; vy: number; s: number; fl: number; col: string; ph: number };
    let butterflies: Butterfly[] = [];
    const makeButterflies = () => {
      const cols = ['#f9a8d4', '#a78bfa', '#fcd34d', '#7dd3fc', '#fb7185'];
      butterflies = Array.from({ length: 5 }, () => ({
        x: Math.random() * w, y: rand(h * 0.3, h * 0.8),
        vx: rand(0.3, 0.7) * (Math.random() < 0.5 ? -1 : 1), vy: rand(-0.2, 0.2),
        s: rand(0.6, 1.1), fl: rand(0.15, 0.25), col: cols[Math.floor(Math.random() * cols.length)], ph: Math.random() * Math.PI * 2,
      }));
    };
    makeButterflies();

    type Raindrop = { x: number; y: number; l: number; v: number };
    let raindrops: Raindrop[] = [];
    const makeRain = () => {
      raindrops = Array.from({ length: 160 }, () => ({
        x: Math.random() * w, y: Math.random() * h, l: rand(10, 22), v: rand(6, 11),
      }));
    };

    // Aurora blobs (persistent positions)
    type Blob = { x: number; y: number; r: number; ph: number; vx: number; vy: number };
    const blobs: Blob[] = Array.from({ length: 5 }, (_, i) => ({
      x: w * (0.2 + i * 0.18), y: h * rand(0.2, 0.6), r: rand(260, 420), ph: Math.random() * Math.PI * 2,
      vx: rand(-0.15, 0.15), vy: rand(-0.08, 0.08),
    }));

    const lerpColor = (a: string, b: string, t: number) => {
      // hex lerp
      const pa = a.match(/\w\w/g)!.map((x) => parseInt(x, 16));
      const pb = b.match(/\w\w/g)!.map((x) => parseInt(x, 16));
      const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
      const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
      const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
      return `rgb(${r},${g},${bl})`;
    };

    // Smooth theme transition
    let cur: Theme = { ...THEMES[weatherRef.current] };
    const target = () => THEMES[weatherRef.current];
    const blend = (k: number) => {
      const tg = target();
      (Object.keys(cur) as (keyof Theme)[]).forEach((key) => {
        const cv = cur[key] as any; const tv = tg[key] as any;
        if (typeof cv === 'number' && typeof tv === 'number') (cur as any)[key] = cv + (tv - cv) * k;
        else (cur as any)[key] = tv;
      });
    };

    const draw = () => {
      blend(0.04);
      t += 0.016;

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, cur.skyTop);
      grad.addColorStop(0.55, cur.skyMid);
      grad.addColorStop(1, cur.skyBot);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Aurora blobs
      ctx.globalCompositeOperation = 'screen';
      const aurCols = [cur.auroraA, cur.auroraB, cur.auroraC];
      blobs.forEach((b, i) => {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r; if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r; if (b.y > h + b.r) b.y = -b.r;
        const rr = b.r * (1 + 0.06 * Math.sin(t * 0.4 + b.ph));
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rr);
        g.addColorStop(0, aurCols[i % 3]);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, rr, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';

      // Stars
      if (cur.starAlpha > 0.01) {
        stars.forEach((s) => {
          const a = (0.4 + 0.6 * Math.abs(Math.sin(t * s.tw + s.ph))) * cur.starAlpha;
          ctx.globalAlpha = a;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          if (s.r > 1.2) {
            ctx.globalAlpha = a * 0.4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
      }

      // Clouds
      clouds.forEach((c) => {
        c.x += c.v;
        if (c.x - 120 * c.s > w) c.x = -120 * c.s;
        drawCloud(ctx, c.x, c.y, c.s, cur.cloud, c.o);
      });

      // Rain
      if (cur.rain) {
        if (raindrops.length === 0) makeRain();
        ctx.strokeStyle = 'rgba(200,220,240,0.4)';
        ctx.lineWidth = 1.2;
        raindrops.forEach((d) => {
          d.y += d.v; d.x -= d.v * 0.25;
          if (d.y > h) { d.y = -20; d.x = Math.random() * w; }
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.l * 0.25, d.y + d.l);
          ctx.stroke();
        });
      } else if (raindrops.length) {
        raindrops = [];
      }

      // Particles (pollen / dust motes)
      if (particles.length < 40 && Math.random() < 0.3) spawnParticle();
      particles = particles.filter((p) => p.life < p.max);
      particles.forEach((p) => {
        p.life++; p.x += p.vx; p.y += p.vy; p.vy -= 0.0005;
        const a = Math.sin((p.life / p.max) * Math.PI) * 0.6;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Fireflies
      if (cur.fireflies) {
        fireflies.forEach((f) => {
          f.x += f.vx + Math.sin(t * 0.5 + f.ph) * 0.3;
          f.y += f.vy + Math.cos(t * 0.4 + f.ph) * 0.3;
          if (f.x < 0) f.x = w; if (f.x > w) f.x = 0;
          if (f.y < 0) f.y = h; if (f.y > h) f.y = 0;
          const a = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.6 + f.ph));
          ctx.globalAlpha = a;
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
          g.addColorStop(0, 'rgba(255,244,180,0.9)');
          g.addColorStop(0.4, 'rgba(255,220,120,0.4)');
          g.addColorStop(1, 'rgba(255,220,120,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,250,220,0.95)';
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Butterflies
      if (cur.butterflies) {
        butterflies.forEach((b) => {
          b.x += b.vx; b.y += b.vy + Math.sin(t * b.fl * 4 + b.ph) * 0.4;
          if (b.x < -40) b.x = w + 40; if (b.x > w + 40) b.x = -40;
          if (b.y < 60) b.vy += 0.005; if (b.y > h - 60) b.vy -= 0.005;
          drawButterfly(ctx, b.x, b.y, b.s, b.col, t * b.fl * 4 + b.ph);
        });
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', makeStars);
    };
  }, []);

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className ?? ''}`} aria-hidden="true" />;
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, o: number) {
  ctx.save();
  ctx.globalAlpha = o;
  ctx.fillStyle = color;
  ctx.filter = 'blur(6px)';
  const r = 28 * s;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.9, y - r * 0.2, r * 0.85, 0, Math.PI * 2);
  ctx.arc(x + r * 1.8, y, r * 0.9, 0, Math.PI * 2);
  ctx.arc(x + r * 0.5, y + r * 0.3, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawButterfly(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, phase: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const flap = 0.5 + 0.5 * Math.abs(Math.sin(phase));
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  // left wing
  ctx.save();
  ctx.rotate(-0.2);
  ctx.scale(flap, 1);
  ctx.beginPath();
  ctx.ellipse(-8, -4, 7, 9, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-6, 6, 5, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // right wing
  ctx.save();
  ctx.rotate(0.2);
  ctx.scale(flap, 1);
  ctx.beginPath();
  ctx.ellipse(8, -4, 7, 9, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, 6, 5, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // body
  ctx.fillStyle = 'rgba(40,30,50,0.8)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.4, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
