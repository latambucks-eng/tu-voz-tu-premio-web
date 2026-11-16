import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { getPrizeSplit } from '@/lib/prize';

/**
 * Cálculo de posiciones de una sala.
 * Si `sinceDate` está definido solo se cuentan los votos emitidos desde ese momento
 * (ronda de finalistas). Devuelve votos y porcentaje de cada artista.
 */
export function computeStandings(participants, votes, sinceDate = null) {
  const since = sinceDate ? new Date(sinceDate) : null;
  const ids = new Set(participants.map(p => p.id));

  const relevantVotes = (votes || []).filter(vote => {
    if (!ids.has(vote.participant_id)) return false;
    if (!since) return true;
    return new Date(vote.created_date) >= since;
  });

  const counts = {};
  relevantVotes.forEach(vote => {
    counts[vote.participant_id] = (counts[vote.participant_id] || 0) + 1;
  });

  const totalVotes = relevantVotes.length;

  return participants
    .map(p => {
      const round_votes = counts[p.id] || 0;
      return {
        ...p,
        round_votes,
        round_percentage: totalVotes > 0 ? (round_votes / totalVotes) * 100 : 0
      };
    })
    .sort((a, b) => b.round_votes - a.round_votes);
}

/**
 * Detecta si hay un único ganador o empate en el primer lugar.
 */
export function detectTie(standings) {
  const maxVotes = standings.length > 0 ? standings[0].round_votes : 0;
  const leaders = standings.filter(p => p.round_votes === maxVotes && maxVotes > 0);
  return { maxVotes, leaders, hasTie: leaders.length > 1 };
}

/**
 * Devuelve el/los artistas con el segundo porcentaje más alto de la sala.
 * Ese artista se destaca como finalista, pero no recibe el premio.
 */
export function getRunnerUps(standings) {
  if (!standings || standings.length === 0) return [];
  const maxVotes = standings[0].round_votes;
  const next = standings.find(p => p.round_votes < maxVotes && p.round_votes > 0);
  if (!next) return [];
  return standings.filter(p => p.round_votes === next.round_votes);
}

/**
 * Carga participantes y votos de la sala y devuelve las posiciones de la ronda vigente.
 */
export async function loadContestStandings(contest) {
  const isFinalistRound = contest.status === 'finalists';

  const activeParticipants = await base44.entities.Participant.filter({
    contest_id: contest.id,
    status: 'active',
    payment_verified: true
  });

  const votes = await base44.entities.Vote.filter({ contest_id: contest.id });

  const flagged = activeParticipants.filter(p => p.is_finalist);
  const competitors = isFinalistRound && flagged.length > 0 ? flagged : activeParticipants;

  const sinceDate = isFinalistRound ? contest.finalists_started_at : null;
  const standings = computeStandings(competitors, votes, sinceDate);
  const totalVotes = standings.reduce((sum, p) => sum + p.round_votes, 0);

  return {
    isFinalistRound: isFinalistRound && flagged.length > 0,
    activeParticipants,
    standings,
    totalVotes,
    eliminated: activeParticipants.filter(p => p.is_eliminated)
  };
}

/**
 * Abre la ronda de finalistas: solo los artistas empatados siguen compitiendo
 * y el resto queda descartado de esa ronda.
 */
export async function startFinalistRound(contest, leaders, eliminated) {
  const now = new Date().toISOString();

  await base44.entities.Contest.update(contest.id, {
    status: 'finalists',
    finalists_started_at: now,
    tie_round: (contest.tie_round || 0) + 1
  });

  await Promise.all(leaders.map(p => base44.entities.Participant.update(p.id, {
    is_finalist: true,
    is_eliminated: false
  })));

  if (eliminated.length > 0) {
    await Promise.all(eliminated.map(p => base44.entities.Participant.update(p.id, {
      is_finalist: false,
      is_eliminated: true
    })));
  }

  const votingUrl = createPageUrl('VotingRoom') + `?contestId=${contest.id}`;

  await Promise.all(leaders.map(p => base44.entities.Notification.create({
    user_id: p.artist_id,
    title: '⚖️ Empate: pasas a la ronda de finalistas',
    message: `Empataste en el primer lugar de "${contest.name}" con ${p.round_votes} votos (${p.round_percentage.toFixed(1)}% de la sala). La votación continúa solo entre los finalistas: comparte tu perfil para conseguir más votos.`,
    type: 'contest_reminder',
    link: votingUrl
  }).catch(() => null)));

  await Promise.all(eliminated.map(p => base44.entities.Notification.create({
    user_id: p.artist_id,
    title: 'Ronda de finalistas en curso',
    message: `La sala "${contest.name}" quedó empatada en el primer lugar, así que se abrió una ronda de finalistas solo con los artistas empatados. Tu participación terminó con ${p.round_votes} votos (${p.round_percentage.toFixed(1)}%) y quedas registrado como participante destacado.`,
    type: 'contest_reminder',
    link: votingUrl
  }).catch(() => null)));
}

/**
 * Declara al único ganador: registra premio, transacción, notificación y cierra la sala.
 */
async function declareContestWinner(contest, winner, maxVotes) {
  const { total: totalPrize, winner: prizeAmount } = getPrizeSplit(contest.prize_pool);

  const existing = await base44.entities.Winner.filter({
    contest_id: contest.id,
    participant_id: winner.id
  });

  if (!existing || existing.length === 0) {
    await base44.entities.Winner.create({
      contest_id: contest.id,
      contest_name: contest.name,
      genre: contest.genre,
      participant_id: winner.id,
      artist_id: winner.artist_id,
      artist_name: winner.artist_name || 'Artista',
      artist_image: winner.artist_image || '',
      artist_bio: winner.artist_bio || '',
      youtube_url: winner.youtube_url || '',
      youtube_video_id: winner.youtube_video_id || '',
      video_url: winner.video_url || '',
      song_title: winner.song_title || 'Sin título',
      total_votes: maxVotes || winner.total_votes || 0,
      average_rating: winner.average_rating || 0,
      prize_amount: prizeAmount,
      prize_paid: false,
      social_instagram: winner.social_instagram || '',
      social_facebook: winner.social_facebook || '',
      social_tiktok: winner.social_tiktok || ''
    });
  }

  const existingFeatured = await base44.entities.FeaturedArtist.filter({ artist_name: winner.artist_name });
  if (!existingFeatured || existingFeatured.length === 0) {
    await base44.entities.FeaturedArtist.create({
      artist_name: winner.artist_name,
      bio: winner.artist_bio || `Ganador del concurso ${contest.name}`,
      profile_image: winner.artist_image || '',
      country: winner.artist_country || 'Argentina',
      genre: contest.genre,
      social_instagram: winner.social_instagram || '',
      social_facebook: winner.social_facebook || '',
      social_tiktok: winner.social_tiktok || '',
      followers_count: winner.total_votes || 0,
      participations_count: 1,
      is_active: true,
      order: 0
    });
  }

  await base44.entities.Transaction.create({
    user_id: winner.artist_id,
    type: 'prize_won',
    amount: prizeAmount,
    description: `Premio por ganar "${contest.name}" con ${maxVotes} votos`,
    payment_method: 'system',
    status: 'approved',
    related_contest_id: contest.id
  });

  await base44.entities.Notification.create({
    user_id: winner.artist_id,
    title: '🏆 ¡Ganaste el Concurso!',
    message: `¡Ganaste "${contest.name}" con ${maxVotes} votos! Premio: $${prizeAmount.toFixed(2)} USD (de un total de $${totalPrize.toFixed(2)}), que la organización abona a tu cuenta de PayPal o Binance dentro de los 10 días hábiles. ¡Ahora eres Artista Destacado!`,
    type: 'winner',
    link: createPageUrl('ArtistDashboard')
  }).catch(() => null);

  await base44.entities.Contest.update(contest.id, {
    status: 'finished',
    finalists_started_at: null
  });

  return { prizeAmount, totalPrize };
}

/**
 * Marca las posiciones finales de una sala con ganador único:
 * - Ganador: se lleva el premio.
 * - Segundo porcentaje más alto: queda destacado como finalista, sin premio.
 * - El resto: participantes destacados.
 */
async function markFinalPositions(contest, winner, finalists, destacados) {
  await base44.entities.Participant.update(winner.id, {
    is_finalist: false,
    is_eliminated: false
  });

  if (finalists.length > 0) {
    await Promise.all(finalists.map(p => base44.entities.Participant.update(p.id, {
      is_finalist: true,
      is_eliminated: false
    })));
  }

  if (destacados.length > 0) {
    await Promise.all(destacados.map(p => base44.entities.Participant.update(p.id, {
      is_finalist: false,
      is_eliminated: true
    })));
  }

  const votingUrl = createPageUrl('VotingRoom') + `?contestId=${contest.id}`;

  await Promise.all(finalists.map(p => base44.entities.Notification.create({
    user_id: p.artist_id,
    title: '🥈 Finalista destacado de la sala',
    message: `En "${contest.name}" obtuviste el segundo porcentaje más alto con ${p.round_votes} votos (${p.round_percentage.toFixed(1)}% de la sala). Esta posición no lleva premio en efectivo, pero quedas destacado como finalista de la convocatoria.`,
    type: 'contest_reminder',
    link: votingUrl
  }).catch(() => null)));

  await Promise.all(destacados.map(p => base44.entities.Notification.create({
    user_id: p.artist_id,
    title: 'Participación destacada',
    message: `La sala "${contest.name}" ya tiene ganador. Tu participación cerró con ${p.round_votes} votos (${p.round_percentage.toFixed(1)}%) y quedas registrado como participante destacado.`,
    type: 'contest_reminder',
    link: votingUrl
  }).catch(() => null)));
}

/**
 * Cierra la votación de la sala aplicando la regla de empate:
 * - Un solo líder → gana y se lleva el 100% del premio; el segundo porcentaje
 *   más alto queda como finalista destacado (sin premio) y el resto como
 *   participantes destacados.
 * - Empate entre 2 o más → se abre la ronda de finalistas (o una nueva ronda
 *   si el empate persiste) y el resto queda descartado de esa ronda.
 */
export async function finalizeContest(contest) {
  const { isFinalistRound, activeParticipants, standings, totalVotes } = await loadContestStandings(contest);

  if (standings.length === 0) {
    return { outcome: 'no_participants' };
  }

  if (totalVotes === 0) {
    return { outcome: 'no_votes', standings, totalVotes, isFinalistRound };
  }

  const { maxVotes, leaders, hasTie } = detectTie(standings);

  if (hasTie) {
    const eliminated = isFinalistRound
      ? activeParticipants.filter(p => p.is_eliminated || !leaders.some(l => l.id === p.id))
      : activeParticipants.filter(p => !leaders.some(l => l.id === p.id));

    await startFinalistRound(contest, leaders, eliminated);

    return {
      outcome: isFinalistRound ? 'new_tie_round' : 'tie_round',
      leaders,
      maxVotes,
      totalVotes
    };
  }

  const winner = leaders[0];
  const runnerUps = getRunnerUps(standings);
  const destacados = standings.filter(p =>
    p.id !== winner.id && !runnerUps.some(r => r.id === p.id)
  );

  const { prizeAmount } = await declareContestWinner(contest, winner, maxVotes);
  await markFinalPositions(contest, winner, runnerUps, destacados);

  return { outcome: 'winner', winner, runnerUps, destacados, maxVotes, totalVotes, prizeAmount };
}