import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lastSparkle = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const trail: { x: number; y: number; el: HTMLDivElement; t: number }[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      const now = performance.now();
      if (now - lastSparkle.current > 90 && Math.random() < 0.6) {
        lastSparkle.current = now;
        const el = document.createElement('div');
        el.className = 'cursor-sparkle';
        el.style.left = mx + 'px';
        el.style.top = my + 'px';
        const hue = ['#fcd34d', '#f9a8d4', '#a78bfa', '#7dd3fc'][Math.floor(Math.random() * 4)];
        el.style.background = hue;
        el.style.boxShadow = `0 0 8px ${hue}`;
        document.body.appendChild(el);
        trail.push({ x: mx, y: my, el, t: now });
        if (trail.length > 30) {
          const old = trail.shift();
          old?.el.remove();
        }
      }
    };

    const onDown = () => { if (dotRef.current) dotRef.current.style.opacity = '0.5'; };
    const onUp = () => { if (dotRef.current) dotRef.current.style.opacity = '1'; };

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      const now = performance.now();
      for (let i = trail.length - 1; i >= 0; i--) {
        const tp = trail[i];
        const age = (now - tp.t) / 700;
        if (age >= 1) { tp.el.remove(); trail.splice(i, 1); }
        else {
          tp.el.style.opacity = String(1 - age);
          tp.el.style.transform = `translate(-50%, -50%) scale(${1 - age})`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      trail.forEach((t) => t.el.remove());
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ width: 34, height: 34, marginLeft: -17, marginTop: -17 }}
      >
        <div className="absolute inset-0 rounded-full border border-white/50 backdrop-blur-sm" style={{ boxShadow: '0 0 18px rgba(249,168,212,0.35)' }} />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
      >
        <div className="absolute inset-0 rounded-full bg-white" style={{ boxShadow: '0 0 10px rgba(255,255,255,0.9)' }} />
      </div>
    </>
  );
}
