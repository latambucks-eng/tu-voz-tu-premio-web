import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { resolveReturnTo, authErrorText } from '@/lib/authFlow';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const returnTo = resolveReturnTo('Home');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email.trim(), password);
      window.location.href = returnTo;
    } catch (err) {
      setError(authErrorText(err, 'No pudimos iniciar sesión. Revisá tus datos e intentá de nuevo.'));
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider('google', returnTo);
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Entrá a tu cuenta de artista o de fan. Para votar no necesitás cuenta."
      footer={
        <>
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/register" className="text-white font-semibold underline">
            Registrarme
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
        )}

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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
            <Link to="/forgot-password" className="text-xs text-purple-700 hover:underline">
              Olvidé mi contraseña
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5"
            placeholder="Tu contraseña"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">o</span>
          </div>
        </div>

        <Button type="button" variant="outline" onClick={handleGoogle} className="w-full py-5" disabled={isLoading}>
          Continuar con Google
        </Button>
      </form>
    </AuthShell>
  );
}