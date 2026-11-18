import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Instagram, Facebook, Share2, ArrowLeft, Music, Gift, Star, Lock, Users, UserPlus, UserMinus, Youtube, Album, Trophy, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContentProtection from '../components/security/ContentProtection';
import CopyrightNoticeButton from '../components/legal/CopyrightNoticeButton';
import ReportButton from '../components/moderation/ReportButton';
import GiftSelector from '../components/gifting/GiftSelector';

const SpotifyIcon = (props) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <title>Spotify</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.922 17.584c-.23.37-.69.49-1.06.26-2.91-1.77-6.57-2.16-10.8-1.18a.66.66 0 01-.73-.65.66.66 0 01.65-.73c4.58-.93 8.57-.49 11.77 1.43s.47.69.26 1.06l-.12.17zm1.14-2.58c-.26.43-.8.56-1.23.3-3.51-2.14-8.03-2.6-11.22-1.43a.81.81 0 01-.89-.8.81.81 0 01.8-.89c3.52-1.11 8.37-.62 12.02 1.88.43.26.56.8.3 1.23l-.15.24zm.3-3.15c-.31.5-1 .65-1.5.34-4.02-2.45-9.39-3.05-13.04-1.68a.98.98 0 01-1.06-.96.98.98 0 01.96-1.06c4.01-.13 9.76.52 14.18 3.25.5.31.65.99.34 1.5l-.17.29z"/>
  </svg>
);

export default function ArtistProfile() {
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [participation, setParticipation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [hasPrivateContent, setHasPrivateContent] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showGiftSelector, setShowGiftSelector] = useState(false);

  useEffect(() => {
    const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''; const urlParams = new URLSearchParams(window.location.search || hashQuery);
    const artistId = urlParams.get('id');
    if (artistId) {
      loadProfileData(artistId);
    } else {
      setError('No se especificó un artista');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser && artist) {
      checkIfFavorite();
    }
  }, [currentUser, artist]);

  const checkIfFavorite = async () => {
    if (!currentUser || !artist) return;
    try {
      const favorites = await base44.entities.UserFavorite.filter({
        user_id: currentUser.id,
        artist_id: artist.id
      });
      setIsFavorite(favorites && favorites.length > 0);
    } catch (error) {
      console.error('Error checking favorite:', error);
      setIsFavorite(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        const favorites = await base44.entities.UserFavorite.filter({
          user_id: currentUser.id,
          artist_id: artist.id
        });
        if (favorites && favorites.length > 0) {
          await base44.entities.UserFavorite.delete(favorites[0].id);
          setIsFavorite(false);
        }
      } else {
        await base44.entities.UserFavorite.create({
          user_id: currentUser.id,
          artist_id: artist.id,
          artist_name: artist.artist_name,
          artist_image: artist.profile_image
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const loadProfileData = async (artistId) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await base44.auth.me().catch(() => null);
      setCurrentUser(user);

      // Perfil de un Artista Destacado (datos públicos de la comunidad)
      if (artistId.startsWith('featured_')) {
        const featuredList = await base44.entities.FeaturedArtist.filter({ id: artistId.replace('featured_', '') });
        const featured = featuredList?.[0];
        if (!featured) throw new Error('Artista no encontrado');
        setArtist({
          id: artistId,
          artist_name: featured.artist_name,
          profile_image: featured.profile_image,
          bio: featured.bio,
          country: featured.country,
          genre: featured.genre,
          social_instagram: featured.social_instagram,
          social_facebook: featured.social_facebook,
          social_tiktok: featured.social_tiktok,
          profile_videos: [],
          discography: [],
          achievements: [],
        });
        setFollowersCount(featured.followers_count || 0);
        return;
      }

      // 1. Cargar participación activa (pública) y el perfil de ganador (público)
      const participations = await base44.entities.Participant.filter({ artist_id: artistId, status: 'active' }, '-created_date');
      const latestParticipation = participations?.[0] || null;
      console.log('🎬 Participación encontrada:', latestParticipation);
      console.log('🎬 YouTube ID:', latestParticipation?.youtube_video_id);
      console.log('🎬 Video URL:', latestParticipation?.video_url);
      setParticipation(latestParticipation);

      // 2. Intentar cargar el perfil de usuario completo. Esto puede fallar para visitantes.
      let fullArtistProfile = null;
      try {
        const users = await base44.entities.User.filter({ id: artistId });
        if (users && users.length > 0) {
          fullArtistProfile = users[0];
          if (fullArtistProfile.profile_videos?.length > 0 || fullArtistProfile.discography?.length > 0 || fullArtistProfile.achievements?.length > 0) {
            setHasPrivateContent(true);
          }
        }
      } catch (e) {
        console.warn("No se pudo cargar el perfil de usuario completo (visitante o error de permisos). Se usarán datos públicos.", e);
        fullArtistProfile = null; 
      }
      
      // 3. Si no tenemos ni perfil completo ni participación, buscar en ganadores como última opción
      let winnerProfile = null;
      if (!fullArtistProfile && !latestParticipation) {
        const winners = await base44.entities.Winner.filter({ artist_id: artistId }, '-created_date');
        winnerProfile = winners?.[0] || null;
      }
      
      // 4. Construir el objeto de artista a mostrar
      if (!fullArtistProfile && !latestParticipation && !winnerProfile) {
        throw new Error("Artista no encontrado o sin contenido público disponible.");
      }

      // Fusionar datos: el perfil completo tiene prioridad, luego el de participación, luego el de ganador.
      const finalArtist = {
        id: artistId,
        artist_name: fullArtistProfile?.artist_name || latestParticipation?.artist_name || winnerProfile?.artist_name || 'Artista Desconocido',
        profile_image: fullArtistProfile?.profile_image || latestParticipation?.artist_image || winnerProfile?.artist_image,
        cover_image: fullArtistProfile?.cover_image,
        bio: fullArtistProfile?.bio || latestParticipation?.artist_bio || winnerProfile?.artist_bio,
        country: fullArtistProfile?.country || latestParticipation?.artist_country,
        social_instagram: fullArtistProfile?.social_instagram,
        social_facebook: fullArtistProfile?.social_facebook,
        social_tiktok: fullArtistProfile?.social_tiktok,
        social_youtube: fullArtistProfile?.social_youtube,
        social_spotify: fullArtistProfile?.social_spotify,
        profile_videos: fullArtistProfile?.profile_videos || [],
        discography: fullArtistProfile?.discography || [],
        achievements: fullArtistProfile?.achievements || [],
      };
      
      setArtist(finalArtist);

      // 5. Cargar datos adicionales (seguidores, fans)
      await loadFollowers(artistId, user);

    } catch (error) {
      console.error("Error definitivo al cargar el perfil:", error);
      setError(error.message || 'Error al cargar el perfil del artista');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFollowers = async (artistId, user) => {
    try {
      const followers = await base44.entities.Follower.filter({ artist_id: artistId });
      setFollowersCount(followers?.length || 0);
      if (user) {
        setIsFollowing(followers?.some(f => f.fan_id === user.id) || false);
      }
    } catch (error) {
      console.error("Error loading followers:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !artist) return;
    if (!currentUser) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        const followers = await base44.entities.Follower.filter({ fan_id: currentUser.id, artist_id: artist.id });
        if (followers?.[0]) {
          await base44.entities.Follower.delete(followers[0].id);
          setIsFollowing(false);
          setFollowersCount(p => Math.max(0, p - 1));
        }
      } else {
        await base44.entities.Follower.create({ fan_id: currentUser.id, artist_id: artist.id, artist_name: artist.artist_name });
        setIsFollowing(true);
        setFollowersCount(p => p + 1);
        // Opcional: notificar al artista
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

     const handleShare = async (platform) => {
    if (!artist) {
      console.error("Artist data not available for sharing.");
      return;
    }

    let currentUserData = null;
    try {
      currentUserData = await base44.auth.me();
    } catch (e) {
      currentUserData = null;
    }

    const baseAppUrl = `${window.location.origin}${window.location.pathname}#`;
    const shareUrl = currentUserData 
      ? `${baseAppUrl}${createPageUrl('ArtistProfile')}?id=${artist.id}&ref=${currentUserData.id}`
      : `${baseAppUrl}${createPageUrl('ArtistProfile')}?id=${artist.id}`;
    
    const shareText = `¡Mira el perfil de ${artist.artist_name}! 🎤🎵`;
    const fullShareMessage = `${shareText} ${shareUrl}`;

    if (!currentUserData) {
      const shouldLogin = window.confirm(
        '💡 ¡Regístrate para participar!\n\n' +
        'Registrate gratis para votar por tus artistas favoritos y compartir sus perfiles.\n\n' +
        '¿Quieres registrarte ahora?'
      );
      if (shouldLogin) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
    }

    let shareActionSuccess = false;
    let actualSharePlatform = platform;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(fullShareMessage)}`, '_blank', 'width=600,height=400');
        shareActionSuccess = true;
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
        shareActionSuccess = true;
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
        shareActionSuccess = true;
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
        shareActionSuccess = true;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(fullShareMessage);
          alert('✅ Mensaje y enlace copiados al portapapeles.\n\n¡Compártelo con tus amigos!');
          shareActionSuccess = true;
          actualSharePlatform = 'copy_link';
        } catch (err) {
          alert('❌ No se pudo copiar el enlace. Intenta con otro método.');
        }
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: shareText,
              text: shareText,
              url: shareUrl
            });
            shareActionSuccess = true;
            actualSharePlatform = 'native';
          } catch (shareError) {
            if (shareError.name !== 'AbortError') {
              console.error("Error with native share:", shareError);
              try {
                await navigator.clipboard.writeText(fullShareMessage);
                alert('¡Mensaje y enlace copiados al portapapeles!');
                shareActionSuccess = true;
                actualSharePlatform = 'copy_link_fallback_native';
              } catch (err) {
                alert('❌ No se pudo copiar el enlace. Intenta con otro método.');
              }
            }
          }
        } else {
          try {
            await navigator.clipboard.writeText(fullShareMessage);
            alert('¡Mensaje y enlace copiados al portapapeles!');
            shareActionSuccess = true;
            actualSharePlatform = 'copy_link_unsupported_native';
          } catch (err) {
            alert('❌ No se pudo copiar el enlace. Intenta con otro método.');
          }
        }
        break;
      default:
        try {
          await navigator.clipboard.writeText(fullShareMessage);
          alert('¡Mensaje y enlace copiados al portapapeles! Compártelo para que más gente conozca al artista.');
          shareActionSuccess = true;
          actualSharePlatform = 'copy_link_default';
        } catch (err) {
          alert('❌ No se pudo copiar el enlace. Intenta con otro método.');
        }
        break;
    }
    
    if (shareActionSuccess && currentUserData && artist.id) {
      try {
        await base44.entities.FanShare.create({
          fan_id: currentUserData.id,
          fan_name: currentUserData.full_name || currentUserData.artist_name || 'Fan',
          artist_id: artist.id,
          artist_name: artist.artist_name,
          share_platform: actualSharePlatform
        });
        console.log(`✅ Compartición registrada`);
      } catch (error) {
        console.error("Error registrando compartición:", error);
      }
    }
  };

   const handleRegisterForFullProfile = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="text-center space-y-4">
            <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Artista no disponible</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate(createPageUrl('Contests'))} variant="outline">
              <Music className="w-4 h-4 mr-2" />
              Ver Concursos Activos
            </Button>
            <Button onClick={() => navigate(createPageUrl('Home'))}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback seguro si artist es null después de cargar
  if (!artist) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="text-center p-8">
                <h2 className="text-xl font-bold text-red-600">Artista no disponible</h2>
                <p className="text-gray-600 mt-2">No pudimos cargar el perfil de este artista.</p>
                <Button onClick={() => navigate(createPageUrl('Community'))} className="mt-4">
                    Volver a la Comunidad
                </Button>
            </Card>
        </div>
    );
  }

  const watermarkText = currentUser ? `${currentUser.email} • ${artist.artist_name}` : `TuVozTuPremio © • ${artist.artist_name}`;
  const canSendGift = currentUser && artist && currentUser.id !== artist.id;

  // Desestructurar aquí para asegurar que 'artist' no es nulo
  const { profile_videos, discography, achievements } = artist;

  return (
    <ContentProtection watermarkText={watermarkText}>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-8 md:py-12">
        
        {currentUser && artist.cover_image && (
          <div className="w-full h-64 md:h-80 bg-gradient-to-r from-purple-400 to-pink-400 mb-8 relative overflow-hidden">
            <img 
              src={artist.cover_image} 
              alt={`Portada de ${artist.artist_name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 md:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          {!currentUser && hasPrivateContent && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">¿Quieres ver el perfil completo?</p>
                      <p className="text-sm text-gray-600">Regístrate para ver videos, redes sociales, seguir artistas y más</p>
                    </div>
                  </div>
                  <Button onClick={handleRegisterForFullProfile} size="sm" className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                    Registrarme Gratis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="mb-4 flex justify-end">
            <CopyrightNoticeButton />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6 md:gap-8">
            
            <div className="md:col-span-1 space-y-6">
              <Card className="md:sticky md:top-8">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden ring-4 ring-white shadow-lg">
                    {artist.profile_image ? (
                      <img src={artist.profile_image} alt={artist.artist_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {artist.artist_name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{artist.artist_name}</h1>
                  <p className="text-gray-500 mb-2">Artista de TuVozTuPremio</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4 text-gray-700">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{followersCount}</span>
                    <span className="text-sm">{followersCount === 1 ? 'Seguidor' : 'Seguidores'}</span>
                  </div>

                  {artist.country && (
                    <p className="text-sm text-gray-600 mb-4">📍 {artist.country}</p>
                  )}
                  
                  {artist.bio && <p className="text-sm md:text-base text-gray-700 mb-6">{artist.bio}</p>}
                  
                  {currentUser && (
                    <div className="space-y-3">
                      {canSendGift && (
                        <Button
                          onClick={() => setShowGiftSelector(true)}
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Enviar Regalo 🎁
                        </Button>
                      )}

                      <Button
                        onClick={handleToggleFavorite}
                        disabled={isTogglingFavorite}
                        variant={isFavorite ? "outline" : "default"}
                        className={`w-full ${
                          isFavorite 
                            ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-50' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                        }`}
                      >
                        {isTogglingFavorite ? (
                          'Cargando...'
                        ) : isFavorite ? (
                          <>
                            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                            En Favoritos
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Agregar a Favoritos
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleFollowToggle}
                        disabled={isFollowLoading}
                        className={`w-full ${
                          isFollowing 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                      >
                        {isFollowLoading ? (
                          'Cargando...'
                        ) : isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Dejar de Seguir
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Seguir Artista
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {currentUser && (artist.social_instagram || artist.social_facebook || artist.social_tiktok || artist.social_youtube || artist.social_spotify) && (
                    <div className="flex justify-center gap-4 mb-6 mt-4">
                      {artist.social_instagram && (
                        <a href={`https://instagram.com/${artist.social_instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition-colors">
                          <Instagram className="w-6 h-6"/>
                        </a>
                      )}
                      {artist.social_facebook && (
                        <a href={artist.social_facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                          <Facebook className="w-6 h-6"/>
                        </a>
                      )}
                      {artist.social_tiktok && (
                        <a href={`https://tiktok.com/@${artist.social_tiktok.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.10-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.40-.67.41-1.06.10-.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          </svg>
                        </a>
                      )}
                      {artist.social_youtube && (
                        <a href={artist.social_youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 transition-colors">
                          <Youtube className="w-6 h-6"/>
                        </a>
                      )}
                      {artist.social_spotify && (
                        <a href={artist.social_spotify} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition-colors">
                          <SpotifyIcon className="w-6 h-6"/>
                        </a>
                      )}
                    </div>
                  )}

                  {!currentUser && hasPrivateContent && (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Contenido privado</span>
                      </div>
                      <p className="text-xs text-gray-500">Regístrate para seguir al artista y ver sus redes sociales</p>
                    </div>
                  )}

                  {currentUser && currentUser.id === artist.id && (
                    <Link to={createPageUrl('ArtistDashboard')}>
                      <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white">
                        <Video className="w-4 h-4 mr-2" /> Gestionar Mi Perfil
                      </Button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Share2 className="w-4 h-4 mr-2" /> Compartir Perfil
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter / X
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('telegram')}>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('copy')}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar Enlace
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ReportButton
                      contentType="profile"
                      contentId={artist.id}
                      reportedUserId={artist.id}
                      variant="button"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Share2 className="w-6 h-6 text-yellow-600" />
                      <h3 className="font-bold text-lg text-yellow-900">¡Comparte este perfil!</h3>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        Ayuda a {artist.artist_name} a recibir más votos compartiendo su perfil en tus redes.
                      </p>
                    </div>
                    {!currentUser && (
                      <>
                        <Button
                          onClick={() => base44.auth.redirectToLogin(window.location.href)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
                        >
                          Registrarme Gratis
                        </Button>
                        <p className="text-xs text-gray-600 mt-2">
                          Gratis • Compartí el perfil de tu artista favorito
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="md:col-span-2 space-y-6">
              
              {participation && (
                <>
                  <h2 className="text-xl md:text-2xl font-bold">Video del Concurso</h2>
                  <Card>
                    <CardContent className="p-0">
                      {!currentUser ? (
                        <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                          <div className="text-center p-8">
                            <Lock className="w-16 h-16 text-white mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">
                              Video del Concurso
                            </h3>
                            <p className="text-purple-100 mb-6">
                              Regístrate gratis para ver el video completo de {artist.artist_name}
                            </p>
                            <Button 
                              onClick={() => base44.auth.redirectToLogin(window.location.href)}
                              size="lg"
                              className="bg-white text-purple-900 hover:bg-purple-50"
                            >
                              Ver Video Completo
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg overflow-hidden bg-black">
                          {participation.youtube_video_id ? (
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube-nocookie.com/embed/${participation.youtube_video_id}?rel=0&modestbranding=1&controls=1`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                              title={participation.song_title}
                            />
                          ) : participation.video_url ? (
                            <video 
                              src={participation.video_url} 
                              controls 
                              className="w-full h-full object-contain"
                              preload="metadata"
                            >
                              Tu navegador no soporta la reproducción de video.
                            </video>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <p>No hay video disponible</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
              
              {!participation && (
                <Card>
                  <CardContent className="p-8 md:p-12 text-center">
                    <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">Este artista no tiene una participación activa en este momento.</p>
                    <Link to={createPageUrl('Contests')}>
                      <Button>Ver Concursos Activos</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Videos del Perfil */}
              {currentUser && profile_videos?.length > 0 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Más Videos de {artist.artist_name}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {profile_videos.map((video, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          {video.description && (
                            <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                          )}
                        </CardHeader>
                        <CardContent className="pt-2">
                          {video.youtube_video_id ? (
                            <div className="aspect-video rounded overflow-hidden">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube-nocookie.com/embed/${video.youtube_video_id}?rel=0&modestbranding=1&controls=1&fs=0&disablekb=1&iv_load_policy=3`}
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                                title={video.title}
                              />
                            </div>
                          ) : video.video_url ? (
                            <video 
                              src={video.video_url} 
                              controls 
                              controlsList="nodownload"
                              disablePictureInPicture
                              className="w-full rounded" 
                            />
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Discografía */}
              {currentUser && discography?.length > 0 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                    <Album className="w-6 h-6" />
                    Discografía
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discography.map((album, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          {album.cover_image && (
                            <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100">
                              <img 
                                src={album.cover_image} 
                                alt={album.album_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h3 className="font-bold text-lg mb-1">{album.album_name}</h3>
                          {album.release_year && (
                            <p className="text-sm text-gray-500 mb-2">{album.release_year}</p>
                          )}
                          {album.description && (
                            <p className="text-sm text-gray-600 mb-3">{album.description}</p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            {album.spotify_link && (
                              <a 
                                href={album.spotify_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700"
                              >
                                <Button variant="outline" size="sm">
                                  <SpotifyIcon className="w-4 h-4 mr-1" />
                                  Spotify
                                </Button>
                              </a>
                            )}
                            {album.youtube_link && (
                              <a 
                                href={album.youtube_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Button variant="outline" size="sm">
                                  <Youtube className="w-4 h-4 mr-1" />
                                  YouTube
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Logros y Reconocimientos */}
              {currentUser && achievements?.length > 0 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6" />
                    Logros y Reconocimientos
                  </h2>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-center">
                            {achievement.image_url && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={achievement.image_url} 
                                  alt={achievement.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 text-left">
                              <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                              {achievement.date && (
                                <p className="text-sm text-gray-500 mb-2">
                                  {new Date(achievement.date).toLocaleDateString('es-AR', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              )}
                              {achievement.description && (
                                <p className="text-sm text-gray-700">{achievement.description}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {!currentUser && hasPrivateContent && (
                <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300">
                  <CardContent className="p-6 md:p-8 text-center">
                    <Lock className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ¡{artist.artist_name} tiene un perfil completo!
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Regístrate para ver todos sus videos, discografía, logros y descubrir más de su música
                    </p>
                    <Button 
                      onClick={handleRegisterForFullProfile}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Registrarme Gratis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {showGiftSelector && artist && (
        <GiftSelector 
          artist={artist}
          fan={currentUser} // Added fan prop
          isOpen={showGiftSelector}
          onClose={() => setShowGiftSelector(false)}
        />
      )}
    </ContentProtection>
  );
}


 
