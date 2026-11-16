import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

function hashValue(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'srv_' + Math.abs(hash).toString(36) + '_' + value.length.toString(36);
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const participantId = typeof body.participant_id === 'string' ? body.participant_id.trim() : '';
    if (!participantId) {
      return Response.json({ success: false, error: 'invalid_participant' }, { status: 400 });
    }

    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));

    const participant = await base44.asServiceRole.entities.Participant
      .get(participantId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!participant) {
      return Response.json({ success: false, error: 'participant_not_found' }, { status: 404 });
    }
    if (participant.status !== 'active' || participant.payment_verified !== true) {
      return Response.json({ success: false, error: 'participant_not_open' });
    }

    const contest = await base44.asServiceRole.entities.Contest
      .get(participant.contest_id)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!contest) {
      return Response.json({ success: false, error: 'contest_not_found' }, { status: 404 });
    }
    if (contest.status !== 'voting' && contest.status !== 'finalists') {
      return Response.json({ success: false, error: 'voting_closed' });
    }

    if (user && user.user_type === 'artist') {
      return Response.json({ success: false, error: 'artists_cannot_vote' });
    }

    const round = contest.status === 'finalists' ? (contest.tie_round || 1) : null;

    // Huella del dispositivo: la que envía el navegador + una del servidor (IP + navegador).
    // Así el control funciona aunque el navegador bloquee el almacenamiento local.
    const ip = req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    const userAgent = req.headers.get('user-agent') || '';
    const serverFingerprint = hashValue(`${ip}|${userAgent}`);
    const clientFingerprint = typeof body.device_fingerprint === 'string' ? body.device_fingerprint.trim() : '';

    const sameRound = (vote) => (vote.round || null) === round;

    if (user) {
      const userVotes = await base44.asServiceRole.entities.Vote.filter({
        participant_id: participantId,
        voter_id: user.id
      });
      if ((userVotes || []).some(sameRound)) {
        return Response.json({ success: false, error: 'already_voted' });
      }
    }

    const fingerprints = [clientFingerprint, serverFingerprint].filter(Boolean);
    if (fingerprints.length > 0) {
      const deviceVotes = await base44.asServiceRole.entities.Vote.filter({
        participant_id: participantId,
        $or: [
          { device_fingerprint: { $in: fingerprints } },
          { server_fingerprint: serverFingerprint }
        ]
      });
      if ((deviceVotes || []).some(sameRound)) {
        return Response.json({ success: false, error: 'already_voted' });
      }
    }

    const voteData = {
      participant_id: participantId,
      contest_id: participant.contest_id,
      rating: 5,
      is_guest_vote: !user,
      device_fingerprint: clientFingerprint || serverFingerprint,
      server_fingerprint: serverFingerprint,
      voter_ip: ip || undefined
    };
    if (user) voteData.voter_id = user.id;
    if (round !== null) voteData.round = round;

    await base44.asServiceRole.entities.Vote.create(voteData);

    // Mantener el contador del participante alineado con los votos reales
    await base44.asServiceRole.entities.Participant.update(participantId, {
      total_votes: (participant.total_votes || 0) + 1
    });

    return Response.json({ success: true, error: null });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}