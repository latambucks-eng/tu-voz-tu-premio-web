import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, Clock, Music, Star, Upload, ThumbsUp } from 'lucide-react';
import Icon3D from '@/components/brand/Icon3D';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ParticipantCard from '../components/voting/ParticipantCard';
import { useAuth } from '@/lib/AuthContext';
import { getPrizeSplit } from '@/lib/prize';
import { computeStandings } from '@/lib/finalistRound';

export default function VotingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contestIdFromRouter = searchParams.get('contestId');
  const { user: currentUser, isLoadingAuth } = useAuth();
  const [contest, setContest] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [excludedParticipants, setExcludedParticipants] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVotes, setUserVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoadingAuth) {
      loadData();
    }
  }, [isLoadingAuth, contestIdFromRouter]);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      setError(null);

      let contestId = contestIdFromRouter;
      let contestData = null;

      if (contestId && contestId !== 'undefined') {
        contestData = await base44.entities.Contest.filter({ id: contestId });
      } else {
        const activeContests = await base44.entities.Contest.filter({ status: 'active' }, '-created_date');
        contestData = activeContests && activeContests.length > 0
          ? activeContests
          : await base44.entities.Contest.list('-created_date');
      }

      const foundContest = Array.isArray(contestData) ? contestData.at(0) : contestData;

      if (!foundContest || !foundContest.id) {
        setError('contest_not_found');
        setIsLoading(false);
        return;
      }

      contestId = foundContest.id;
      let contest = foundContest;

      const allParticipants = await base44.entities.Participant.filter({
        contest_id: contestId,
        status: 'active',
        payment_verified: true
      });

      const realCount = allParticipants.length;

      contest = {
        ...contest,
        current_participants: realCount
      };

      const flaggedFinalists = allParticipants.filter(p => p.is_finalist);
      const isFinalistRound = contest.status === 'finalists' && flaggedFinalists.length > 0;
      const competitors = isFinalistRound ? flaggedFinalists : allParticipants;

      const votes = await base44.entities.Vote.filter({ contest_id: contestId });
      const sinceDate = isFinalistRound ? contest.finalists_started_at : null;

      const standings = computeStandings(competitors, votes, sinceDate);
      const totalVotesCount = standings.reduce((sum, p) => sum + p.round_votes, 0);

      const participantsWithVotes = standings.map(p => ({
        ...p,
        total_votes: p.round_votes,
        vote_percentage: p.round_percentage
      }));

      setContest({ ...contest, isFinalistRound });
      setTotalVotes(totalVotesCount);
      setParticipants(participantsWithVotes);
      setExcludedParticipants(
        isFinalistRound
          ? computeStandings(allParticipants, votes, null).filter(p => !p.is_finalist)
          : []
      );

      const roundStart = isFinalistRound && contest.finalists_started_at
        ? new Date(contest.finalists_started_at)
        : null;
      const toVotedIds = (list) => (Array.isArray(list)
        ? list
            .filter(v => !roundStart || new Date(v.created_date) >= roundStart)
            .map(v => v.participant_id)
        : []);

      if (currentUser) {
        const userVotesData = await base44.entities.Vote.filter({ voter_id: currentUser.id, contest_id: contestId });
        setUserVotes(toVotedIds(userVotesData));
      } else {
        try {
          const { getDeviceFingerprint } = await import('../components/utils/fingerprint');
          const fingerprint = getDeviceFingerprint();
          const guestVotes = await base44.entities.Vote.filter({ device_fingerprint: fingerprint, contest_id: contestId });
          setUserVotes(toVotedIds(guestVotes));
        } catch (e) {
          console.warn('⚠️ Error cargando votos de invitado:', e);
          setUserVotes([]);
        }
      }

    } catch (error) {
      console.error("❌ Error cargando VotingRoom:", error);
      setError('load_error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteUpdate = () => {
    // El componente ParticipantCard maneja su propio estado local
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Skeleton className="h-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[500px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error === 'no_contest_specified') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 mx-auto text-purple-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Selecciona una Convocatoria
          </h1>
          <p className="text-gray-600 mb-6">
            Para ver los participantes y votar, primero debes seleccionar una convocatoria activa.
          </p>
          <Button onClick={() => navigate(createPageUrl('Contests'))} className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Trophy className="w-5 h-5 mr-2" />
            Ver Convocatorias Activas
          </Button>
        </div>
      </div>
    );
  }

  if (error === 'contest_not_found') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Convocatoria no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            La convocatoria que buscas no existe o ha sido eliminada.
          </p>
          <Button onClick={() => navigate(createPageUrl('Contests'))}>
            Ver Convocatorias Activas
          </Button>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Error al cargar la convocatoria
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'Hubo un problema al cargar los datos. Por favor, intenta de nuevo.'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={loadData} variant="outline">
              Reintentar
            </Button>
            <Button onClick={() => navigate(createPageUrl('Contests'))}>
              Ver Convocatorias Activas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { total: totalPrize, winner: winnerCredits } = getPrizeSplit(contest.prize_pool);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                {contest.name}
              </h1>
              <p className="text-gray-600 mt-2">{contest.genre}</p>
            </div>
            <Badge className={`text-lg px-4 py-2 ${
              contest.status === 'voting' ? 'bg-purple-100 text-purple-800' :
              contest.status === 'finalists' ? 'bg-amber-100 text-amber-800' :
              contest.status === 'finished' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {contest.status === 'voting' && <><Clock className="w-4 h-4 mr-2 inline" />En Votación</>}
              {contest.status === 'finalists' && <><Trophy className="w-4 h-4 mr-2 inline" />Ronda de Finalistas</>}
              {contest.status === 'finished' && <><Trophy className="w-4 h-4 mr-2 inline" />Finalizado</>}
              {contest.status === 'open' && <>Inscripciones Abiertas</>}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Icon3D icon={DollarSign} size="md" gradient="bg-gradient-to-br from-emerald-300 via-green-500 to-emerald-700" className="mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{totalPrize.toFixed(2)} USD</div>
                <div className="text-sm text-gray-600">Premio del Concurso</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Icon3D icon={Trophy} size="md" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600" className="mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{winnerCredits.toFixed(2)} ⭐</div>
                <div className="text-sm text-gray-600">Ganador de la sala</div>
                <div className="text-xs text-gray-500 mt-1">= ${winnerCredits.toFixed(2)} USD</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Icon3D icon={Users} size="md" gradient="bg-gradient-to-br from-violet-400 via-purple-500 to-purple-700" className="mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">
                  {contest.current_participants || 0}/{contest.max_participants}
                </div>
                <div className="text-sm text-gray-600">Participantes</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Icon3D icon={ThumbsUp} size="md" gradient="bg-gradient-to-br from-pink-400 via-pink-500 to-rose-600" className="mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{totalVotes}</div>
                <div className="text-sm text-gray-600">{contest.isFinalistRound ? 'Votos en esta ronda' : 'Votos emitidos'}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icon3D icon={Trophy} size="xs" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600" />
                💰 Distribución Transparente del Premio
              </h3>
              <div className="text-sm">
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <p className="text-gray-600 mb-1">🏆 Artista Ganador de la sala</p>
                  <p className="text-lg font-bold text-yellow-900">${winnerCredits.toFixed(2)} USD</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center">
                ✅ Premio total: ${totalPrize.toFixed(2)} USD, que se entrega íntegro al ganador
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {!currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 border-2 border-green-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    ¡Vota a tu artista favorito! 🎤
                  </h3>
                </div>
                <div className="space-y-2 text-sm md:text-base text-gray-700">
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span><strong>No necesitas inscribirte ni pagar.</strong> Solo vota y comparte los perfiles que más te gusten.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span>Los fans apoyan <strong>votando gratis</strong> y, si quieren, con <strong>regalos a sus artistas</strong>.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span>Premio actual de la sala: <strong className="text-purple-600">${totalPrize.toFixed(2)}</strong> para el artista más votado</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-center text-sm text-gray-600 mb-3">
                      💡 Regístrate gratis para votar y apoyar a tus artistas
                    </p>
                    <Button 
                      onClick={() => base44.auth.redirectToLogin(window.location.href)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
                    >
                      Registrarme Gratis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentUser && currentUser.user_type === 'fan' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-600 fill-blue-600" />
                  <div>
                    <p className="font-bold text-gray-900">
                      ¡Comparte el perfil de tu artista favorito!
                    </p>
                    <p className="text-sm text-gray-600">
                      Cada voto y cada regalo ayudan a que gane la sala
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentUser && currentUser.user_type === 'artist' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white border-4 border-yellow-400 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                      <Trophy className="w-12 h-12 text-purple-900" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                      🎤 ¡ARTISTAS! Gana ${winnerCredits.toFixed(2)} USD
                    </h3>
                    <p className="text-purple-100 text-base md:text-lg mb-4">
                      <strong className="text-yellow-300">¿Ya estás participando?</strong> Comparte tu video y perfil para recibir más votos. El artista con más votos gana el <strong className="text-yellow-300">premio de la sala (${winnerCredits.toFixed(2)} USD), que la organización le paga directo por PayPal o Binance</strong>.
                    </p>
                    <p className="text-purple-100 text-sm mb-4">
                      💡 <strong>¡Cualquiera puede votar sin registrarse!</strong> Comparte en redes sociales para maximizar tus votos.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {!participants.some(p => p.artist_id === currentUser.id) ? (
                        <Button 
                          size="lg"
                          className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold text-lg px-8"
                          onClick={() => navigate(createPageUrl('Participate') + `?contestId=${contest.id}`)}
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          ¡Inscríbete Ahora!
                        </Button>
                      ) : (
                        <Button 
                          size="lg"
                          variant="secondary" 
                          className="bg-white text-purple-700 hover:bg-purple-50 font-bold"
                          onClick={() => navigate(createPageUrl('ArtistDashboard'))}
                        >
                          Ver mi Panel y Compartir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {contest.status === 'open' && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-yellow-800">Inscripciones Abiertas — Votación No Iniciada</p>
              <p className="text-sm text-yellow-700">La votación se habilitará cuando el administrador cambie el estado de la convocatoria a "En Votación".</p>
            </div>
          </div>
        )}

        {contest.status === 'finalists' && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Trophy className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-amber-900">⚖️ Ronda de finalistas: la sala terminó empatada</p>
                <p className="text-sm text-amber-800 mt-1">
                  Solo los artistas que empataron en el primer lugar siguen en competencia y la votación
                  continúa entre ellos. Los votos de esta ronda se cuentan desde cero para definir al ganador.
                </p>
                {excludedParticipants.length > 0 && (
                  <div className="mt-3 bg-white/70 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-2">
                      No continúan en esta ronda (participantes destacados)
                    </p>
                    <ul className="space-y-1">
                      {excludedParticipants.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 text-sm text-gray-700">
                          <span className="truncate">{p.artist_name}</span>
                          <span className="flex-shrink-0 font-semibold">
                            {p.round_votes} votos · {p.round_percentage.toFixed(1)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {participants.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Aún no hay participantes en esta convocatoria</h3>
              <p className="text-gray-500 mb-6">Los videos y estadísticas de la convocatoria aparecerán aquí una vez que haya participantes.</p>
              {currentUser?.user_type === 'artist' && (
                <Button onClick={() => navigate(createPageUrl('Participate') + `?contestId=${contest.id}`)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Ser el Primero en Participar
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 md:pb-0">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                totalVotes={totalVotes}
                onVote={handleVoteUpdate}
                hasVoted={userVotes.includes(participant.id)}
                currentUser={currentUser}
                contestStatus={contest.status}
                voteRound={contest.isFinalistRound ? (contest.tie_round || 1) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
