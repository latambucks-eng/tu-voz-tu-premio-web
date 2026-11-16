import React from 'react';
import { cn } from '@/lib/utils';

const SIZES = {
  xs: { box: 'w-7 h-7 rounded-lg', icon: 'w-3.5 h-3.5' },
  sm: { box: 'w-9 h-9 rounded-xl', icon: 'w-4 h-4' },
  md: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6' },
  lg: { box: 'w-16 h-16 rounded-2xl', icon: 'w-8 h-8' },
  xl: { box: 'w-20 h-20 rounded-3xl', icon: 'w-10 h-10' }
};

/**
 * Icono con relieve 3D: pastilla con gradiente, brillo superior,
 * sombra interna inferior y sombra proyectada.
 */
export default function Icon3D({
  icon: Icon,
  gradient = 'from-purple-400 via-purple-500 to-purple-700',
  size = 'md',
  className
}) {
  const current = SIZES[size] || SIZES.md;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center bg-gradient-to-br',
        'shadow-[0_6px_14px_-4px_rgba(15,23,42,0.45),inset_0_-3px_6px_rgba(0,0,0,0.28),inset_0_2px_2px_rgba(255,255,255,0.5)]',
        current.box,
        gradient,
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-[inherit] bg-gradient-to-b from-white/60 to-transparent" />
      {Icon ? (
        <Icon
          className={cn('relative text-white', current.icon)}
          strokeWidth={2.25}
          style={{ filter: 'drop-shadow(0 2px 1.5px rgba(0,0,0,0.45))' }}
        />
      ) : null}
    </div>
  );
}