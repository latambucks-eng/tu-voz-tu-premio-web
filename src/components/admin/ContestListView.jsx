import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Eye, Flag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function ContestListView({ contests, onFinalize, onRefresh }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800">Inscripciones Abiertas</Badge>;
      case 'voting':
        return <Badge className="bg-purple-100 text-purple-800">En Votación</Badge>;
      case 'finalists':
        return <Badge className="bg-amber-100 text-amber-800">Ronda de Finalistas</Badge>;
      case 'finished':
        return <Badge className="bg-gray-200 text-gray-800">Finalizado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewParticipants = (contestId) => {
    navigate(createPageUrl('VotingRoom') + `?contestId=${contestId}`);
  };

  if (!contests || contests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <p>No hay convocatorias para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contests.map((contest) => (
        <Card key={contest.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{contest.name}</h3>
                  {getStatusBadge(contest.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">{contest.genre}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewParticipants(contest.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Participantes
                </Button>
                
                {(contest.status === 'voting' || contest.status === 'finalists') && (
                  <Button
                    onClick={() => onFinalize(contest)}
                    className={`flex items-center gap-2 text-white ${
                      contest.status === 'finalists'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    size="sm"
                  >
                    <Flag className="w-4 h-4" />
                    {contest.status === 'finalists' ? 'Cerrar Ronda Final' : 'Finalizar y Premiar'}
                  </Button>
                )}

                {contest.status === 'open' && (
                  <Button
                    onClick={async () => {
                      if (window.confirm(`¿Cerrar inscripciones y abrir votación para "${contest.name}"?`)) {
                        try {
                          await base44.entities.Contest.update(contest.id, {
                            status: 'voting',
                            voting_end_date: contest.end_date 
                          });
                          if (onRefresh) onRefresh();
                          alert('✅ Convocatoria ahora está en votación');
                        } catch (error) {
                          alert('❌ Error: ' + error.message);
                        }
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Clock className="w-4 h-4" />
                    Abrir Votación
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Premio Total</p>
                    <p className="font-semibold flex items-center gap-1"><DollarSign className="w-4 h-4"/>{(contest.prize_pool || 0).toFixed(2)} USD</p>
                </div>
                <div>
                    <p className="text-gray-500">Participantes</p>
                    <p className="font-semibold flex items-center gap-1"><Users className="w-4 h-4"/>{contest.current_participants || 0} / {contest.max_participants}</p>
                </div>
                <div>
                    <p className="text-gray-500">Fin de Inscripción</p>
                    <p className="font-semibold">{new Date(contest.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-gray-500">Fin de Votación</p>
                    <p className="font-semibold">{new Date(contest.voting_end_date).toLocaleDateString()}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}