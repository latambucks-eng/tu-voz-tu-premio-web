import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

export function getDashboardPage(user) {
  if (!user) return 'SelectRole';
  if (user.role === 'admin') return 'AdminDashboard';
  if (user.user_type === 'artist') return 'ArtistDashboard';
  if (user.user_type === 'fan') return 'FanDashboard';
  return 'SelectRole';
}

// Abre el login / registro de la plataforma y vuelve a la selección de rol
export function goToLogin() {
  base44.auth.redirectToLogin(window.location.origin + createPageUrl('SelectRole'));
}