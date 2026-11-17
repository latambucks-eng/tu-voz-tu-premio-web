import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Music, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLES = [
  {
    value: 'artist',
    title: 'Soy Artista',
    detail: 'Participo en convocatorias y canjeo mis estrellas',
    icon: Music
  },
  {
    value: 'fan',
    title: 'Soy Fan',
    detail: 'Voto y apoyo a mis artistas con regalos',
    icon: Star
  }
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!role) {
      setError('Elegí cómo vas a participar: Artista o Fan.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsLoading(true);
    try {
      const cleanEmail = email.trim();
      const displayName = fullName.trim() || cleanEmail.split('@')[0];

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: displayName,
            user_type: role,
          },
        },
      });
      if (signUpError) throw signUpError;

      if (data?.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: cleanEmail,
          full_name: displayName,
          user_type: role,
          role: 'user',
        });
      }

      navigate(createPageUrl(role === 'artist' ? 'ArtistDashboard' : 'FanDashboard'));
      window.location.reload();
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        setError('Este correo ya está registrado. Probá iniciar sesión.');
      } else {
        setError(msg || 'No pudimos crear tu cuenta. Probá con otro correo o intentá de nuevo.');
      }
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Al registrarte elegís tu rol: Soy Artista o Soy Fan."
      footer={
        <>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-white font-semibold underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
        )}

        <div>
          <Label className="text-gray-700">¿Cómo vas a participar?</Label>
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            {ROLES.map((option) => {
              const RoleIcon = option.icon;
              const isSelected = role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  aria-pressed={isSelected}
                  className={cn(
                    'rounded-xl border-2 p-3 text-left transition-colors',
                    isSelected
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  )}
                >
                  <RoleIcon className={cn('w-5 h-5 mb-1', isSelected ? 'text-purple-700' : 'text-gray-400')} />
                  <p className="font-semibold text-sm text-gray-900">{option.title}</p>
                  <p className="text-[11px] leading-tight text-gray-500 mt-0.5">{option.detail}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="fullName" className="text-gray-700">Nombre o nombre artístico</Label>
          <Input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5"
            placeholder="tucorreo@email.com"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <Label htmlFor="confirm" className="text-gray-700">Repetir contraseña</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5"
            placeholder="Repetí tu contraseña"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear cuenta'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Votar es gratis y sin cuenta. La cuenta es obligatoria para competir como artista.
        </p>
      </form>
    </AuthShell>
  );
}
