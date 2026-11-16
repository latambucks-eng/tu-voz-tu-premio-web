import React from 'react';
import { cn } from '@/lib/utils';

export const LOGO_URL =
  'https://base44.app/api/apps/68e76567d381fac8e3efacce/files/mp/public/68e76567d381fac8e3efacce/f5383208a_logo-tu-voz-tu-premio.png';

export default function Logo({ className, alt = 'Tu Voz, Tu Premio' }) {
  return (
    <img
      src={LOGO_URL}
      alt={alt}
      className={cn('object-contain rounded-full shrink-0', className)}
    />
  );
}