/**
 * Sistema de monitoreo de actividad para prevenir abuso
 */

const activityLog = {};

const RATE_LIMITS = {
  vote: { maxActions: 5, windowMs: 60000 }, // 5 votos por minuto
  reveal_payment_link: { maxActions: 3, windowMs: 300000 }, // 3 revelaciones por 5 minutos
  submit_payment_proof: { maxActions: 5, windowMs: 300000 }, // 5 envíos por 5 minutos
  submit_participation: { maxActions: 3, windowMs: 600000 }, // 3 participaciones por 10 minutos
  create_ticket: { maxActions: 5, windowMs: 300000 }, // 5 tickets por 5 minutos
};

const cleanOldEntries = (userId, actionType) => {
  const config = RATE_LIMITS[actionType];
  if (!config) return;

  const key = `${userId}_${actionType}`;
  const now = Date.now();
  
  if (activityLog[key]) {
    activityLog[key] = activityLog[key].filter(
      timestamp => now - timestamp < config.windowMs
    );
  }
};

const trackUserAction = (userId, actionType) => {
  const config = RATE_LIMITS[actionType];
  if (!config) return true; // Si no hay límite configurado, permitir

  const key = `${userId}_${actionType}`;
  const now = Date.now();

  // Limpiar entradas antiguas
  cleanOldEntries(userId, actionType);

  // Inicializar si no existe
  if (!activityLog[key]) {
    activityLog[key] = [];
  }

  // Verificar si excede el límite
  if (activityLog[key].length >= config.maxActions) {
    console.warn(`⚠️ Rate limit exceeded for user ${userId} on action ${actionType}`);
    return false;
  }

  // Registrar la acción
  activityLog[key].push(now);
  return true;
};

const getRemainingActions = (userId, actionType) => {
  const config = RATE_LIMITS[actionType];
  if (!config) return null;

  cleanOldEntries(userId, actionType);

  const key = `${userId}_${actionType}`;
  const current = activityLog[key] ? activityLog[key].length : 0;
  
  return {
    remaining: Math.max(0, config.maxActions - current),
    max: config.maxActions,
    resetIn: config.windowMs
  };
};

export default {
  trackUserAction,
  getRemainingActions
};