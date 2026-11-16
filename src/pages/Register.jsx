import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { authErrorText } from '@/lib/authFlow';
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
  const [step, setStep] = useState('form');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
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
      await base44.auth.register({ email: email.trim(), password });
      setStep('verify');
    } catch (err) {
      setError(authErrorText(err, 'No pudimos crear tu cuenta. Probá con otro correo o intentá de nuevo.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: email.trim(), otpCode: otpCode.trim() });
      const token = result?.access_token || result?.data?.access_token;
      if (token) base44.auth.setToken(token);
      try {
        await base44.auth.updateMe({ user_type: role });
      } catch (roleError) {
        console.warn('No se pudo guardar el rol elegido:', roleError);
      }
      window.location.href = createPageUrl(role === 'artist' ? 'ArtistDashboard' : 'FanDashboard');
    } catch (err) {
      setError(authErrorText(err, 'El código no es válido o venció. Pedí uno nuevo.'));
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    try {
      await base44.auth.resendOtp(email.trim());
      setInfo('Te enviamos un código nuevo. Revisá tu correo.');
    } catch (err) {
      setError('No pudimos reenviar el código. Intentá de nuevo en unos segundos.');
    }
  };

  if (step === 'verify') {
    return (
      <AuthShell
        title="Verificá tu correo"
        subtitle={`Enviamos un código de 6 dígitos a ${email}.`}
        footer={
          <Link to="/login" className="text-white font-semibold underline">
            Volver a iniciar sesión
          </Link>
        }
      >
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
          )}
          {info && (
            <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm p-3">{info}</div>
          )}

          <div>
            <Label htmlFor="otp" className="text-gray-700">Código de verificación</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="mt-1.5 text-center text-2xl tracking-[0.4em] font-bold"
              placeholder="000000"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || otpCode.length < 6}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verificar y entrar'}
          </Button>

          <button type="button" onClick={handleResend} className="w-full text-xs text-purple-700 hover:underline">
            Reenviar código
          </button>
        </form>
      </AuthShell>
    );
  }

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