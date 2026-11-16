import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Users, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ArtistSlider from './ArtistSlider';
import Logo from '@/components/brand/Logo';
import Icon3D from '@/components/brand/Icon3D';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Main content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <div className="relative w-28 h-28 md:w-40 md:h-40 mx-auto lg:mx-0">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse bg-amber-400/60" />
                <Logo className="relative w-full h-full shadow-2xl" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
                Tu Voz, Tu Premio
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto lg:mx-0 font-light">
              Tu talento merece un escenario enorme: subí tu video, sumá votos y
              llevate el premio en USD de tu sala. El más votado se lo lleva todo. 🏆
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to={createPageUrl('Contests')}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold shadow-2xl hover:shadow-pink-500/50 transition-all">
                  <Icon3D icon={Trophy} size="xs" gradient="bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-600" />
                  Ver Convocatorias
                </Button>
              </Link>
              <Link to={createPageUrl('Winners')}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-bold">
                  <Icon3D icon={Sparkles} size="xs" gradient="bg-gradient-to-br from-fuchsia-300 via-purple-400 to-purple-700" />
                  Ganadores
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <Icon3D icon={Users} size="md" gradient="bg-gradient-to-br from-amber-300 to-yellow-500" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">4</div>
                <div className="text-xs text-purple-200">Salas Activas</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <Icon3D icon={Trophy} size="md" gradient="bg-gradient-to-br from-amber-300 to-yellow-500" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-xs text-purple-200">Del Premio al Ganador</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <Icon3D icon={Music} size="md" gradient="bg-gradient-to-br from-amber-300 to-yellow-500" className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">40</div>
                <div className="text-xs text-purple-200">Lugares por Sala</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Artist Slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <ArtistSlider />
          </motion.div>
        </div>

        {/* Mobile Artist Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:hidden mt-12"
        >
          <ArtistSlider />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
}