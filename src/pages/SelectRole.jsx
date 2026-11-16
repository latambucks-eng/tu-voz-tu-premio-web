import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Star, Trophy } from 'lucide-react';

export default function SelectRole() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading user:", error);
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const handleSelectRole = async (role) => {
    if (!user) return;

    try {
      await base44.auth.updateMe({ user_type: role });
      
      if (role === 'artist') {
        navigate(createPageUrl('ArtistDashboard'));
      } else {
        navigate(createPageUrl('FanDashboard'));
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert('Hubo un error al actualizar tu rol. Por favor, intenta de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            ¿Cómo quieres participar?
          </h1>
          <p className="text-lg text-gray-600">
            Elige tu rol en TuVozTuPremio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Soy Artista</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Participa en concursos, sube tus videos y compite por premios en efectivo.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Participa en concursos de canto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Recibe votos del público</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Music className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Gana el premio en USD de tu sala</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handleSelectRole('artist')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Continuar como Artista
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 h-full">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Soy Fan</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Vota por tus artistas favoritos y apóyalos con regalos si quieres.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Vota por tus artistas favoritos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Comparte perfiles y apoya a tus artistas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Music className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                    <span>Descubre nuevos talentos</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handleSelectRole('fan')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Continuar como Fan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {user?.user_type && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Rol actual: <span className="font-semibold capitalize">{user.user_type === 'artist' ? 'Artista' : 'Fan'}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}