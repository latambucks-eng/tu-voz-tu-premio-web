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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}#/reset-password`;
      await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    } catch (err) {
      console.error('Error enviando recuperación:', err);
    } finally {
      setIsLoading(false);
      setSent(true);
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
          Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisá también la
          carpeta de spam.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
