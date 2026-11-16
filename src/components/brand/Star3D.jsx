import React from 'react';
import { cn } from '@/lib/utils';

const STAR_PATH =
  'M12 2.2l2.9 6.05 6.6.9-4.8 4.62 1.18 6.55L12 17.2l-5.88 3.12L7.3 13.77 2.5 9.15l6.6-.9L12 2.2z';

const GOLD = 'star3d-gold';
const SHINE = 'star3d-shine';

/**
 * Estrella con volumen 3D: oro con degradado, brillo superior,
 * borde biselado y sombra proyectada.
 */
export default function Star3D({ size = 16, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('inline-block flex-shrink-0 align-middle', className)}
      style={{ filter: 'drop-shadow(0 2px 2px rgba(146,64,14,0.45))' }}
    >
      <defs>
        <linearGradient id={GOLD} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF7C7" />
          <stop offset="30%" stopColor="#FFD54A" />
          <stop offset="72%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={SHINE} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={STAR_PATH}
        fill={`url(#${GOLD})`}
        stroke="#A16207"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d={STAR_PATH} fill={`url(#${SHINE})`} />
    </svg>
  );
}