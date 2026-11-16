import React from 'react';
import { cn } from '@/lib/utils';

const COUNTRY_CODES = {
  argentina: 'ar',
  bolivia: 'bo',
  brasil: 'br',
  brazil: 'br',
  chile: 'cl',
  colombia: 'co',
  'costa rica': 'cr',
  cuba: 'cu',
  ecuador: 'ec',
  'el salvador': 'sv',
  espana: 'es',
  spain: 'es',
  guatemala: 'gt',
  honduras: 'hn',
  mexico: 'mx',
  nicaragua: 'ni',
  panama: 'pa',
  paraguay: 'py',
  peru: 'pe',
  'puerto rico': 'pr',
  'republica dominicana': 'do',
  'dominican republic': 'do',
  uruguay: 'uy',
  venezuela: 've',
  'estados unidos': 'us',
  eeuu: 'us',
  usa: 'us',
  canada: 'ca',
  italia: 'it',
  france: 'fr',
  francia: 'fr',
  portugal: 'pt',
};

const normalize = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const countryToCode = (value) => {
  if (!value) return null;
  const clean = normalize(value);
  if (clean.length === 2) return clean;
  return COUNTRY_CODES[clean] || null;
};

const SIZES = {
  xs: 'w-6 h-4 rounded-[4px]',
  sm: 'w-7 h-5 rounded-[5px]',
  md: 'w-10 h-7 rounded-md',
};

/**
 * Bandera con volumen 3D: marco claro, brillo superior, sombra interna
 * inferior y sombra proyectada.
 */
export default function CountryFlag3D({ country, code, size = 'sm', className }) {
  const iso = countryToCode(code || country);
  if (!iso) return null;

  return (
    <span
      className={cn(
        'relative inline-block flex-shrink-0 overflow-hidden ring-1 ring-black/10',
        'shadow-[0_3px_6px_-1px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_4px_rgba(0,0,0,0.22)]',
        SIZES[size] || SIZES.sm,
        className
      )}
    >
      <img
        src={`https://flagcdn.com/w80/${iso}.png`}
        alt={country || iso}
        loading="lazy"
        className="absolute inset-0 h-full w-full scale-110 object-cover"
      />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/55 via-white/15 to-transparent" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-2px_5px_rgba(0,0,0,0.22)]" />
    </span>
  );
}