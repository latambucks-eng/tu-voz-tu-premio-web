import { createPageUrl } from '@/utils';

// Devuelve una ruta interna segura para volver después de iniciar sesión
export function resolveReturnTo(defaultPage = 'Home') {
  const raw = new URLSearchParams(window.location.search).get('from_url');
  const fallback = createPageUrl(defaultPage);

  if (!raw) return fallback;

  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    if (url.pathname === '/login' || url.pathname === '/register') return fallback;
    return `${url.pathname}${url.search}`;
  } catch (e) {
    return fallback;
  }
}

export const authErrorText = (error, fallback) => {
  const message = error?.data?.message || error?.response?.data?.message || error?.message || '';
  if (/verify/i.test(message)) {
    return 'Tu cuenta todavía no está verificada. Revisá el código que te enviamos por correo.';
  }
  if (error?.status === 401 || /invalid|incorrect/i.test(message)) {
    return 'Correo o contraseña incorrectos.';
  }
  return fallback;
};