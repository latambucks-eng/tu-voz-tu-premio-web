import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign, Calendar, Music, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { getPrizeSplit } from '@/lib/prize';
import Icon3D from '@/components/brand/Icon3D';

export default function ContestCard({ contest, index }) {
  const isFull = contest.current_participants >= contest.max_participants;
  const isOpen = contest.status === 'open';
  const isVoting = contest.status === 'voting';
  const isFinalistRound = contest.status === 'finalists';
  const isFinished = contest.status === 'finished';
  
  const { total: totalPrize } = getPrizeSplit(contest.prize_pool);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 h-full flex flex-col">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl">{contest.name}</CardTitle>
            {isOpen && !isFull && (
              <Badge className="bg-green-500 text-white">Abierto</Badge>
            )}
            {isVoting && (
              <Badge className="bg-blue-500 text-white">Votación</Badge>
            )}
            {isFinalistRound && (
              <Badge className="bg-amber-500 text-white">Finalistas</Badge>
            )}
            {isFinished && (
              <Badge className="bg-gray-500 text-white">Finalizado</Badge>
            )}
            {isFull && isOpen && (
              <Badge className="bg-red-500 text-white">Lleno</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-purple-100">
            <Music className="w-4 h-4" />
            <span className="text-sm">{contest.genre}</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 flex flex-col">
          <p className="text-gray-600 mb-6 flex-1">{contest.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Icon3D icon={DollarSign} size="sm" gradient="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ${totalPrize.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Premio del Concurso</div>
            </div>

            <div className="bg-pink-50 rounded-lg p-4 text-center">
              <Icon3D icon={Users} size="sm" gradient="bg-gradient-to-br from-pink-400 via-pink-500 to-rose-600" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {contest.current_participants}/{contest.max_participants}
              </div>
              <div className="text-xs text-gray-600">Participantes</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200 flex items-center gap-2 text-xs text-gray-700">
            <Icon3D icon={Trophy} size="xs" gradient="bg-gradient-to-br from-amber-300 to-yellow-500" className="flex-shrink-0" />
            <span>El ganador de la sala recibe el premio completo.</span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            {contest.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Inicio: {new Date(contest.start_date).toLocaleDateString('es-AR')}</span>
              </div>
            )}
            {contest.voting_end_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Fin votación: {new Date(contest.voting_end_date).toLocaleDateString('es-AR')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {(isOpen || isVoting || isFinalistRound) && (
              <Link to={createPageUrl('VotingRoom') + `?contestId=${contest.id}`} className="w-full">
                <Button variant="outline" className="w-full whitespace-normal text-center">
                  <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                  Ver Participantes
                </Button>
              </Link>
            )}

            {isOpen && !isFull && (
              <Link to={createPageUrl('Participate') + `?contestId=${contest.id}`} className="w-full">
                <Button className="w-full whitespace-normal text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Trophy className="w-4 h-4 mr-2 flex-shrink-0" />
                  Inscribirme
                </Button>
              </Link>
            )}

            {isVoting && (
              <Link to={createPageUrl('VotingRoom') + `?contestId=${contest.id}`} className="w-full">
                <Button className="w-full whitespace-normal text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Star className="w-4 h-4 mr-2 flex-shrink-0" />
                  Votar Ahora
                </Button>
              </Link>
            )}
            {isFinalistRound && (
              <Link to={createPageUrl('VotingRoom') + `?contestId=${contest.id}`} className="w-full">
                <Button className="w-full whitespace-normal text-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Star className="w-4 h-4 mr-2 flex-shrink-0" />
                  Votar Finalistas
                </Button>
              </Link>
            )}

            {isFinished && (
              <Link to={createPageUrl('Winners')} className="w-full">
                <Button className="w-full whitespace-normal text-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <Trophy className="w-4 h-4 mr-2 flex-shrink-0" />
                  Ver Ganador
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}