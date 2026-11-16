import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Receipt } from 'lucide-react';

export default function CreditProofSubmission({ packageData, paymentMethod, transactionId, onComplete }) {
  const [reference, setReference] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    const value = reference.trim();

    if (value.length < 4) {
      setError('Escribe el correo electrónico o el ID de la transacción con el que pagaste en PayPal.');
      return;
    }

    setError(null);
    onComplete({ payment_reference: value });
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Receipt className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <p className="font-semibold mb-2">🧾 Datos del pago</p>
          <p className="text-sm">
            No necesitas subir ningún comprobante. Solo escribe el correo electrónico o el ID de la
            transacción con el que pagaste los ${packageData.package_amount.toFixed(2)} USD en PayPal.
          </p>
          {transactionId && (
            <p className="text-xs mt-2 bg-blue-100 rounded px-2 py-1">
              Transacción: #{transactionId.substring(0, 8)}...
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="payment_reference">
          Correo electrónico o ID de la transacción de PayPal *
        </Label>
        <Input
          id="payment_reference"
          placeholder="ejemplo@correo.com o 8AB12345CD678901E"
          value={reference}
          onChange={(e) => {
            setReference(e.target.value);
            setError(null);
          }}
        />
        <p className="text-xs text-gray-500">
          Lo encuentras en el correo de confirmación de PayPal o en el detalle de la transacción.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800 text-sm">
          <p className="font-semibold mb-1">⏳ Revisión Pendiente</p>
          <p>
            Tu compra quedará pendiente de aprobación hasta que un administrador verifique el pago con
            esos datos. Te notificaremos cuando sea aprobada (usualmente 24-48 horas).
          </p>
        </AlertDescription>
      </Alert>

      <Button
        onClick={handleSubmit}
        disabled={!reference.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        Confirmar y Finalizar
      </Button>

      <p className="text-xs text-center text-gray-500">
        Al enviar, confirmas que los datos del pago son correctos
      </p>
    </div>
  );
}