import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Instagram, Facebook, ExternalLink, UserPlus, UserCheck, AlertCircle, Star, Trophy, Mic } from 'lucide-react';
import CountryFlag3D from '@/components/brand/CountryFlag3D';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function Community() {
  const navigate = useNavigate();
  const [allArtists, setAllArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArtists(allArtists);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allArtists.filter(artist =>
        artist.artist_name?.toLowerCase().includes(query) ||
        artist.bio?.toLowerCase().includes(query) ||
        artist.country?.toLowerCase().includes(query) ||
        artist.genre?.toLowerCase().includes(query)
      );
      setFilteredArtists(filtered);
    }
  }, [searchQuery, allArtists]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Obtener usuario actual
      let userData = null;
      try {
        userData = await base44.auth.me();
        setCurrentUser(userData);
        
        // Cargar lista de seguidos
        try {
          const following = await base44.entities.Follower.filter({ fan_id: userData.id });
          setFollowingList(Array.isArray(following) ? following.map(f => f.artist_id) : []);
        } catch (e) {
          setFollowingList([]);
        }
      } catch (error) {
        setCurrentUser(null);
        setFollowingList([]);
      }

      const artistsList = [];

      // 1. Cargar artistas destacados
      try {
        const featured = await base44.entities.FeaturedArtist.filter({ is_active: true }, '-participations_count');
        if (Array.isArray(featured)) {
          featured.forEach(artist => {
            artistsList.push({
              ...artist,
              id: `featured_${artist.id}`,
              isFeatured: true,
              followersCount: artist.followers_count || 0,
              participationsCount: artist.participations_count || 0
            });
          });
        }
      } catch (error) {
        console.error('Error loading featured artists:', error);
      }

      // 2. Cargar artistas reales con perfil público desde Participants (público para todos)
      try {
        console.log('🔍 Cargando artistas reales con perfil público...');
        
        // Cargar participantes - esta entidad es pública
        const allParticipants = await base44.entities.Participant.list();
        console.log(`📊 Total participantes: ${allParticipants?.length || 0}`);
        
        // Cargar salas (concursos) para saber quién está participando hoy
        const contests = await base44.entities.Contest.list();
        const contestMap = new Map((contests || []).map(c => [c.id, c]));

        // Todos los artistas que participan o participaron
        const activeParticipants = allParticipants.filter(p => 
          p.status === 'active' && 
          p.artist_name &&
          p.artist_id
        );
        
        // Agrupar por artist_id para crear perfiles únicos
        const artistsMap = new Map();
        
        for (const participant of activeParticipants) {
          const artistId = participant.artist_id;
          
          if (!artistsMap.has(artistId)) {
            // Contar seguidores
            let followersCount = 0;
            try {
              const followers = await base44.entities.Follower.filter({ artist_id: artistId });
              followersCount = Array.isArray(followers) ? followers.length : 0;
            } catch (e) {
              followersCount = 0;
            }
            
            // Contar participaciones de este artista
            const participations = activeParticipants.filter(p => p.artist_id === artistId);
            
            // Crear perfil desde datos de Participant
            artistsMap.set(artistId, {
              id: artistId,
              artist_name: participant.artist_name,
              bio: participant.artist_bio,
              profile_image: participant.artist_image,
              country: participant.artist_country,
              genre: contestMap.get(participant.contest_id)?.genre,
              social_instagram: participant.social_instagram,
              social_facebook: participant.social_facebook,
              social_tiktok: participant.social_tiktok,
              isFeatured: false,
              followersCount,
              participationsCount: participations.length,
              activeContest: null,
              lastContestName: contestMap.get(participant.contest_id)?.name || null
            });
            
            console.log(`✅ Añadido: ${participant.artist_name}`);
          }
        }
        
        // Participación activa: sala en la que hoy se puede votar por el artista
        const ACTIVE_STATUSES = ['open', 'voting', 'finalists'];
        activeParticipants.forEach(participant => {
          const artist = artistsMap.get(participant.artist_id);
          const contest = contestMap.get(participant.contest_id);
          if (!artist || !contest || !ACTIVE_STATUSES.includes(contest.status)) return;

          // Las salas en votación tienen prioridad sobre las de inscripción
          const current = artist.activeContest;
          if (current && current.status !== 'open' && contest.status === 'open') return;

          artist.activeContest = {
            id: contest.id,
            name: contest.name,
            genre: contest.genre,
            status: contest.status
          };
        });

        // Agregar a la lista
        artistsList.push(...artistsMap.values());
        
        console.log(`✅ Artistas públicos cargados: ${artistsMap.size}`);
      } catch (error) {
        console.error('Error loading real artists:', error);
      }

      // 3. Regalos recibidos por cada artista (solo conteos públicos, sin datos personales)
      try {
        const realArtistIds = artistsList.filter(a => !a.isFeatured).map(a => a.id);
        if (realArtistIds.length > 0) {
          const response = await base44.functions.invoke('getArtistGiftStats', { artist_ids: realArtistIds });
          const stats = response?.data?.stats || {};
          artistsList.forEach(artist => {
            if (artist.isFeatured) return;
            const stat = stats[artist.id];
            artist.giftsCount = stat?.gift_count || 0;
            artist.giftsStars = stat?.stars || 0;
          });
        }
      } catch (error) {
        console.warn('No se pudieron cargar los regalos de los artistas:', error);
      }

      // Ordenar: primero los que están participando ahora, luego destacados, luego por seguidores
      artistsList.sort((a, b) => {
        const aActive = a.activeContest ? 1 : 0;
        const bActive = b.activeContest ? 1 : 0;
        if (aActive !== bActive) return bActive - aActive;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.followersCount - a.followersCount;
      });

      setAllArtists(artistsList);
      setFilteredArtists(artistsList);

    } catch (error) {
      console.error("Error general cargando comunidad:", error);
      setAllArtists([]);
      setFilteredArtists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (artistId, isFeatured) => {
    if (!currentUser) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    if (isFeatured) {
      navigate(createPageUrl('Contests'));
      return;
    }

    try {
      const isFollowing = followingList.includes(artistId);
      
      if (isFollowing) {
        const followers = await base44.entities.Follower.filter({
          fan_id: currentUser.id,
          artist_id: artistId
        });
        
        if (followers.length > 0) {
          await base44.entities.Follower.delete(followers[0].id);
          setFollowingList(prev => prev.filter(id => id !== artistId));
          
          setAllArtists(prev => prev.map(a => 
            a.id === artistId ? {...a, followersCount: Math.max(0, a.followersCount - 1)} : a
          ));
        }
      } else {
        const artist = allArtists.find(a => a.id === artistId);
        if (!artist) {
          alert("No se pudo encontrar al artista.");
          return;
        }

        await base44.entities.Follower.create({
          fan_id: currentUser.id,
          artist_id: artistId,
          artist_name: artist.artist_name
        });
        
        setFollowingList(prev => [...prev, artistId]);

        setAllArtists(prev => prev.map(a => 
          a.id === artistId ? {...a, followersCount: a.followersCount + 1} : a
        ));

        try {
          await base44.entities.Notification.create({
            user_id: artistId,
            title: '👥 ¡Nuevo seguidor!',
            message: `${currentUser.full_name || 'Un fan'} comenzó a seguirte`,
            type: 'profile_incomplete',
            link: createPageUrl('ArtistDashboard')
          });
        } catch (e) {
          console.error('Error creating notification:', e);
        }
      }
    } catch (error) {
      console.error('Error following artist:', error);
      alert('Error al actualizar seguimiento.');
    }
  };

  const handleViewProfile = (artist) => {
    navigate(createPageUrl('ArtistProfile') + `?id=${artist.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Comunidad de Artistas
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Todos los artistas que participan o participaron: vota por los que están en competencia y sigue a tus favoritos
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar artistas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-700">
              <strong>{filteredArtists.length}</strong> {filteredArtists.length === 1 ? 'artista' : 'artistas'} en la comunidad
              {' · '}
              <strong className="text-purple-700">{filteredArtists.filter(a => a.activeContest).length}</strong> participando ahora
            </p>
          </div>
        </motion.div>

        {filteredArtists.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {searchQuery ? 'No se encontraron artistas' : 'Aún no hay artistas'}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Intenta con otra búsqueda' : 'Pronto habrá artistas aquí'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col relative">
                  {artist.isFeatured && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Destacado
                      </Badge>
                    </div>
                  )}
                  
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
                    {artist.profile_image ? (
                      <img
                        src={artist.profile_image}
                        alt={artist.artist_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                        {artist.artist_name?.[0] || '?'}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white font-bold text-xl">{artist.artist_name}</h3>
                      {artist.genre && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {artist.genre}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {artist.country && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <CountryFlag3D country={artist.country} size="sm" />
                        <span>{artist.country}</span>
                      </div>
                    )}

                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-1">
                      {artist.bio}
                    </p>

                    {artist.activeContest ? (
                      <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 flex items-center gap-1 mb-1">
                          <Mic className="w-3.5 h-3.5" />
                          Participando ahora
                        </p>
                        <p className="text-sm text-gray-800">
                          Está participando en la sala <strong>{artist.activeContest.name}</strong>. ¡Vota por {artist.artist_name}!
                        </p>
                        <Button
                          size="sm"
                          onClick={() => navigate(createPageUrl('VotingRoom') + `?contestId=${artist.activeContest.id}`)}
                          className="mt-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Trophy className="w-3.5 h-3.5 mr-1" />
                          Votar en esta sala
                        </Button>
                      </div>
                    ) : (
                      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">
                          Sin participación activa en el concurso
                          {artist.lastContestName ? `. Participó en ${artist.lastContestName}` : ''}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-bold text-purple-600">{artist.followersCount}</div>
                          <div className="text-gray-500 text-xs">Seguidores</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-pink-600">{artist.participationsCount}</div>
                          <div className="text-gray-500 text-xs">Concursos</div>
                        </div>
                        {!artist.isFeatured && (
                          <div className="text-center">
                            <div className="font-bold text-amber-600">{artist.giftsCount || 0}</div>
                            <div className="text-gray-500 text-xs">Regalos</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!artist.isFeatured && (artist.giftsStars || 0) > 0 && (
                      <div className="inline-flex items-center gap-1 self-start mb-4 -mt-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700">
                        <Star className="w-3 h-3 fill-current" />
                        {artist.giftsStars.toFixed(2)} ⭐ recibidas de sus fans
                      </div>
                    )}

                    {currentUser && !artist.isFeatured && (artist.social_instagram || artist.social_facebook || artist.social_tiktok) && (
                      <div className="flex gap-3 mb-4 pb-4 border-b">
                        {artist.social_instagram && (
                          <a
                            href={`https://instagram.com/${artist.social_instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {artist.social_facebook && (
                          <a
                            href={artist.social_facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {artist.social_tiktok && (
                          <a
                            href={`https://tiktok.com/@${artist.social_tiktok.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-gray-700"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.10-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.40-.67.41-1.06.10-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewProfile(artist)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Perfil
                      </Button>
                      
                      {currentUser && !artist.isFeatured && (
                        <Button
                          onClick={() => handleFollow(artist.id, artist.isFeatured)}
                          variant={followingList.includes(artist.id) ? "outline" : "default"}
                          size="icon"
                          className={followingList.includes(artist.id) ? '' : 'bg-purple-600 hover:bg-purple-700'}
                        >
                          {followingList.includes(artist.id) ? (
                            <UserCheck className="w-4 h-4" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}