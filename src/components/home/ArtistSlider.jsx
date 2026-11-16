import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, TrendingUp, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { editionWinners, EDITION_NAME } from '@/data/editionWinners';

export default function ArtistSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (editionWinners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % editionWinners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const nextArtist = () => {
    setCurrentIndex((prev) => (prev + 1) % editionWinners.length);
  };

  const prevArtist = () => {
    setCurrentIndex((prev) => (prev - 1 + editionWinners.length) % editionWinners.length);
  };

  const currentArtist = editionWinners[currentIndex];

  return (
    <div className="relative w-full h-96 md:h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <Card className="relative w-full h-full overflow-hidden bg-white/10 backdrop-blur-md border-white/20">
            <div className="absolute inset-0">
              <img
                src={currentArtist.image}
                alt={currentArtist.name}
                className="w-full h-full object-cover opacity-30 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
              <span className="text-yellow-400/80 text-[10px] md:text-xs uppercase tracking-wider mb-3">
                {EDITION_NAME}
              </span>

              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
                  <img
                    src={currentArtist.image}
                    alt={currentArtist.name}
                    className="w-full h-full rounded-full object-cover ring-4 ring-yellow-400/50"
                  />
                  {currentArtist.badge === 'GANADOR/A' && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-1.5 shadow-md">
                      <Crown className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />
                    <span className="text-yellow-400 font-semibold text-sm md:text-base">
                      {currentArtist.badge || 'Participante Destacado'}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {currentArtist.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm md:text-base mb-3">
                    <img
                      src={`https://flagcdn.com/24x18/${currentArtist.flag}.png`}
                      alt={currentArtist.country}
                      className="w-5 h-auto rounded-sm"
                    />
                    {currentArtist.country}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 text-white/90">
                {currentArtist.votes && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1.5 text-xl md:text-2xl font-bold">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {currentArtist.votes}
                    </div>
                    <div className="text-xs md:text-sm text-white/70">Votos</div>
                  </div>
                )}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="flex items-center gap-1.5 text-xl md:text-2xl font-bold">
                    <TrendingUp className="w-4 h-4" />
                    {currentArtist.percentage}%
                  </div>
                  <div className="text-xs md:text-sm text-white/70">Del total</div>
                </div>
              </div>
            </div>

            {editionWinners.length > 1 && (
              <>
                <button
                  onClick={prevArtist}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <button
                  onClick={nextArtist}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {editionWinners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}