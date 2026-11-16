import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, ExternalLink, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ENTRY_PRICE_USD = 10;

export default function PaymentStep({ contest, onPaymentStart }) {
  const [hasOpened, setHasOpened] = useState(false);
  const paymentUrl = contest?.passline_url;

  const handlePayWithPassline = () => {
    if (!paymentUrl) {
      alert('❌ Esta convocatoria todavía no tiene link de pago de Passline.\n\nContacta a soporte para completar tu inscripción.');
      return;
    }

    const paymentWindow = window.open(paymentUrl, '_blank');

    if (!paymentWindow) {
      alert('❌ POPUP BLOQUEADO\n\nTu navegador bloqueó la ventana de pago.\nPor favor, habilita popups para este sitio.');
      return;
    }

    setHasOpened(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Valor de la inscripción</p>
            <p className="text-3xl font-bold text-purple-700">
              ${ENTRY_PRICE_USD.toFixed(2)} USD
            </p>
            <p className="text-xs text-gray-500 mt-1">Pago único por convocatoria</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Corresponde al mantenimiento y gestión de la plataforma online
            </p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p className="font-medium text-gray-900">{contest.name}</p>
            <p>Sala {contest.genre}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <Button
            onClick={handlePayWithPassline}
            className="w-full h-auto py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center gap-3 mb-2 w-full">
                <CreditCard className="w-6 h-6" />
                <span className="text-xl font-bold">Pagar inscripción en Passline</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </div>
              <p className="text-sm opacity-90">
                Pago seguro de ${ENTRY_PRICE_USD.toFixed(2)} USD en la plataforma Passline
              </p>
            </div>
          </Button>

          {hasOpened && (
            <Button
              onClick={() => onPaymentStart('passline')}
              variant="outline"
              className="w-full mt-4 py-5 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Ya pagué en Passline — continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm space-y-1">
          <p className="font-bold">💳 Pago procesado por Passline</p>
          <p>
            Passline es una plataforma de pagos de terceros: el cobro se realiza fuera de TuVozTuPremio y no
            almacenamos datos de tarjetas. Tu comprobante queda guardado como ticket en Passline, así que no
            tenés que subir nada acá.
          </p>
          <p className="font-semibold">
            Importante: pagá en Passline con el mismo correo con el que te registraste en el concurso.
          </p>
        </AlertDescription>
      </Alert>

      {!paymentUrl && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta convocatoria aún no tiene su link de pago de Passline publicado. Contacta a soporte.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}