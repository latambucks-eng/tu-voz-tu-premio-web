import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, AlertCircle, Loader2, Mail, Copy, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PaymentConfirmation({ contest, userEmail, onComplete, isSubmitting }) {
  const [confirmed, setConfirmed] = useState(false);
  const [acceptedBases, setAcceptedBases] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('No se pudo copiar el correo:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Mail className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <p className="font-semibold mb-2">📧 Usá el mismo correo de tu cuenta</p>
          <p className="text-sm">
            Passline guarda el comprobante de tu pago como ticket, así que no necesitás subir nada acá.
            Para que podamos identificar tu inscripción, pagá en Passline con{' '}
            <strong>el mismo correo con el que te registraste en la web del concurso</strong>.
          </p>
        </AlertDescription>
      </Alert>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <p className="text-xs font-medium text-gray-600 mb-1">Correo registrado en tu cuenta</p>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm sm:text-base font-semibold text-purple-800 break-all">
            {userEmail}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copiar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
        <Checkbox
          id="payment-confirm"
          checked={confirmed}
          onCheckedChange={(value) => setConfirmed(value === true)}
          className="mt-0.5"
        />
        <label htmlFor="payment-confirm" className="text-sm text-gray-700 cursor-pointer">
          Confirmo que pagué ${(parseFloat(contest.entry_price) || 10).toFixed(2)} USD en Passline
          usando el correo <strong>{userEmail}</strong>.
        </label>
      </div>

      <div className="rounded-lg border-2 border-purple-200 bg-purple-50/60 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="bases-accept"
            checked={acceptedBases}
            onCheckedChange={(value) => setAcceptedBases(value === true)}
            className="mt-0.5"
          />
          <label htmlFor="bases-accept" className="text-sm text-gray-700 cursor-pointer">
            Leí y acepto las{' '}
            <Link
              to={createPageUrl('Bases')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-700 underline"
            >
              Bases y Condiciones del Concurso
            </Link>{' '}
            y los{' '}
            <Link
              to={createPageUrl('Legal')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-700 underline"
            >
              Términos y Condiciones
            </Link>
            . Declaro ser mayor de 18 años y que mi video cumple las pautas de contenido.
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2 ml-7 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Lectura obligatoria: sin esta aceptación no se puede enviar la inscripción.
        </p>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800 text-sm">
          <p className="font-semibold mb-1">⏳ Revisión pendiente</p>
          <p>
            Tu participación quedará pendiente hasta que un administrador verifique tu ticket en Passline.
            Te notificaremos cuando tu video esté activo.
          </p>
        </AlertDescription>
      </Alert>

      <Button
        onClick={() => onComplete()}
        disabled={!confirmed || !acceptedBases || isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Finalizar Inscripción
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Al enviar, confirmas que los datos son correctos y que aceptaste las Bases y Condiciones del Concurso: la
        inscripción de 10 USD es la contraprestación por el mantenimiento y la gestión de la plataforma, la votación
        es del público con sistema antifraude por IP y dispositivo, y tu cuenta de artista no puede votar
      </p>
    </div>
  );
}