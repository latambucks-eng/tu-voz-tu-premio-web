import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Trophy, Medal, Star, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ContestResultBoard({ contestId, winner }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [contestId]);

  const loadResult = async () => {
    setIsLoading(true);
    try {
      const [participants, voteData] = await Promise.all([
        base44.entities.Participant.filter({
          contest_id: contestId,
          status: 'active',
          payment_verified: true
        }),
        base44.entities.Vote.aggregate({
          query: { contest_id: contestId },
          groupBy: 'participant_id'
        })
      ]);

      const counts = {};
      (voteData?.rows || []).forEach(r => {
        counts[r.participant_id] = r.count || 0;
      });

      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

      const sorted = (participants || [])
        .map(p => {
          const votes = counts[p.id] || 0;
          return {
            id: p.id,
            artist_id: p.artist_id,
            artist_name: p.artist_name || 'Artista',
            votes,
            percentage: total > 0 ? (votes / total) * 100 : 0,
            is_finalist: p.is_finalist === true
          };
        })
        .sort((a, b) => b.votes - a.votes);

      setRows(sorted);
    } catch (error) {
      console.error('Error loading contest result:', error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <span className="text-xs">Cargando resultado de la sala...</span>
      </div>
    );
  }

  if (rows.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-4">
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
        <Trophy className="w-4 h-4 text-yellow-600" />
        Resultado transparente de la sala
      </h4>

      <div className="space-y-1">
        {rows.map((row, index) => {
          const isWinner = (row.artist_id && winner.artist_id && row.artist_id === winner.artist_id) ||
            (!winner.artist_id && row.artist_name === winner.artist_name);
          const isFinalist = !isWinner && row.is_finalist;
          const sharedRank = rows.filter(r => r.votes === row.votes).length > 1;

          return (
            <div
              key={row.id}
              className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs ${
                isWinner ? 'bg-yellow-50 border border-yellow-200' :
                isFinalist ? 'bg-amber-50 border border-amber-200' :
                'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-4 text-center font-bold text-gray-400 flex-shrink-0">
                  {sharedRank ? '=' : index + 1}
                </span>
                {isWinner ? (
                  <Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500 flex-shrink-0" />
                ) : isFinalist ? (
                  <Medal className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                ) : null}
                <span className={`truncate ${isWinner ? 'font-bold text-yellow-900' : 'text-gray-700'}`}>
                  {row.artist_name}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-semibold text-gray-900">{row.votes} votos</span>
                <span className="text-purple-600 font-semibold">{row.percentage.toFixed(1)}%</span>
                {isWinner && (
                  <Badge className="bg-yellow-200 text-yellow-900 text-[10px] px-1.5 py-0">Ganador</Badge>
                )}
                {isFinalist && (
                  <Badge className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0">Finalista</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
        Gana el porcentaje más alto de la sala y recibe el 100% del premio. El segundo porcentaje más alto
        queda destacado como finalista sin premio, y el resto como participante destacado. Si hay empate en
        el primer lugar, se abre una ronda de finalistas para definir al ganador.
      </p>
    </div>
  );
}