import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ContestCard from '../components/contests/ContestCard';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await base44.entities.Contest.list('-created_date');
      const contestsArray = Array.isArray(data) ? data : [];
      
      // 🔥 RECALCULAR CONTADOR REAL DE PARTICIPANTES (el premio lo define el admin)
      const allParticipants = await base44.entities.Participant.list();
      
      const contestsWithRealCounts = contestsArray.map(contest => {
        const activeParticipants = allParticipants.filter(p =>
          p.contest_id === contest.id &&
          p.status === 'active' &&
          p.payment_verified === true
        );
        
        return {
          ...contest,
          current_participants: activeParticipants.length
        };
      });
      
      setContests(contestsWithRealCounts);
    } catch (error) {
      console.error("Error loading contests:", error);
      setError('Error al cargar las convocatorias. Por favor, recarga la página.');
      setContests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContests = selectedGenre === 'all' 
    ? contests 
    : contests.filter(c => c && c.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-2">
            Convocatorias Activas
          </h1>
          <p className="text-base md:text-xl text-gray-600 px-2">
            Elige tu categoría y empieza a competir
          </p>
        </motion.div>

        <div className="mb-6 md:mb-8 flex justify-center px-2">
          <Tabs value={selectedGenre} onValueChange={setSelectedGenre} className="w-full max-w-2xl">
            <TabsList className="bg-white shadow-lg w-full grid grid-cols-5 h-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm py-2">Todos</TabsTrigger>
              <TabsTrigger value="Pop" className="text-xs sm:text-sm py-2">Pop</TabsTrigger>
              <TabsTrigger value="Rock" className="text-xs sm:text-sm py-2">Rock</TabsTrigger>
              <TabsTrigger value="Urbano" className="text-xs sm:text-sm py-2">Urbano</TabsTrigger>
              <TabsTrigger value="Balada" className="text-xs sm:text-sm py-2">Balada</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center mx-2 flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="text-center py-12 md:py-20 px-4">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg md:text-xl text-gray-500 mb-4">
              {selectedGenre === 'all' 
                ? 'No hay convocatorias disponibles en este momento' 
                : `No hay convocatorias disponibles en la categoría ${selectedGenre}`
              }
            </p>
            <Link to={createPageUrl('Home')}>
              <Button variant="outline">Volver al Inicio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 pb-20 md:pb-0">
            {filteredContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}