import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Star, ExternalLink, Instagram, Facebook, MapPin, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import PastEditionWinners from '@/components/winners/PastEditionWinners';
import ContestResultBoard from '@/components/winners/ContestResultBoard';

export default function Winners() {
  const [winners, setWinners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWinners();
  }, []);

  const loadWinners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allWinners = await base44.entities.Winner.list('-created_date');
      const visibleWinners = Array.isArray(allWinners) 
        ? allWinners.filter(w => w.is_hidden !== true) 
        : [];
      setWinners(visibleWinners);
    } catch (error) {
      console.error("Error loading winners:", error);
      setError('Error al cargar los ganadores. Por favor, recarga la página.');
      setWinners([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[500px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">
              Salón de la Fama
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Celebrando a nuestros ganadores destacados
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-800">{error}</p>
            <Button onClick={loadWinners} className="mt-4">
              Reintentar
            </Button>
          </div>
        )}

        {winners.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Próximamente...
              </h3>
              <p className="text-gray-500 mb-6">
                Los ganadores de las convocatorias aparecerán aquí. ¡Sé el primero en ganar!
              </p>
              <Link to={createPageUrl('Contests')}>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Convocatorias Activas
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner, index) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 overflow-hidden">
                  {index < 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        index === 0 ? 'bg-yellow-400' :
                        index === 1 ? 'bg-gray-300' :
                        'bg-orange-400'
                      }`}>
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="relative h-48 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center overflow-hidden">
                    {winner.artist_image ? (
                      <img 
                        src={winner.artist_image} 
                        alt={winner.artist_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold">
                        {winner.artist_name?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-2xl">{winner.artist_name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {winner.genre}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-green-600" />
                        {winner.total_votes} votos
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Convocatoria Ganada:</h4>
                      <p className="text-gray-600">{winner.contest_name}</p>
                    </div>

                    {winner.song_title && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          Canción Ganadora:
                        </h4>
                        <p className="text-gray-600">{winner.song_title}</p>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Premio Ganado</p>
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        <p className="text-2xl font-bold text-yellow-700">
                          ${parseFloat(winner.prize_amount).toFixed(2)} USD
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Premio del concurso · pago directo al ganador
                      </p>
                    </div>

                    <ContestResultBoard contestId={winner.contest_id} winner={winner} />

                    {(winner.social_instagram || winner.social_facebook || winner.social_tiktok) && (
                      <div className="flex justify-center gap-3 pt-2">
                        {winner.social_instagram && (
                          <a
                            href={`https://instagram.com/${winner.social_instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700 transition-colors"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {winner.social_facebook && (
                          <a
                            href={winner.social_facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}

                    {(winner.youtube_video_id || winner.video_url) && (
                      <Link to={createPageUrl('ArtistProfile') + `?id=${winner.artist_id}`}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver Perfil Completo
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <PastEditionWinners />
      </div>
    </div>
  );
}