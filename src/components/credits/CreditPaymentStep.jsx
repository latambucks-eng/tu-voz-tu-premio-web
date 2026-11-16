import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, Loader2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CreditPaymentStep({ packageData, user, onPaymentStart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [createdTransactionId, setCreatedTransactionId] = useState(null);

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('💳 Iniciando pago PayPal para', packageData.package_amount, 'USD...');

      // PASO 1: Crear transacción pendiente ANTES de abrir PayPal
      let newTransaction;
      try {
        newTransaction = await base44.entities.Transaction.create({
          user_id: user.id,
          type: 'credit_purchase',
          amount: packageData.credits,
          description: `Compra de ${packageData.credits} créditos por $${packageData.package_amount.toFixed(2)} USD vía PayPal`,
          payment_method: 'paypal',
          status: 'pending'
        });

        setCreatedTransactionId(newTransaction.id);
      } catch (transError) {
        console.error('❌ Error al crear transacción:', transError);
        alert('❌ Error al registrar tu compra. Por favor, intenta de nuevo o contacta soporte.');
        setIsProcessing(false);
        return;
      }

      // PASO 2: Registrar acceso (estadísticas)
      try {
        await base44.entities.PaymentLinkAccess.create({
          user_id: user.id,
          user_email: user.email,
          payment_method: 'paypal',
          amount: packageData.package_amount,
          ip_address: 'web',
          user_agent: navigator.userAgent || 'unknown'
        });
      } catch (accessError) {
        console.warn('⚠️ No se pudo registrar acceso:', accessError);
      }

      // PASO 3: Abrir ventana de PayPal
      const paymentWindow = window.open(packageData.payment_url, '_blank', 'width=600,height=700');

      if (!paymentWindow) {
        alert(
          '❌ POPUP BLOQUEADO\n\n' +
          'Tu navegador bloqueó la ventana de pago.\n\n' +
          'Por favor:\n' +
          '1. Habilita popups para este sitio\n' +
          '2. Haz clic de nuevo en "Pagar con PayPal"\n\n' +
          'Tu transacción (#' + newTransaction.id.substring(0, 8) + ') ya está registrada.'
        );
        setIsProcessing(false);
        return;
      }

      // PASO 4: Detectar cierre de ventana
      const checkWindow = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkWindow);
          setTimeout(() => {
            onPaymentStart('paypal', newTransaction.id);
          }, 500);
        }
      }, 1000);

    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen del Paquete */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Paquete Seleccionado</p>
              <p className="text-3xl font-bold text-purple-700 flex items-center gap-2">
                <Coins className="w-8 h-8" />
                {packageData.credits} Créditos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total a Pagar</p>
              <p className="text-3xl font-bold text-gray-900">
                ${packageData.package_amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">USD</p>
            </div>
          </div>
          {createdTransactionId && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-xs font-medium">
              ✅ Transacción creada: #{createdTransactionId.substring(0, 8)}...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Método de Pago */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Método de Pago</h3>

          <Button
            onClick={handlePayPalPayment}
            disabled={isProcessing}
            className="w-full h-auto py-6 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600"
          >
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center gap-3 mb-2">
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
                <span className="text-xl font-bold">
                  {isProcessing ? 'Abriendo PayPal...' : `Pagar con PayPal $${packageData.package_amount.toFixed(2)} USD`}
                </span>
                {!isProcessing && <ExternalLink className="w-4 h-4 ml-auto" />}
              </div>
              <p className="text-sm opacity-90">
                Pago seguro con tu cuenta PayPal o tarjeta
              </p>
            </div>
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <p className="font-bold mb-2">📋 Instrucciones:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Haz clic en "Pagar con PayPal"</li>
            <li>Se abrirá una ventana nueva de PayPal por ${packageData.package_amount.toFixed(2)} USD</li>
            <li>Completa el pago con tu cuenta PayPal o tarjeta</li>
            <li>Anota el correo electrónico o el ID de la transacción de PayPal</li>
            <li>Vuelve aquí y escríbelo (no necesitas subir ningún comprobante)</li>
          </ol>
          <p className="mt-3 rounded bg-blue-100 px-3 py-2">
            🔎 <strong>Importante:</strong> en tu cuenta de PayPal el cobro aparecerá a nombre de <strong>LatamBucks</strong>,
            la empresa que procesa los pagos de la plataforma. Es el pago correcto.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}