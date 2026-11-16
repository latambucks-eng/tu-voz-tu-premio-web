import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Upload, Vote, Trophy, Users } from 'lucide-react';
import Icon3D from '@/components/brand/Icon3D';

const steps = [
  {
    icon: UserPlus,
    title: 'Regístrate',
    description: 'Crea tu perfil de artista y completa tus datos',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Upload,
    title: 'Sube tu Video',
    description: 'Sube tu video desde YouTube o tu dispositivo y participa en la sala de tu género',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Vote,
    title: 'Recibe Votos',
    description: 'Comparte en redes. Todos pueden votar, incluso sin registrarse',
    color: 'from-blue-500 to-cyan-500',
    highlight: true
  },
  {
    icon: Trophy,
    title: '¡Gana el Premio!',
    description: 'El más votado recibe el premio fijo en USD de la sala',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function HowItWorks() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-xl text-gray-600">
            En 4 simples pasos puedes empezar a competir
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border ${step.highlight ? 'border-green-300 ring-2 ring-green-200' : 'border-gray-100'}`}>
                {step.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      ¡Sin Registro!
                    </span>
                  </div>
                )}
                <Icon3D
                  icon={step.icon}
                  size="lg"
                  gradient={`bg-gradient-to-br ${step.color}`}
                  className="mb-6 mx-auto"
                />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aviso adicional destacado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <div className="flex-shrink-0">
              <Icon3D
                icon={Users}
                size="lg"
                gradient="bg-gradient-to-br from-green-400 to-emerald-600"
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-1">
                ✨ ¡Votación Abierta para Todos!
              </h3>
              <p className="text-green-800">
                <strong>No necesitas registrarte para votar.</strong> Cualquiera puede apoyar a su artista favorito con solo un clic. 
                Esto significa más chances de ganar para todos los participantes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}