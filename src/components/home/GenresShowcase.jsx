import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Guitar, Mic2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const genres = [
  {
    name: 'Pop',
    icon: Music2,
    color: 'from-pink-500 to-rose-500',
    bgImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80'
  },
  {
    name: 'Rock',
    icon: Guitar,
    color: 'from-red-500 to-orange-500',
    bgImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&q=80'
  },
  {
    name: 'Urbano',
    icon: Mic2,
    color: 'from-purple-500 to-indigo-500',
    bgImage: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=800&q=80'
  },
  {
    name: 'Balada',
    icon: Heart,
    color: 'from-blue-500 to-cyan-500',
    bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80'
  }
];

export default function GenresShowcase() {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Géneros Musicales
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Compite en la categoría que más te apasiona
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Link to={createPageUrl('Contests')}>
                <div className="relative h-60 md:h-80 rounded-3xl overflow-hidden shadow-xl">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${genre.bgImage})` }}
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t ${genre.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                  
                  <div className="relative h-full flex flex-col items-center justify-center p-4 text-white text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="mb-4"
                    >
                      <genre.icon className="w-12 h-12 md:w-16 md:h-16" />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{genre.name}</h3>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm">
                        Ver Convocatorias
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}