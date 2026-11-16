import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Users, TrendingUp, Award, Sparkles, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Icon3D from '@/components/brand/Icon3D';
import Star3D from '@/components/brand/Star3D';

export default function FeaturedArtistIncentive() {
  const benefits = [
    {
      icon: Star,
      title: "Perfil Destacado",
      description: "Tu perfil aparece en la comunidad con un badge especial",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Users,
      title: "Más Visibilidad",
      description: "Miles de usuarios verán tu perfil y tu talento",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Garantizado",
      description: "Aumenta tus seguidores y engagement automáticamente",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      title: "Reconocimiento Permanente",
      description: "Tu logro queda registrado para siempre",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white via-purple-50 to-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Main Title with animated stars */}
          <div className="relative inline-block mb-4">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-6 -left-6"
            >
              <Icon3D icon={Sparkles} size="sm" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-600" />
            </motion.div>
            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-6 -right-6"
            >
              <Star3D size={26} />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600">
              ¡Conviértete en Artista Destacado!
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-3">
            Gana competencias y obtén reconocimiento permanente
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            El ganador de cada sala recibe el <strong className="text-purple-600">100% del premio fijo publicado</strong> y además, automáticamente se convierte en 
            <strong className="text-purple-600"> Artista Destacado </strong> 
            en nuestra comunidad con beneficios exclusivos
          </p>
        </motion.div>

        {/* Central visual element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="inline-block mb-4"
                    >
                      <Icon3D
                        icon={Trophy}
                        size="xl"
                        gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-600"
                        className="mx-auto md:mx-0 rounded-full"
                      />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      ¿Cómo conseguirlo?
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                      Es simple:
                    </p>
                    <ol className="text-left space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">1</span>
                        <span>Inscríbete en una convocatoria de tu género favorito</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">2</span>
                        <span>Sube tu mejor interpretación en video</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">3</span>
                        <span>Comparte tu participación: tus fans te votan y pueden enviarte regalos (estrellas ⭐).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">🏆</span>
                        <span className="font-semibold text-purple-700">¡Gana el premio fijo en USD + conviértete en Artista Destacado!</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="flex-1 w-full md:w-auto">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        easeInOut: "easeInOut"
                      }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(15,23,42,0.55),inset_0_-3px_6px_rgba(0,0,0,0.25),inset_0_2px_2px_rgba(255,255,255,0.5)]">
                            <Star3D size={26} />
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm">ARTISTA DESTACADO</div>
                            <div className="text-purple-100 text-xs">Ganador de Competencia</div>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
                          <div className="text-white text-sm mb-1 flex items-center gap-2">
                            <Icon3D icon={Coins} size="xs" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-600" />
                            Premio Ganado
                          </div>
                          <div className="text-yellow-300 text-3xl font-bold">400 USD</div>
                          <div className="text-purple-100 text-xs mt-1">Premio fijo de 400 USD → se paga directo por PayPal o Binance</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                            <Icon3D icon={Users} size="xs" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-600" className="mx-auto mb-1" />
                            <div className="text-white text-lg font-bold">+150</div>
                            <div className="text-purple-100 text-xs">Seguidores</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                            <Icon3D icon={TrendingUp} size="xs" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-600" className="mx-auto mb-1" />
                            <div className="text-white text-lg font-bold">100%</div>
                            <div className="text-purple-100 text-xs">Visibilidad</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all h-full border border-gray-100">
                <Icon3D
                  icon={benefit.icon}
                  size="lg"
                  gradient={`bg-gradient-to-br ${benefit.color}`}
                  className="mb-4"
                />
                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to={createPageUrl('Contests')}>
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 text-white px-12 py-7 text-xl font-bold shadow-2xl hover:shadow-pink-500/50 transition-all">
              <Icon3D icon={Trophy} size="sm" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-600" className="mr-1" />
              Ver Convocatorias Activas
            </Button>
          </Link>
          <p className="text-gray-600 mt-4 text-sm">
            ¡Tu oportunidad de brillar está a un clic de distancia! ⭐
          </p>
        </motion.div>
      </div>
    </div>
  );
}