import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import { getDashboardPage, goToLogin } from '@/lib/authNav';
import { Button } from '@/components/ui/button';
import Logo from '@/components/brand/Logo';

export default function HomeTopBar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2 min-w-0">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-gray-900 text-sm sm:text-base truncate">Tu Voz, Tu Premio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
          <Link to={createPageUrl('Contests')} className="hover:text-purple-700">Convocatorias</Link>
          <Link to={createPageUrl('VotingRoom')} className="hover:text-purple-700">Sala de Votación</Link>
          <Link to={createPageUrl('Winners')} className="hover:text-purple-700">Ganadores</Link>
          <Link to={createPageUrl('Bases')} className="hover:text-purple-700">Bases</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Link to={createPageUrl(getDashboardPage(user))}>
                {user?.role === 'admin' ? 'Panel de Administración' : 'Mi panel'}
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={goToLogin} className="text-gray-700">
                Iniciar sesión
              </Button>
              <Button size="sm" onClick={goToLogin} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Crear cuenta
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
