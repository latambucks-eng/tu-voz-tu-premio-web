import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Scale, Trophy, AlertTriangle, Users } from 'lucide-react';
import { finalizeContest, loadContestStandings, detectTie, getRunnerUps } from '@/lib/finalistRound';

export default function FinalizeContestDialog({ contest, open, onClose, onDone }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [standings, setStandings] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isFinalistRound, setIsFinalistRound] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open && contest) {
      loadPreview();
    }
  }, [open, contest?.id]);

  const loadPreview = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await loadContestStandings(contest);
      setStandings(data.standings);
      setTotalVotes(data.totalVotes);
      setIsFinalistRound(data.isFinalistRound);
    } finally {
      setIsLoading(false);
    }
  };

  const { leaders, hasTie } = detectTie(standings);
  const winner = !hasTie && leaders.length === 1 ? leaders[0] : null;
  const runnerUps = hasTie ? [] : getRunnerUps(standings);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const outcome = await finalizeContest(contest);
      setResult(outcome);
      if (onDone) onDone();
    } finally {
      setIsProcessing(false);
    }
  };

  const actionLabel = () => {
    if (hasTie && !isFinalistRound) return 'Abrir Ronda de Finalistas';
    if (hasTie && isFinalistRound) return 'Abrir Nueva Ronda de Desempate';
    return 'Declarar Ganador';
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Cerrar la sala: {contest?.name}
          </DialogTitle>
          <DialogDescription>
            {isFinalistRound
              ? 'Ronda de finalistas: solo cuentan los votos emitidos desde que empezó esta ronda.'
              : 'Resultado de la votación general de la sala.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-500" />
            <p className="mt-2 text-gray-500 text-sm">Calculando votos y porcentajes...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className={`rounded-lg border-2 p-4 ${
              result.outcome === 'winner' ? 'bg-green-50 border-green-300' :
              result.outcome === 'no_votes' || result.outcome === 'no_participants' ? 'bg-yellow-50 border-yellow-300' :
              'bg-purple-50 border-purple-300'
            }`}>
              {result.outcome === 'winner' && (
                <>
                  <p className="font-bold text-green-900">🏆 Ganador: {result.winner.artist_name}</p>
                  <p className="text-sm text-green-800 mt-1">
                    {result.maxVotes} votos ({result.totalVotes > 0 ? ((result.maxVotes / result.totalVotes) * 100).toFixed(1) : '0'}% de la sala)
                    · Premio: ${result.prizeAmount.toFixed(2)} USD
                  </p>
                  {result.runnerUps?.length > 0 && (
                    <p className="text-sm text-green-800 mt-2">
                      🥈 Finalista destacado: {result.runnerUps.map(r => `${r.artist_name} (${r.round_percentage.toFixed(1)}%)`).join(' · ')} — se destaca como finalista, sin premio.
                    </p>
                  )}
                  <p className="text-xs text-green-700 mt-2">
                    La sala quedó finalizada y el ganador fue notificado. El resto queda como participante destacado.
                  </p>
                </>
              )}

              {result.outcome === 'tie_round' && (
                <>
                  <p className="font-bold text-purple-900">⚖️ Empate en el primer lugar: se abrió la ronda de finalistas</p>
                  <ul className="mt-2 space-y-1 text-sm text-purple-900">
                    {result.leaders.map(l => (
                      <li key={l.id}>
                        · {l.artist_name}: {l.round_votes} votos ({l.round_percentage.toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-purple-800 mt-2">
                    Los demás artistas quedaron descartados de esta ronda final como participantes destacados. La votación continúa en la sala.
                  </p>
                </>
              )}

              {result.outcome === 'new_tie_round' && (
                <>
                  <p className="font-bold text-purple-900">⚖️ El empate se mantiene: se abrió una nueva ronda de desempate</p>
                  <ul className="mt-2 space-y-1 text-sm text-purple-900">
                    {result.leaders.map(l => (
                      <li key={l.id}>
                        · {l.artist_name}: {l.round_votes} votos ({l.round_percentage.toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-purple-800 mt-2">La votación se reinicia solo entre los finalistas empatados.</p>
                </>
              )}

              {result.outcome === 'no_votes' && (
                <p className="font-bold text-yellow-900">⚠️ Todavía no hay votos en esta ronda, no se puede cerrar la sala.</p>
              )}

              {result.outcome === 'no_participants' && (
                <p className="font-bold text-yellow-900">⚠️ No hay participantes activos en esta sala.</p>
              )}
            </div>

            <Button onClick={onClose} className="w-full">Cerrar</Button>
          </div>
        ) : standings.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No hay participantes activos en esta sala.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border divide-y">
              {standings.map((p, index) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-gray-400 w-5">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.artist_name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.song_title}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{p.round_votes} votos</p>
                    <p className="text-xs text-purple-600 font-semibold">{p.round_percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>

            {totalVotes === 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="font-bold text-yellow-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Todavía no hay votos en esta ronda
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  Para cerrar la sala y declarar un ganador necesitas al menos un voto registrado.
                </p>
              </div>
            ) : hasTie ? (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                <p className="font-bold text-purple-900 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Empate en el primer lugar ({leaders[0].round_votes} votos cada uno)
                </p>
                <p className="text-sm text-purple-800 mt-1">
                  {leaders.map(l => l.artist_name).join(' · ')}
                </p>
                <p className="text-sm text-purple-800 mt-2">
                  Nadie gana todavía: los artistas empatados pasan a la ronda de finalistas y la votación continúa solo entre ellos.
                  El resto queda descartado de esa ronda como participante destacado.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <p className="font-bold text-green-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Ganador único: {winner?.artist_name}
                </p>
                <p className="text-sm text-green-800 mt-1">
                  {winner?.round_votes} votos ({winner?.round_percentage.toFixed(1)}% de la sala). Recibe el 100% del premio.
                </p>
                {runnerUps.length > 0 && (
                  <p className="text-sm text-green-800 mt-2">
                    🥈 Finalista destacado (sin premio): {runnerUps.map(r => `${r.artist_name} (${r.round_percentage.toFixed(1)}%)`).join(' · ')}
                  </p>
                )}
                <p className="text-xs text-green-700 mt-2">
                  Los demás artistas quedan como participantes destacados.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleConfirm}
                disabled={isProcessing || totalVotes === 0}
                className={`flex-1 ${hasTie ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isProcessing ? 'Procesando...' : actionLabel()}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              {hasTie
                ? 'Los votos de la ronda de finalistas se cuentan desde cero para desempatar.'
                : 'Al confirmar, la sala queda finalizada y el ganador recibe la notificación del premio.'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}