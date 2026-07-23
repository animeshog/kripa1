import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAudio } from '@/audio/AudioProvider';

/** A glowing, softly bouncing button with ripple + chime on click. */
export function GlowButton({
  children, onClick, className = '', glow = 'soft', bounce = true, ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  glow?: 'soft' | 'warm' | 'none';
  bounce?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const { playPop, playChime } = useAudio();

  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current!;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple-circle';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    playPop();
    playChime();
    onClick?.();
  };

  const glowClass = glow === 'warm' ? 'glow-warm' : glow === 'soft' ? 'glow-soft' : '';

  return (
    <motion.button
      ref={ref}
      onClick={handle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-full px-8 py-4 font-sans font-semibold text-white/95 glass-strong ripple ${glowClass} ${bounce ? 'soft-bounce' : ''} ${className}`}
      style={{ animationDelay: bounce ? '0.6s' : undefined }}
      {...(rest as any)}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}

/** Section wrapper that fades children in when scrolled into view. */
export function SceneShell({
  children, className = '', id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/** Staggered text reveal for poetic lines. */
export function RevealText({
  lines, className = '', lineClassName = '', delay = 0, stagger = 0.9,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.1, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          className={lineClassName}
        >
          {l}
        </motion.div>
      ))}
    </div>
  );
}
