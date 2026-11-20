import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import ArtistProfileForm from '../components/participate/ArtistProfileForm';
import VideoSubmission from '../components/participate/VideoSubmission';
import PaymentStep from '../components/participate/PaymentStep';
import PaymentConfirmation from '../components/participate/PaymentConfirmation';

const extractYouTubeVideoId = (url) => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
};

export default function Participate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get('contestId');

  const [user, setUser] = useState(null);
  const [contest, setContest] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const getDraftKey = (uid, cid) => `tvtp_participate_draft_${uid}_${cid}`;

  useEffect(() => {
    loadData();
  }, [contestId]);

  useEffect(() => {
    if (user?.id && contestId && !success && (profileData || videoData || step > 1)) {
      try {
        localStorage.setItem(
          getDraftKey(user.id, contestId),
          JSON.stringify({ step, profileData, videoData, paymentData })
        );
      } catch (e) {
        console.warn('No se pudo guardar el borrador local:', e);
      }
    }
  }, [step, profileData, videoData, paymentData, user, contestId, success]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step >= 2 && step < 4 && !success) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro que quieres salir? Tu progreso quedará guardado hasta que vuelvas.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [step, success]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    let userData = null;
    try {
      userData = await base44.auth.me();
    } catch (authError) {
      setError('not_authenticated');
      setIsLoading(false);
      return;
    }

    try {
      if (userData.user_type !== 'artist' && userData.role !== 'admin') {
        alert('Solo los artistas pueden inscribirse en convocatorias. Por favor, selecciona el rol de artista en tu perfil.');
        navigate(createPageUrl('SelectRole'));
        return;
      }

      setUser(userData);

      if (!contestId) {
        setError('no_contest_selected');
        setIsLoading(false);
        return;
      }

      const contests = await base44.entities.Contest.filter({ id: contestId });
      if (!contests || contests.length === 0) {
        setError('Convocatoria no encontrada.');
        setIsLoading(false);
        return;
      }

      const contestData = contests[0];
      if (contestData.status !== 'open' && contestData.status !== 'voting') {
        setError('Esta convocatoria no está aceptando inscripciones en este momento.');
        setIsLoading(false);
        return;
      }

      setContest(contestData);

      const existingParticipants = await base44.entities.Participant.filter({
        contest_id: contestId,
        artist_id: userData.id
      });

      if (existingParticipants && existingParticipants.length > 0) {
       const participant = existingParticipants[0];
        if (participant.status === 'active' || participant.status === 'pending_payment') {
          localStorage.removeItem(getDraftKey(userData.id, contestId));
          setError(`Ya tienes una participación en esta convocatoria (Estado: ${participant.status === 'active' ? 'Activa' : 'Pendiente de Pago'}). No puedes inscribirte dos veces.`);
          setIsLoading(false);
          return;
        }
      }

      // Restaurar progreso guardado (si fue a Passline o PayPal y volvió)
      let restored = false;
      try {
        const savedRaw = localStorage.getItem(getDraftKey(userData.id, contestId));
        if (savedRaw) {
          const saved = JSON.parse(savedRaw);
          if (saved.profileData) setProfileData(saved.profileData);
          if (saved.videoData) setVideoData(saved.videoData);
          if (saved.paymentData) setPaymentData(saved.paymentData);
          if (saved.step && saved.step >= 2) {
            setStep(saved.step);
            restored = true;
          }
        }
      } catch (e) {
        console.warn('Error leyendo borrador guardado:', e);
      }

      if (!restored) {
        const isProfileComplete = userData.artist_name && 
                                  userData.bio && 
                                  userData.profile_image && 
                                  userData.country && 
                                  userData.phone &&
                                  userData.social_instagram &&
                                  userData.social_facebook &&
                                  userData.social_tiktok;

        if (isProfileComplete) {
          setStep(2);
          setProfileData({
            artist_name: userData.artist_name,
            bio: userData.bio,
            profile_image: userData.profile_image,
            country: userData.country,
            phone: userData.phone,
            social_instagram: userData.social_instagram,
            social_facebook: userData.social_facebook,
            social_tiktok: userData.social_tiktok
          });
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar datos. Por favor, recarga la página.');
    } finally {
      setIsLoading(false);
    }
  };

 const handleProfileComplete = (data) => {
    setProfileData(data);
    setStep(2);
  };

  const isFreePromo = Boolean(contest?.is_free_promo) || parseFloat(contest?.entry_price) === 0;

  const handleVideoComplete = (data) => {
    setVideoData(data);
    if (isFreePromo) {
      setPaymentData({ payment_method: 'free_promo' });
    }
    setStep(3);
  };

  const handlePaymentStart = (method = 'passline') => {
    setPaymentData({ payment_method: method });
    if (method === 'free_promo') {
      handlePaymentComplete('free_promo');
      return;
    }
    setStep(4);
  };

  const handlePaymentComplete = async (overrideMethod = null) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (user.user_type !== 'artist' && user.role !== 'admin') {
        alert('Solo los artistas pueden participar en convocatorias');
        navigate(createPageUrl('SelectRole'));
        return;
      }

      const existingParticipations = await base44.entities.Participant.filter({
        contest_id: contest.id,
        artist_id: user.id
      });

      if (existingParticipations && existingParticipations.length > 0) {
        const participant = existingParticipations.at(0);
        if (participant.status === 'active' || participant.status === 'pending_payment') {
          alert('❌ Ya tienes una inscripción activa o pendiente en esta convocatoria. No puedes inscribirte dos veces.');
          navigate(createPageUrl('ArtistDashboard'));
          return;
        }
      }

      let videoFinalUrl = '';
      let youtubeFinalVideoId = '';

      if (videoData.youtube_url) {
        videoFinalUrl = videoData.youtube_url;
        youtubeFinalVideoId = videoData.youtube_video_id || extractYouTubeVideoId(videoData.youtube_url);
      } else if (videoData.video_url) {
        videoFinalUrl = videoData.video_url;
      }

      const chosenMethod = overrideMethod || paymentData?.payment_method || (isFreePromo ? 'free_promo' : 'passline');
      const isFree = chosenMethod === 'free_promo' || isFreePromo;
      const entryPrice = isFree ? 0 : (parseFloat(contest.entry_price) || 10);
      const methodLabel = isFree ? 'Acceso Gratis (Promoción)' : (chosenMethod === 'paypal' ? 'PayPal' : 'Passline');

      await base44.entities.Transaction.create({
        user_id: user.id,
        type: 'contest_entry',
        amount: entryPrice,
        description: isFree
          ? `Inscripción Promocional Gratuita ($0): ${contest.name} (${user.email})`
          : `Inscripción: ${contest.name} - Pendiente de verificación en ${methodLabel} (${user.email})`,
        payment_method: chosenMethod,
        status: isFree ? 'approved' : 'pending',
        related_contest_id: contest.id,
        video_url: videoFinalUrl
      });

      await base44.entities.Participant.create({
        contest_id: contest.id,
        artist_id: user.id,
        artist_name: profileData.artist_name,
        artist_image: profileData.profile_image,
        artist_bio: profileData.bio,
        artist_country: profileData.country,
        social_instagram: profileData.social_instagram,
        social_facebook: profileData.social_facebook,
        social_tiktok: profileData.social_tiktok,
        youtube_url: videoData.youtube_url || '',
        youtube_video_id: youtubeFinalVideoId,
        video_url: videoData.video_url || '',
        song_title: videoData.song_title,
        total_votes: 0,
        average_rating: 0,
        payment_verified: isFree ? true : false,
        payment_method: chosenMethod,
        status: isFree ? 'active' : 'pending_payment'
      });

      await base44.entities.Notification.create({
        user_id: user.id,
        title: isFree ? '🎉 ¡Inscripción Gratuita Activada!' : '⏳ Inscripción Pendiente',
        message: isFree
          ? `¡Tu participación promocional gratuita ($0) en "${contest.name}" ya está activa! Comparte tu perfil para sumar votos.`
          : `Tu inscripción en "${contest.name}" está pendiente de aprobación (${methodLabel}). Te notificaremos cuando se apruebe y tu video esté activo.`,
        type: isFree ? 'contest_approved' : 'contest_pending',
        link: createPageUrl('ArtistDashboard')
      });

      localStorage.removeItem(getDraftKey(user.id, contest.id));

      try {
        const { checkBadgeEligibility } = await import('../components/gamification/BadgeSystem');
        await checkBadgeEligibility(user.id);
      } catch (badgeError) {
        console.warn('⚠️ Error checking badges:', badgeError);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('ArtistDashboard'));
      }, 3000);

   } catch (error) {
      console.error('❌ Error al inscribirse:', error);
      const errorString = JSON.stringify(error).toLowerCase();
      if (errorString.includes('unique') || errorString.includes('duplicate')) {
        alert('❌ Ya tienes una inscripción activa o pendiente en esta convocatoria. No puedes inscribirte dos veces.');
        navigate(createPageUrl('ArtistDashboard'));
        return;
      }
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error === 'no_contest_selected') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-12">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Selecciona una Convocatoria
            </h2>
            <p className="text-gray-600 mb-8">
              Para participar, primero debes seleccionar una convocatoria desde la página de Convocatorias Activas.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl('Contests'))}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Ver Convocatorias Activas
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="outline" onClick={() => navigate(createPageUrl('Contests'))} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Convocatorias
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Inscripción Enviada!
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Registramos tu inscripción a la convocatoria{' '}
                <strong className="text-purple-600">{contest.name}</strong>. Verificaremos tu pago de{' '}
                {paymentData?.payment_method === 'paypal' ? 'PayPal' : 'Passline'} y activaremos tu video.
              </p>
              <p className="text-gray-500 text-sm">
                Redirigiendo...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate(createPageUrl('Contests'))}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Convocatorias
          </Button>

          {step > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="text-purple-700 hover:text-purple-900 hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al paso anterior (Paso {step - 1})
            </Button>
          )}
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="text-2xl">Inscripción a la Convocatoria</CardTitle>
            <p className="text-purple-100 text-sm mt-2">
              {contest.name} • {contest.genre} • Inscripción ${(parseFloat(contest.entry_price) || 10).toFixed(2)} USD (Passline / PayPal)
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center cursor-pointer transition-opacity hover:opacity-80 ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}
                title="Ir al Paso 1: Perfil"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Perfil</span>
              </button>
              <div className={`mx-3 h-1 w-12 sm:w-20 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              
              <button
                type="button"
                onClick={() => (profileData || step >= 2) && setStep(2)}
                disabled={!profileData && step < 2}
                className={`flex items-center transition-opacity ${profileData || step >= 2 ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'} ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}
                title="Ir al Paso 2: Video"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Video</span>
              </button>
              <div className={`mx-3 h-1 w-12 sm:w-20 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              
              <button
                type="button"
                onClick={() => (videoData || step >= 3) && setStep(3)}
                disabled={!videoData && step < 3}
                className={`flex items-center transition-opacity ${videoData || step >= 3 ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'} ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}
                title="Ir al Paso 3: Pago"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Pago</span>
              </button>
              <div className={`mx-3 h-1 w-12 sm:w-20 ${step >= 4 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${step >= 4 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 4 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  4
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Confirmar</span>
              </div>
            </div>

            {step === 1 && (
              <ArtistProfileForm 
                initialData={profileData || user}
                onComplete={handleProfileComplete}
              />
            )}

            {step === 2 && (
              <VideoSubmission
                initialData={videoData}
                onSubmit={handleVideoComplete}
                onBack={() => setStep(1)}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 3 && (
              <PaymentStep
                contest={contest}
                onPaymentStart={handlePaymentStart}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <PaymentConfirmation
                contest={contest}
                userEmail={user?.email}
                paymentMethod={paymentData?.payment_method || 'passline'}
                onComplete={handlePaymentComplete}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


