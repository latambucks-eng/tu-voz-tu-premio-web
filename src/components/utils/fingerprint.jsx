/**
 * Sistema de Fingerprinting para anti-fraude
 * Genera una huella digital única del dispositivo/navegador
 * SIMPLIFICADO y ROBUSTO para todos los navegadores
 */

export const getDeviceFingerprint = () => {
  try {
    try {
      const saved = localStorage.getItem('tvtp_device_id');
      if (saved) return saved;
    } catch {}

    const fp = simpleHash(
      (navigator.userAgent || 'u') + '|' +
      (navigator.language || 'l') + '|' +
      screen.width + 'x' + screen.height + '|' +
      new Date().getTimezoneOffset()
    );
    
    try {
      localStorage.setItem('tvtp_device_id', fp);
    } catch {}
    
    return fp;
  } catch {
    return 'fp_' + Math.random().toString(36).substring(2, 15);
  }
};

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'fp_' + Math.abs(hash).toString(36) + '_' + str.length.toString(36);
}