import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Mail, Shield, FileText, HelpCircle, Users, Star, Flag } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getDashboardPage, goToLogin } from '@/lib/authNav';
import Logo from '@/components/brand/Logo';

const linkClass = 'text-xs text-gray-300 hover:text-white transition-colors leading-relaxed';
const headingClass = 'text-[11px] font-semibold uppercase tracking-wider text-purple-200 mb-3 flex items-center gap-1.5';

export default function AppFooter() {
  const { user, isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10">

        {/* Soporte */}
        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-6 mb-10 text-center">
          <h3 className="text-base sm:text-lg font-bold mb-1">Soporte por Preguntas Frecuentes y Tickets</h3>
          <p className="text-xs sm:text-sm text-purple-100 mb-5">
            Consultá las preguntas frecuentes o abrí un ticket y el equipo te responde
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center items-stretch sm:items-center">
            <Link
              to={createPageUrl('FAQ')}
              className="bg-white text-purple-700 font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-purple-50 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Preguntas Frecuentes
            </Link>
            <Link
              to={createPageUrl('Support')}
              className="bg-white text-purple-700 font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-purple-50 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Abrir un Ticket
            </Link>
            <a
              href="mailto:infotuvoz25@gmail.com"
              className="bg-white/10 border border-white/50 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              infotuvoz25@gmail.com
            </a>
          </div>
        </div>

        {/* Columnas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {/* Marca */}
          <div className="col-span-2 md:col-span-1 text-left">
            <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 mb-3">
              <Logo className="w-9 h-9" />
              <span className="text-sm font-bold">Tu Voz, Tu Premio</span>
            </Link>
            <p className="text-xs text-gray-300 leading-relaxed mb-3 max-w-xs">
              La plataforma líder de concursos de canto en Argentina. Compite, demuestra tu talento y gana premios reales.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-200">
              <Shield className="w-3.5 h-3.5" />
              Pagos seguros
            </span>
          </div>

          {/* Navegación */}
          <div className="text-left">
            <h4 className={headingClass}>
              <Star className="w-3.5 h-3.5" />
              Navegación
            </h4>
            <ul className="space-y-2">
              <li><Link to={createPageUrl('Contests')} className={linkClass}>Concursos Activos</Link></li>
              <li><Link to={createPageUrl('Winners')} className={linkClass}>Ganadores</Link></li>
              <li><Link to={createPageUrl('Community')} className={linkClass}>Comunidad</Link></li>
              <li>
                {isAuthenticated ? (
                  <Link to={createPageUrl(getDashboardPage(user))} className={linkClass}>Mi panel</Link>
                ) : (
                  <button onClick={goToLogin} className={`${linkClass} text-left`}>
                    Crear cuenta
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div className="text-left">
            <h4 className={headingClass}>
              <HelpCircle className="w-3.5 h-3.5" />
              Ayuda
            </h4>
            <ul className="space-y-2">
              <li><Link to={createPageUrl('Bases')} className={linkClass}>Bases del Concurso</Link></li>
              <li><Link to={createPageUrl('FAQ')} className={linkClass}>Preguntas Frecuentes</Link></li>
              <li><Link to={createPageUrl('Support')} className={linkClass}>Centro de Soporte</Link></li>
              <li><a href="mailto:infotuvoz25@gmail.com" className={linkClass}>Contacto por Email</a></li>
              <li><Link to={createPageUrl('Legal')} className={linkClass}>Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Para Ti */}
          <div className="col-span-2 md:col-span-1 text-left">
            <h4 className={headingClass}>
              <Users className="w-3.5 h-3.5" />
              Para Ti
            </h4>
            <ul className="space-y-2">
              <li>
                {isAuthenticated ? (
                  <Link to={createPageUrl('Participate')} className={linkClass}>
                    Participar como Artista
                  </Link>
                ) : (
                  <button onClick={goToLogin} className={`${linkClass} text-left`}>
                    Soy Artista — registrarme o entrar
                  </button>
                )}
              </li>
              <li>
                {isAuthenticated ? (
                  <Link to={createPageUrl(getDashboardPage(user))} className={linkClass}>
                    Mi cuenta
                  </Link>
                ) : (
                  <button onClick={goToLogin} className={`${linkClass} text-left`}>
                    Soy Fan — registrarme o entrar
                  </button>
                )}
              </li>
              <li>
                <Link to={createPageUrl('VotingRoom')} className={linkClass}>
                  Votar sin cuenta (gratis)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] text-gray-400 text-center md:text-left">
              © {currentYear} Tu Voz, Tu Premio. Todos los derechos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-gray-400 md:justify-end">
              <Link to={createPageUrl('Legal')} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Términos y Condiciones
              </Link>
              <Link to={createPageUrl('Legal')} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Privacidad
              </Link>
              <Link
                to={createPageUrl('Support')}
                className="bg-white text-purple-700 font-semibold px-3 py-1.5 rounded-md hover:bg-purple-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                Botón de Arrepentimiento
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-gray-500">
            Plataforma segura con pagos protegidos • Soporte por tickets • Premios garantizados
          </p>
        </div>
      </div>
    </footer>
  );
}