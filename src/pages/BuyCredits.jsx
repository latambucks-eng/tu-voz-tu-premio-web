import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, Coins, Star, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PackageSelection from '../components/credits/PackageSelection';
import CreditPaymentStep from '../components/credits/CreditPaymentStep';
import CreditProofSubmission from '../components/credits/CreditProofSubmission';

export default function BuyCredits() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Datos del flujo
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [transactionId, setTransactionId] = useState(null); // NUEVO: Guardar ID de transacción

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      // Cargar wallet
      try {
        const wallets = await base44.entities.Wallet.filter({ user_id: userData.id });
        if (wallets && wallets.length > 0) {
          setWallet(wallets[0]);
        } else {
          const newWallet = await base44.entities.Wallet.create({
            user_id: userData.id,
            balance: 0,
            star_credits: 0
          });
          setWallet(newWallet);
        }
      } catch (walletError) {
        console.error('Error al cargar wallet:', walletError);
        setWallet({ user_id: userData.id, balance: 0, star_credits: 0 });
      }

    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        alert('⏱️ Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      setError('Error al cargar datos. Por favor, recarga la página.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setStep(2);
  };

  const handlePaymentStart = (method, txId) => { // Acepta txId
    console.log('📥 handlePaymentStart llamado con:', { method, txId });
    setPaymentData({ payment_method: method });
    setTransactionId(txId); // Guardar ID de transacción
    setStep(3);
  };

  const handleProofComplete = async (data) => {
    try {
      console.log('📤 Completando compra con transactionId:', transactionId);
      
      if (transactionId) {
        // Guardar el correo / ID de transacción de PayPal informado por el usuario
        await base44.entities.Transaction.update(transactionId, {
          payment_reference: data.payment_reference
        });
        console.log('✅ Datos de pago agregados a transacción existente');
      }
      
      alert('✅ Compra registrada exitosamente. Un administrador la revisará en 24-48 horas.');
      setSuccess(true);
      
      setTimeout(() => {
        if (user.user_type === 'artist') {
          navigate(createPageUrl('ArtistDashboard'));
        } else {
          navigate(createPageUrl('FanDashboard'));
        }
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-600" />
            <p className="text-gray-600">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
          <Button onClick={loadData} className="mt-4 w-full">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-md">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Coins className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Compra Registrada!
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                Tu compra de <strong className="text-purple-600">{selectedPackage?.credits} créditos</strong> está pendiente de aprobación.
              </p>
              <p className="text-gray-500 text-sm">
                Redirigiendo a tu panel...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? 'Volver' : 'Paso Anterior'}
          </Button>
        </div>

        {/* Balance Actual */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200">Tu Saldo Actual</p>
                <div className="flex items-center gap-3 mt-1">
                  <Coins className="w-8 h-8 text-yellow-300" />
                  <p className="text-4xl font-bold">{(parseFloat(wallet?.balance) || 0).toFixed(2)}</p>
                  <span className="text-lg mt-2">Créditos</span>
                </div>
              </div>
              <div className="text-right border-l border-white/20 pl-6">
                <p className="text-sm font-medium text-purple-200">Saldo canjeable</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                  <p className="text-2xl font-bold">{(parseFloat(wallet?.star_credits) || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 mb-8 text-purple-900">
          <p className="text-base font-semibold mb-1">
            🎁 Regalá obsequios de incentivo a tus artistas favoritos
          </p>
          <p className="text-sm">
            Cada regalo impulsa su engagement: más energía en el escenario, más ganas de compartir y más
            comunidad empujando su talento. Tu apoyo se ve, se siente y se celebra en cada ronda.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="text-2xl">Comprar Créditos</CardTitle>
            <p className="text-purple-100 text-sm mt-2">
              Sigue los pasos para completar tu compra
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Indicador de Pasos */}
            <div className="flex items-center justify-center mb-8">
              <div className={`flex items-center ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Paquete</span>
              </div>
              <div className={`mx-3 h-1 w-12 sm:w-20 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Pago</span>
              </div>
              <div className={`mx-3 h-1 w-12 sm:w-20 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 hidden sm:inline font-medium">Datos de pago</span>
              </div>
            </div>

            {/* PASO 1: Seleccionar Paquete */}
            {step === 1 && (
              <PackageSelection onSelect={handlePackageSelect} />
            )}

            {/* PASO 2: Pago */}
            {step === 2 && selectedPackage && (
              <CreditPaymentStep 
                packageData={selectedPackage}
                user={user}
                onPaymentStart={handlePaymentStart}
              />
            )}

            {/* PASO 3: Datos de pago (correo / ID de transacción de PayPal) */}
            {step === 3 && (
              <CreditProofSubmission
                packageData={selectedPackage}
                paymentMethod={paymentData.payment_method}
                transactionId={transactionId} // Pasa el transactionId
                onComplete={handleProofComplete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}