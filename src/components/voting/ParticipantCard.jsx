import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Share2, Play, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createPageUrl } from '@/utils';
import { getDeviceFingerprint } from '../utils/fingerprint';

export default function ParticipantCard({ participant, totalVotes = 0, onVote, hasVoted, currentUser, contestStatus, voteRound }) {
  const [isVoting, setIsVoting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [localVotes, setLocalVotes] = useState(participant.total_votes || 0);
  const [localTotalVotes, setLocalTotalVotes] = useState(totalVotes);
  const [localHasVoted, setLocalHasVoted] = useState(hasVoted);
  const [voteError, setVoteError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sincronizar cuando cambia hasVoted desde el padre (auto-refresh)
  useEffect(() => {
    if (hasVoted && !localHasVoted) {
      setLocalHasVoted(true);
    }
  }, [hasVoted]);

  // Sincronizar votos cuando cambian desde el padre
  useEffect(() => {
    if (participant.total_votes !== undefined) {
      setLocalVotes(participant.total_votes);
    }
  }, [participant.total_votes]);

  // Sincronizar total de votos de la sala para el porcentaje
  useEffect(() => {
    setLocalTotalVotes(totalVotes);
  }, [totalVotes]);

  const votePercentage = localTotalVotes > 0 ? (localVotes / localTotalVotes) * 100 : 0;

  const handleVote = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isVoting || localHasVoted) return;

       // Verificar estado solo si contestStatus fue pasado explícitamente
    if (contestStatus && contestStatus !== 'voting' && contestStatus !== 'finalists') {
      setVoteError('La votación aún no está habilitada para esta convocatoria.');
      return;
    }

    
    // Verificar si el usuario es artista usando el estado ya cargado
    if (currentUser && currentUser.user_type === 'artist') {
      setVoteError('Los artistas no pueden votar. Solo fans e invitados pueden votar por los participantes.');
      return;
    }

    setIsVoting(true);
    setVoteError(null);
    
    let votedSuccessfully = false;

    try {
      // El voto lo valida y registra el servidor: un voto por usuario y por dispositivo
      const response = await base44.functions.invoke('castVote', {
        participant_id: participant.id,
        device_fingerprint: getDeviceFingerprint()
      });
      const result = response?.data || {};

      if (result.success || result.error === 'already_voted') {
        votedSuccessfully = true;
      } else if (result.error === 'voting_closed') {
        setVoteError('La votación de esta convocatoria ya cerró.');
      } else if (result.error === 'artists_cannot_vote') {
        setVoteError('Los artistas no pueden votar.');
      } else {
        setVoteError('Error al votar. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      setVoteError('Error al votar. Por favor, intenta de nuevo.');
    } finally {
      setIsVoting(false);
    }
    
    if (votedSuccessfully) {
      setLocalHasVoted(true);
      setLocalVotes(prev => prev + 1);
      setLocalTotalVotes(prev => prev + 1);
      setVoteError(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }
  };

  const handleShare = async () => {
    // Compartir enlace directo a VotingRoom con el contestId para que vean el video y puedan votar
    const shareUrl = `${window.location.origin}${createPageUrl('VotingRoom')}?contestId=${participant.contest_id}`;
    const shareData = {
      title: `Vota por ${participant.artist_name} en TuVozTuPremio`,
      text: `¡Escucha a ${participant.artist_name} y apoya su talento en TuVozTuPremio! 🎤🎵`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('Contenido compartido!');
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      
      // -- INICIO DE CORRECCIÓN: Registrar la compartición --
      const user = currentUser;
      if (user && user.id !== participant.artist_id) { // Only record if a user is logged in AND it's not the artist sharing their own profile
        await base44.entities.FanShare.create({
            fan_id: user.id,
            fan_name: user.full_name || user.email,
            artist_id: participant.artist_id,
            artist_name: participant.artist_name,
            share_platform: navigator.share ? 'native' : 'copy_link'
        });
        console.log('Compartición registrada para el sistema de recompensas.');
      }
      // -- FIN DE CORRECCIÓN --

    } catch (error) {
      console.error('Error al compartir', error);
    }
  };

  const getVideoEmbedUrl = () => {
    if (participant.youtube_video_id) {
      return `https://www.youtube.com/embed/${participant.youtube_video_id}`;
    }
    if (participant.youtube_url) {
      const videoId = participant.youtube_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const videoEmbedUrl = getVideoEmbedUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Toast de éxito al votar - fijo en pantalla */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 pointer-events-none"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="bg-green-500 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[260px] max-w-[90vw]">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold">¡Gracias por tu voto!</p>
                <p className="text-sm text-green-100">Apoyaste a {participant.artist_name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100">
            {participant.artist_image ? (
              <img
                src={participant.artist_image}
                alt={participant.artist_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-16 h-16 text-purple-300" />
              </div>
            )}
            
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-gray-900">{localVotes}</span>
              <span className="text-xs font-bold text-purple-600 ml-1">
                {votePercentage.toFixed(1)}%
              </span>
            </div>

            {localHasVoted && (
              <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Votado
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="mb-4 flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {participant.artist_name}
            </h3>
            <div className="flex items-center gap-2 text-purple-600 font-medium mb-3">
              <Music className="w-4 h-4" />
              <span className="text-sm">{participant.song_title}</span>
            </div>
            {participant.artist_bio && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {participant.artist_bio}
              </p>
            )}
            {participant.artist_country && (
              <Badge variant="outline" className="mb-3">
                {participant.artist_country}
              </Badge>
            )}

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>{localVotes} {localVotes === 1 ? 'voto' : 'votos'}</span>
                <span className="text-purple-600">{votePercentage.toFixed(1)}% del total</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(votePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>



          {voteError && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{voteError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={handleVote}
              disabled={isVoting || localHasVoted}
              style={{ touchAction: 'manipulation' }}
              className={`flex items-center justify-center gap-2 ${
                localHasVoted
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isVoting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Votando...
                </>
              ) : localHasVoted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Votado
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  Votar
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              style={{ touchAction: 'manipulation' }}
              className="flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
          </div>

          {(videoEmbedUrl || participant.video_url) && (
            <Button
              variant="ghost"
              onClick={() => setShowVideo(!showVideo)}
              className="mt-3 w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Play className="w-4 h-4" />
              {showVideo ? 'Ocultar Video' : 'Ver Video'}
            </Button>
          )}

          {showVideo && (
            <div className="mt-4 rounded-lg overflow-hidden shadow-lg">
              {videoEmbedUrl ? (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={videoEmbedUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={participant.song_title}
                  />
                </div>
              ) : participant.video_url ? (
                <video
                  src={participant.video_url}
                  controls
                  className="w-full rounded-lg"
                  controlsList="nodownload"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              ) : null}
            </div>
          )}

          {currentUser && (participant.social_instagram || participant.social_facebook || participant.social_tiktok) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              {participant.social_instagram && (
                <a
                  href={participant.social_instagram.startsWith('http') ? participant.social_instagram : `https://instagram.com/${participant.social_instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {participant.social_facebook && (
                <a
                  href={participant.social_facebook.startsWith('http') ? participant.social_facebook : `https://facebook.com/${participant.social_facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {participant.social_tiktok && (
                <a
                  href={participant.social_tiktok.startsWith('http') ? participant.social_tiktok : `https://tiktok.com/@${participant.social_tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
