import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Componente de protección de contenido
 * Implementa múltiples capas de seguridad para dificultar el robo de contenido
 */
export default function ContentProtection({ children, watermarkText = null }) {
  const [user, setUser] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    loadUser();
    setupProtections();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const setupProtections = () => {
    // 1. Detectar DevTools abierto
    detectDevTools();

    // 2. Deshabilitar clic derecho
    document.addEventListener('contextmenu', handleContextMenu);

    // 3. Detectar atajos de teclado comunes para captura
    document.addEventListener('keydown', handleKeyDown);

    // 4. Detectar pérdida de foco (posible screenshot)
    window.addEventListener('blur', handleBlur);

    // 5. Prevenir selección de texto
    document.addEventListener('selectstart', handleSelectStart);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  };

  const detectDevTools = () => {
    const threshold = 160;
    
    const checkDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        console.warn('⚠️ Herramientas de desarrollador detectadas');
        setShowWarning(true);
        
        // Log actividad sospechosa
        if (user) {
          logSuspiciousActivity('devtools_detected', 'Herramientas de desarrollador abiertas');
        }
      }
    };

    setInterval(checkDevTools, 1000);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
    return false;
  };

  const handleKeyDown = (e) => {
    // Detectar atajos comunes de captura/copia
    const forbiddenKeys = [
      // Print Screen
      e.key === 'PrintScreen',
      // Ctrl/Cmd + P (Imprimir)
      (e.ctrlKey || e.metaKey) && e.key === 'p',
      // Ctrl/Cmd + S (Guardar)
      (e.ctrlKey || e.metaKey) && e.key === 's',
      // Ctrl/Cmd + Shift + S (Guardar como)
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's',
      // F12 (DevTools)
      e.key === 'F12',
      // Ctrl+Shift+I (DevTools)
      (e.ctrlKey && e.shiftKey && e.key === 'I'),
      // Ctrl+Shift+J (Console)
      (e.ctrlKey && e.shiftKey && e.key === 'J'),
      // Ctrl+U (Ver código fuente)
      (e.ctrlKey && e.key === 'u')
    ];

    if (forbiddenKeys.some(Boolean)) {
      e.preventDefault();
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      
      if (user) {
        logSuspiciousActivity('suspicious_key', `Tecla sospechosa: ${e.key}`);
      }
      return false;
    }
  };

  const handleBlur = () => {
    // Detectar cuando la ventana pierde el foco (posible captura)
    console.warn('⚠️ Ventana perdió el foco - posible captura de pantalla');
  };

  const handleSelectStart = (e) => {
    // Permitir selección en inputs y textareas
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return true;
    }
    // Prevenir selección en el resto del contenido
    e.preventDefault();
    return false;
  };

  const logSuspiciousActivity = async (type, details) => {
    try {
      await base44.entities.Notification.create({
        user_id: user.id,
        title: '🔒 Actividad de Seguridad',
        message: `Se detectó: ${details}`,
        type: 'profile_incomplete'
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return (
    <div className="relative select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Marca de agua personalizada */}
      {watermarkText && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 200px,
              rgba(0, 0, 0, 0.02) 200px,
              rgba(0, 0, 0, 0.02) 202px
            )`
          }}
        >
          <div className="opacity-5 text-6xl font-bold transform rotate-[-30deg] text-gray-800 whitespace-nowrap">
            {watermarkText}
          </div>
        </div>
      )}

      {/* Overlay de protección invisible */}
      <div className="absolute inset-0 pointer-events-none z-40" 
           style={{ 
             background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.005) 1px, transparent 2px)',
             mixBlendMode: 'overlay'
           }} 
      />

      {/* Marca de agua con datos del usuario (si está logueado) */}
      {user && (
        <div className="fixed bottom-4 right-4 opacity-30 text-xs text-gray-500 pointer-events-none z-50 bg-white/50 px-2 py-1 rounded">
          {user.email} • {new Date().toLocaleString()}
        </div>
      )}

      {/* Contenido protegido */}
      {children}

      <style>{`
        .select-none * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .select-none input,
        .select-none textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        .select-none img,
        .select-none video {
          pointer-events: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      `}</style>
    </div>
  );
}