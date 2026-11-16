import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Crown, Star, TrendingUp, Medal, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Flag = ({ code, country }) => {
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      alt={country || ''}
      className="w-5 h-auto rounded-sm shadow-sm"
      loading="lazy"
    />
  );
};

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const formatEditionDate = (value) => {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return '';
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
};

export default function PastEditionWinners() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await base44.entities.EditionWinner.list('order');
      const list = Array.isArray(data) ? data.filter((r) => r.is_active !== false) : [];
      setRecords(list);
    } catch (error) {
      console.error('Error loading past edition winners:', error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16">
        <Skeleton className="h-16 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-56 max-w-3xl mx-auto rounded-3xl" />
      </div>
    );
  }

  if (records.length === 0) return null;

  const editions = [...new Set(records.map((r) => r.edition))];

  return (
    <div className="mt-20 pt-12 border-t border-amber-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-lg shadow-amber-200 mb-4">
          <History className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Historial de Convocatorias Pasadas
        </h2>
        <p className="text-gray-600">
          Ganadores y participantes destacados de nuestras ediciones anteriores
        </p>
      </motion.div>

      <div className="space-y-16">
        {editions.map((edition) => {
          const editionRecords = records.filter((r) => r.edition === edition);
          const editionDate = formatEditionDate(editionRecords.find((r) => r.edition_date)?.edition_date);
          const champion = editionRecords.find((r) => r.badge === 'GANADOR/A');
          const others = editionRecords.filter((r) => r !== champion);

          return (
            <div key={edition}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-amber-200" />
                <div className="text-center px-2">
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
                    {edition}
                  </p>
                  {editionDate && (
                    <p className="text-xs text-gray-500 mt-0.5">Realizada el {editionDate}</p>
                  )}
                </div>
                <div className="h-px flex-1 bg-amber-200" />
              </div>

              {champion && (
                <div className="relative max-w-3xl mx-auto mb-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl blur-lg opacity-40" />
                  <div className="relative bg-white rounded-3xl border-2 border-amber-300 shadow-xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                      {champion.image ? (
                        <img
                          src={champion.image}
                          alt={champion.name}
                          className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-amber-400 shadow-lg"
                        />
                      ) : (
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-amber-400">
                          {champion.name?.[0] || '?'}
                        </div>
                      )}
                      <div className="absolute -top-2 -right-1 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-2 shadow-md">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <Badge className="bg-amber-400 text-gray-900 hover:bg-amber-400 font-bold mb-2">
                        {champion.badge}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {champion.name}
                      </h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mt-1 mb-4">
                        <Flag code={champion.country_code} country={champion.country} />
                        {champion.country}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-6">
                        {champion.votes && (
                          <>
                            <div>
                              <div className="flex items-center gap-1 text-amber-600 font-bold text-xl">
                                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                                {champion.votes}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">Votos</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                          </>
                        )}
                        <div>
                          <div className="flex items-center gap-1 text-purple-600 font-bold text-xl">
                            <TrendingUp className="w-5 h-5" />
                            {champion.percentage || 0}%
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Del total</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {others.map((artist) => (
                  <div
                    key={artist.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-4 text-center"
                  >
                    {artist.image ? (
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto ring-2 ring-purple-100 mb-3"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3">
                        {artist.name?.[0] || '?'}
                      </div>
                    )}
                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                      {artist.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mt-1">
                      <Flag code={artist.country_code} country={artist.country} />
                      {artist.country}
                    </div>

                    {artist.badge && (
                      <Badge variant="outline" className="mt-2 text-[10px] font-semibold text-gray-600">
                        <Medal className="w-3 h-3 mr-1" />
                        {artist.badge}
                      </Badge>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-1 text-purple-600 font-bold text-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {artist.percentage || 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}