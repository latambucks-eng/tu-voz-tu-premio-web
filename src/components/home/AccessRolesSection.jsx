import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Star, Check, Mic2 } from 'lucide-react';
import Icon3D from '@/components/brand/Icon3D';
import { getDashboardPage, goToLogin } from '@/lib/authNav';

export default function AccessRolesSection() {
  const { user, isAuthenticated } = useAuth();
  const roleLabel = user?.role === 'admin' ? 'Administrador' : user?.user_type === 'artist' ? 'Artista' : user?.user_type === 'fan' ? 'Fan' : 'sin rol';

  return (
    <div id="acceso" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <Icon3D icon={Mic2} size="xs" gradient="bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600" />
            Acceso con cuenta
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¿Vienes a votar o a competir?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <strong className="text-gray-900">Votar es gratis y sin cuenta.</strong> Para competir como artista
            necesitas iniciar sesión y registrarte. Hay dos roles: <strong className="text-gray-900">Soy Artista</strong> y{' '}
            <strong className="text-gray-900">Soy Fan</strong>.
          </p>
        </div>

        {isAuthenticated ? (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-purple-800">
                  Sesión iniciada como <strong>{user?.full_name || user?.email}</strong> — rol:{' '}
                  <strong className="capitalize">{roleLabel}</strong>
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Tu cuenta ya está activa. Puedes entrar a tu panel o cambiar tu rol.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Link to={createPageUrl(getDashboardPage(user))}>Ir a mi panel</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={createPageUrl('SelectRole')}>Cambiar rol</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Soy Artista</h3>
                    <p className="text-xs text-gray-500">Para competir y recibir votos</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />Inscripción obligatoria con cuenta de artista</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />Subes tu video a la sala de tu género</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />Compartes y compites por el premio fijo en USD</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={goToLogin} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    Registrarme como Artista
                  </Button>
                  <Button onClick={goToLogin} variant="outline" className="flex-1">
                    Ya tengo cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Soy Fan</h3>
                    <p className="text-xs text-gray-500">Para votar, seguir y enviar regalos</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />Votar es gratis y también sin cuenta</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />Con cuenta sigues artistas y tus votos quedan guardados</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />Puedes enviar regalos y estrellas ⭐</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={goToLogin} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">
                    Registrarme como Fan
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={createPageUrl('VotingRoom')}>Votar sin cuenta</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isAuthenticated && (
          <p className="text-center text-xs text-gray-500 mt-6">
            Al registrarte eliges tu rol (Artista o Fan) y puedes cambiarlo cuando quieras desde tu perfil.
          </p>
        )}
      </div>
    </div>
  );
}