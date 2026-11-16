import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Logo from '@/components/brand/Logo';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2">
            <Logo className="w-12 h-12 shadow-xl" />
            <span className="text-white font-bold text-lg">Tu Voz, Tu Premio</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="text-center text-sm text-purple-100 mt-6">{footer}</div>}
      </div>
    </div>
  );
}