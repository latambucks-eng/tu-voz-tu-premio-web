import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setStep('verify');
    } catch (err) {
      setError('No encontramos una cuenta con ese correo o superaste el límite de envíos. Probá en unos minutos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setIsLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'email',
      });
      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setStep('done');
    } catch (err) {
      setError('El código es incorrecto o venció. Revisá el último correo que te llegó.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle={
        step === 'email'
          ? 'Te enviamos un código de 6 dígitos a tu correo.'
          : step === 'verify'
          ? `Ingresá el código de 6 dígitos que enviamos a ${email}.`
          : 'Tu contraseña ya fue actualizada.'
      }
      footer={
        <Link to="/login" className="text-white font-semibold underline">
          Volver a iniciar sesión
        </Link>
      }
    >
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-4">{error}</div>
      )}

      {step === 'email' && (
        <form onSubmit={handleSendCode} className="space-y-4">
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
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar código'}
          </Button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyAndUpdate} className="space-y-4">
          <div className="rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3">
            Revisá tu correo (o spam): copiá el <strong>código de 6 dígitos</strong> que dice el mensaje (no hace falta hacer clic en ningún enlace).
          </div>
          <div>
            <Label htmlFor="code" className="text-gray-700">Código de 6 dígitos</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1.5 text-center tracking-widest font-mono text-lg"
              placeholder="123456"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-gray-700">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar nueva contraseña'}
          </Button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm p-4">
            ¡Listo! Tu contraseña se actualizó correctamente.
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5"
          >
            Iniciar sesión ahora
          </Button>
        </div>
      )}
    </AuthShell>
  );
}

