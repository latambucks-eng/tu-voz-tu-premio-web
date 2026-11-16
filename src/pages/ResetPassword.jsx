import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { authErrorText } from '@/lib/authFlow';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      await base44.auth.resetPassword({ resetToken: token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(authErrorText(err, 'El enlace no es válido o venció. Pedí uno nuevo.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthShell title="Enlace no válido" subtitle="El enlace de recuperación está incompleto o venció.">
        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5">
          <Link to="/forgot-password">Pedir un enlace nuevo</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Nueva contraseña" subtitle="Elegí una contraseña nueva para tu cuenta.">
      {done ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm p-4">
            Tu contraseña se actualizó correctamente.
          </div>
          <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
          )}

          <div>
            <Label htmlFor="password" className="text-gray-700">Contraseña nueva</Label>
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
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar contraseña'}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}