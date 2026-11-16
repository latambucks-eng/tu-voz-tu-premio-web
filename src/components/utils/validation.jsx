/**
 * Utilidades de validación para formularios y datos
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateYouTubeUrl = (url) => {
  if (!url) return { valid: false, error: 'URL vacía' };
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { valid: true, videoId: match[1] };
    }
  }

  return { valid: false, error: 'URL de YouTube inválida' };
};

export const validatePhoneNumber = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 8;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .substring(0, 1000);
};

export const validateFileSize = (file, maxSizeMB = 100) => {
  if (!file) return { valid: false, error: 'No se seleccionó archivo' };
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `El archivo excede ${maxSizeMB}MB` };
  }
  
  return { valid: true };
};

export const validateVideoFile = (file) => {
  if (!file) return { valid: false, error: 'No se seleccionó archivo' };
  
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no válido. Use MP4, WebM o MOV' };
  }
  
  return validateFileSize(file, 100);
};

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No se seleccionó archivo' };
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no válido. Use JPG, PNG o WebP' };
  }
  
  return validateFileSize(file, 5);
};

export const validateText = (text, minLength = 1, maxLength = 1000) => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Texto inválido' };
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `Mínimo ${minLength} caracteres` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Máximo ${maxLength} caracteres` };
  }
  
  return { valid: true };
};

export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return sanitizeInput(text);
};