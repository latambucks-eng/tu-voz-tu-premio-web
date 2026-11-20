import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, ExternalLink, AlertCircle, ArrowRight, Info, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ENTRY_PRICE_USD = 10;

export default function PaymentStep({ contest, onPaymentStart }) {
  const [openedMethod, setOpenedMethod] = useState(null);
  const passlineUrl = contest?.passline_url;
  const paypalUrl = contest?.paypal_url;
  const price = parseFloat(contest?.entry_price) || ENTRY_PRICE_USD;

  const handleOpenPayment = (method, url) => {
    if (!url) {
      alert(`❌ Esta convocatoria todavía no tiene el link de pago de ${method === 'paypal' ? 'PayPal' : 'Passline'} configurado.\n\nContacta a soporte o utiliza el otro método disponible.`);
      return;
    }

    setOpenedMethod(method);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Valor de la inscripción</p>
            <p className="text-3xl font-bold text-purple-700">
              ${price.toFixed(2)} USD
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción 1: Passline (Argentina) */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-cyan-100">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 mb-3">
                🇦🇷 Argentina (Moneda local / Tarjetas)
              </span>
              <Button
                onClick={() => handleOpenPayment('passline', passlineUrl)}
                disabled={!passlineUrl}
                className="w-full h-auto py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <div className="flex flex-col items-start w-full text-left">
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <CreditCard className="w-5 h-5 shrink-0" />
                    <span className="text-lg font-bold">Pagar con Passline</span>
                    <ExternalLink className="w-4 h-4 ml-auto shrink-0" />
                  </div>
                  <p className="text-xs opacity-90 font-normal">
                    Inscripción equivalente a ${price.toFixed(2)} USD
                  </p>
                </div>
              </Button>
            </div>

            <Button
              onClick={() => onPaymentStart('passline')}
              variant={openedMethod === 'passline' ? 'default' : 'outline'}
              className={`w-full mt-4 py-5 ${
                openedMethod === 'passline'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'border-cyan-300 text-cyan-800 hover:bg-cyan-50'
              }`}
            >
              Ya pagué en Passline — continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Opción 2: PayPal (Latinoamérica / Internacional) */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-100">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 mb-3">
                🌎 Latinoamérica / Internacional (USD)
              </span>
              <Button
                onClick={() => handleOpenPayment('paypal', paypalUrl)}
                disabled={!paypalUrl}
                className="w-full h-auto py-5 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800"
              >
                <div className="flex flex-col items-start w-full text-left">
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <Globe className="w-5 h-5 shrink-0" />
                    <span className="text-lg font-bold">Pagar con PayPal</span>
                    <ExternalLink className="w-4 h-4 ml-auto shrink-0" />
                  </div>
                  <p className="text-xs opacity-90 font-normal">
                    Pago internacional de ${price.toFixed(2)} USD
                  </p>
                </div>
              </Button>
            </div>

            <Button
              onClick={() => onPaymentStart('paypal')}
              variant={openedMethod === 'paypal' ? 'default' : 'outline'}
              className={`w-full mt-4 py-5 ${
                openedMethod === 'paypal'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'border-indigo-300 text-indigo-800 hover:bg-indigo-50'
              }`}
            >
              Ya pagué en PayPal — continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm space-y-1">
          <p className="font-bold">💳 Pagos externos seguros (Passline o PayPal)</p>
          <p>
            Tanto Passline (Argentina) como PayPal (Latinoamérica e Internacional) son plataformas de pago
            de terceros: no almacenamos datos de tarjetas en TuVozTuPremio.
          </p>
          <p className="font-semibold">
            Importante: realizá el pago con el mismo correo con el que te registraste en el concurso (o indicá tu correo/comprobante de PayPal al confirmar).
          </p>
        </AlertDescription>
      </Alert>

      {!passlineUrl && !paypalUrl && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta convocatoria aún no tiene links de pago publicados. Contacta a soporte.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

