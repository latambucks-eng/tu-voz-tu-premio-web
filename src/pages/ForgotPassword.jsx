import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const redirectTo = 'https://github.io';
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err?.message || 'No pudimos enviar el correo en este momento. Intentá de nuevo en unos minutos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviamos un enlace para crear una contraseña nueva."
      footer={
        <Link to="/login" className="text-white font-semibold underline">
          Volver a iniciar sesión
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm p-4">
          Te enviamos un enlace a <strong>{email}</strong> para restablecer tu contraseña. Revisá también la
          carpeta de spam.
        </div>
      ) : (
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar enlace'}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

