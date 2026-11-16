import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Trophy, Music, Star, Gift, Check, Upload, Share2, DollarSign } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function WelcomeTour({ user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkIfShouldShow();
  }, [user]);

  const checkIfShouldShow = async () => {
    if (!user) return;

    // Verificar si ya completó el tour (con protección contra storage bloqueado)
    try {
      const hasCompletedTour = localStorage.getItem(`tour_completed_${user.id}`);
      if (!hasCompletedTour) {
        setIsVisible(true);
      }
    } catch (storageError) {
      console.warn('⚠️ Storage bloqueado, mostrando tour por defecto:', storageError);
      // Si storage está bloqueado, mostrar el tour de todas formas
      setIsVisible(true);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem(`tour_completed_${user.id}`, 'true');
    } catch (storageError) {
      console.warn('⚠️ No se pudo guardar estado del tour (storage bloqueado):', storageError);
      // Continuar de todas formas
    }
    
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const artistSteps = [
    {
      icon: Trophy,
      title: '¡Bienvenido Artista a TuVozTuPremio!',
      description: 'Plataforma de engagement musical donde puedes participar en convocatorias de canto, cobrar el premio en USD de cada sala y recibir Estrellas ⭐ de tus fans. Sigue estos pasos.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Music,
      title: 'Paso 1: Completa tu Perfil',
      description: 'Antes de participar, completa tu perfil artístico con foto, biografía, país, teléfono y redes sociales (Instagram, Facebook, TikTok). Esto es OBLIGATORIO.',
      color: 'from-blue-500 to-cyan-500',
      action: { text: 'Ir a Editar Perfil', link: createPageUrl('EditProfile') }
    },
    {
      icon: Upload,
      title: 'Paso 2: Participa en Convocatorias',
      description: 'Elige una convocatoria de tu género favorito (Pop, Rock, Urbano, Balada), sube tu video desde YouTube o tu dispositivo y paga la inscripción de 10 USD con el link de Passline.',
      color: 'from-orange-500 to-red-500',
      action: { text: 'Ver Convocatorias', link: createPageUrl('Contests') }
    },
    {
      icon: Share2,
      title: 'Paso 3: Comparte tu Participación',
      description: 'Comparte tu perfil en TODAS tus redes sociales (Facebook, Instagram, TikTok, WhatsApp) para recibir votos. Los fans pueden votarte y enviarte regalos.',
      color: 'from-pink-500 to-purple-500',
      action: { text: 'Ir a Mi Panel', link: createPageUrl('ArtistDashboard') }
    },
    {
      icon: Star,
      title: 'Paso 4: Gana el premio en USD',
      description: 'El artista más votado gana el premio fijo completo de esa sala, que paga la plataforma. Ejemplo: premio de 400 USD → el ganador recibe 400 USD. Además, tus fans pueden enviarte regalos comprados con créditos y esos regalos te acreditan Estrellas ⭐ (1 Estrella = 1 USD).',
      color: 'from-yellow-500 to-orange-500',
      action: { text: 'Ver Sala de Votación', link: createPageUrl('VotingRoom') }
    },
    {
      icon: DollarSign,
      title: 'Paso 5: Canjea tu saldo',
      description: 'El premio del concurso lo abona la organización directamente a tu PayPal o Binance dentro de los 10 días hábiles del cierre. Las Estrellas ⭐ de regalos, en cambio, se acreditan a tu saldo canjeable en USD y las cobrás con el proceso de canje. 1 Estrella = 1 USD. ¡Es real!',
      color: 'from-green-500 to-teal-500',
      action: { text: 'Ver Panel de Canjes', link: createPageUrl('Withdraw') }
    },
    {
      icon: Trophy,
      title: '¡Listo para Empezar!',
      description: 'Ya sabes todo. Completa tu perfil, paga tu inscripción por Passline, participa y comparte. ¡Mucha suerte!',
      color: 'from-purple-500 to-pink-500',
      action: { text: 'Empezar Ahora', link: createPageUrl('EditProfile') }
    }
  ];

  const fanSteps = [
    {
      icon: Gift,
      title: '¡Bienvenido Fan a TuVozTuPremio!',
      description: 'Como fan, puedes votar por tus artistas favoritos y compartir sus perfiles. ¡NO necesitas pagar nada! Si quieres apoyar más, puedes comprar créditos y enviarle un regalo al artista.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Star,
      title: 'Paso 1: Vota Gratis',
      description: 'Puedes votar por tus artistas favoritos SIN registrarte. Solo 1 voto por artista. Es 100% GRATIS y ayudas a artistas emergentes.',
      color: 'from-blue-500 to-cyan-500',
      action: { text: 'Ver Convocatorias', link: createPageUrl('Contests') }
    },
    {
      icon: Share2,
      title: 'Paso 2: Comparte Perfiles',
      description: 'Genera tu enlace único y comparte perfiles de artistas en redes sociales. ¡Ayudas a artistas a recibir más votos!',
      color: 'from-green-500 to-emerald-500',
      action: { text: 'Mi Panel Fan', link: createPageUrl('FanDashboard') }
    },
    {
      icon: Gift,
      title: 'Paso 3: Apoya con Regalos',
      description: 'Si quieres apoyar más a un artista, compra créditos y envíale un regalo. El artista recibe las Estrellas ⭐ de ese regalo (1 Estrella = 1 USD canjeable).',
      color: 'from-yellow-500 to-orange-500',
      action: { text: 'Comprar Créditos', link: createPageUrl('BuyCredits') }
    },
    {
      icon: Trophy,
      title: '¡Empieza Ahora!',
      description: 'Descubre artistas talentosos, vota por tus favoritos y comparte sus perfiles.',
      color: 'from-purple-500 to-pink-500',
      action: { text: 'Explorar Artistas', link: createPageUrl('Community') }
    }
  ];

  const steps = user?.user_type === 'artist' ? artistSteps : fanSteps;

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData?.icon;

  if (!isVisible || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleSkip();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${currentStepData.color}`} />
            
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center`}>
                  <StepIcon className="w-8 h-8 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {currentStepData.title}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {currentStepData.description}
              </p>

              <div className="flex gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${
                      index === currentStep
                        ? `bg-gradient-to-r ${currentStepData.color}`
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className={`flex-1 bg-gradient-to-r ${currentStepData.color} hover:opacity-90`}
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    className={`flex-1 bg-gradient-to-r ${currentStepData.color} hover:opacity-90`}
                  >
                    ¡Empezar!
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>

              {currentStepData.action && (
                <Button
                  variant="link"
                  className="w-full mt-3"
                  onClick={() => {
                    handleComplete();
                    window.location.href = currentStepData.action.link;
                  }}
                >
                  {currentStepData.action.text} →
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}