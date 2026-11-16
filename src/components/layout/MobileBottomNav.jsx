import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon3D from '@/components/brand/Icon3D';

export default function MobileBottomNav({ user, navigationItems }) {
  const location = useLocation();

  if (!navigationItems || navigationItems.length === 0) {
    return null;
  }

  // Show only most important 5 items on mobile
  const mobileNavItems = [
    navigationItems.find(item => item.title === 'Inicio'),
    navigationItems.find(item => item.title === 'Convocatorias'),
    user?.user_type === 'artist' || user?.role === 'admin' 
      ? navigationItems.find(item => item.title === 'Participa')
      : navigationItems.find(item => item.title === 'Comunidad'),
    navigationItems.find(item => item.title === 'Sala de Votación'),
    navigationItems.find(item => item.title === 'Soporte'),
  ].filter(Boolean);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom shadow-lg">
      <div className="flex justify-around items-center h-16">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-500 hover:bg-gray-50'
              }`}
            >
              <Icon3D
                icon={item.icon}
                size="sm"
                gradient={isActive
                  ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600'
                  : 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500'}
              />
              <span className={`text-xs mt-1 truncate max-w-[60px] ${isActive ? 'font-semibold' : ''}`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}