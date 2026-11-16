import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Added AlertTitle for success message
import { DollarSign, Star, Clock, CheckCircle, AlertCircle, Loader2, TrendingUp, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Star3D from '@/components/brand/Star3D';

export default function Withdraw() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // NEW STATE for success messages
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const wallets = await base44.entities.Wallet.filter({ user_id: userData.id });
      if (wallets.length > 0) {
        setWallet(wallets[0]);
      }

      const requests = await base44.entities.WithdrawalRequest.filter(
        { user_id: userData.id },
        '-created_date'
      );
      setWithdrawalRequests(requests || []);
    } catch (error) {
      console.error('Error loading data:', error);
      base44.auth.redirectToLogin(window.location.href);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Derive values from user object for convenience and consistency with outline
    // These reflect the user's current configured withdrawal settings from their profile
    const withdrawalMethod = user.withdrawal_method;
    const accountType = user.withdrawal_account_type;
    const aliasCbu = user.withdrawal_alias_cbu;
    const fullName = user.withdrawal_full_name;
    const additionalInfo = user.withdrawal_additional_info;

    // VALIDACIONES COMPLETAS
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    const availableBalance = parseFloat(wallet?.star_credits) || 0;

    // VALIDAR MÍNIMO (1 Estrella = 1 USD) - Added this from outline
    if (withdrawAmount < 1) {
      setError('El monto mínimo de retiro es 1 Estrella (1 USD).');
      return;
    }

    // VALIDAR MÁXIMO (balance disponible)
    if (withdrawAmount > availableBalance) {
      setError(`No tienes suficientes Estrellas ⭐. Disponible: ${availableBalance.toFixed(2)}`);
      return;
    }

    // VALIDAR CONFIGURACIÓN DE RETIRO desde el perfil del usuario
    if (!withdrawalMethod || withdrawalMethod.trim() === '') {
      setError('⚠️ Debes configurar tu método de retiro en "Editar Perfil" antes de solicitar un canje.');
      return;
    }

    if (!fullName || fullName.trim() === '') {
      setError('⚠️ Debes completar tu Nombre Completo en "Editar Perfil".');
      return;
    }

    if (!aliasCbu || aliasCbu.trim() === '') {
      setError('⚠️ Debes completar tu email de PayPal o tu ID de Binance en "Editar Perfil".');
      return;
    }

    // VALIDAR QUE NO TENGA RETIROS PENDIENTES - NEW FROM OUTLINE
    try {
      const pendingWithdrawals = await base44.entities.WithdrawalRequest.filter({
        user_id: user.id,
        status: 'pending'
      });

      if (pendingWithdrawals && pendingWithdrawals.length > 0) {
        setError('Ya tienes una solicitud de retiro pendiente. Por favor espera a que sea procesada antes de crear otra.');
        return;
      }
    } catch (err) {
      console.error('Error checking pending withdrawals:', err);
      setError('Error al verificar solicitudes pendientes. Por favor, intenta de nuevo.');
      return;
    }

    // Removed the window.confirm from original code as it's not in outline.
    // The new flow implies direct submission after validations, then a success message and redirect.

    setIsSubmitting(true);

    try {
      // Use the simplified processing time from the outline for request and notifications
      const processingTimeDescription = '10 días hábiles posteriores al cierre del concurso';

      // Crear solicitud de retiro
      const newRequest = await base44.entities.WithdrawalRequest.create({
        user_id: user.id,
        amount: withdrawAmount,
        withdrawal_method: withdrawalMethod,
        account_type: accountType || '', // Ensure it's not undefined
        alias_cbu: aliasCbu,
        full_name: fullName,
        additional_info: additionalInfo || '', // Ensure it's not undefined
        status: 'pending',
        processing_time: processingTimeDescription
      });

      // DESCONTAR LAS ESTRELLAS INMEDIATAMENTE (quedan "retenidas")
      const newStarBalance = Math.round((availableBalance - withdrawAmount) * 100) / 100;
      await base44.entities.Wallet.update(wallet.id, {
        star_credits: newStarBalance
      });
      console.log('✅ Estrellas deducidas:', withdrawAmount);

      // Crear transacción - NEW FROM OUTLINE
      await base44.entities.Transaction.create({
        user_id: user.id,
        type: 'withdrawal',
        amount: -withdrawAmount, // Negative amount for withdrawal
        description: `Retiro de Estrellas ⭐ (${getMethodName(withdrawalMethod)}) - Pendiente`,
        payment_method: withdrawalMethod,
        status: 'pending'
      });

      // Notificar usuario
      await base44.entities.Notification.create({
        user_id: user.id,
        title: '⏳ Solicitud de Retiro Recibida',
        message: `Tu solicitud de ${withdrawAmount.toFixed(2)} Estrellas ⭐ fue recibida. Será procesada en ${processingTimeDescription}.`,
        type: 'withdrawal_requested',
        link: createPageUrl(user.user_type === 'artist' ? 'ArtistDashboard' : 'FanDashboard')
      });

      // === NOTIFICAR A LOS ADMINS (PIEZA AÑADIDA) ===
      try {
        const adminUsers = await base44.entities.User.filter({ role: 'admin' });
        for (const admin of adminUsers) {
          await base44.entities.Notification.create({
            user_id: admin.id,
            title: '💸 Nueva Solicitud de Retiro',
            message: `${user.full_name || user.email} solicitó retirar $${withdrawAmount.toFixed(2)} USD.`,
            type: 'admin_withdrawal_request',
            link: createPageUrl('AdminWithdrawals')
          });
        }
      } catch (e) {
        console.warn('No se pudo notificar a los admins', e);
      }
      // === FIN DE LA PIEZA AÑADIDA ===

      setSuccess(true); // Indicate success
      setAmount(''); // Clear amount field
      // Load data immediately to show updated balance and pending request
      // and then reload again to ensure latest state after the timeout and navigation
      loadData(); 

      // Redirect after a short delay
      setTimeout(() => {
        navigate(createPageUrl(user.user_type === 'artist' ? 'ArtistDashboard' : 'FanDashboard'));
      }, 3000); // 3 seconds delay before redirect

    } catch (err) {
      console.error('Error submitting withdrawal:', err);
      setError('❌ Error al enviar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodName = (method) => {
    const methods = {
      paypal: 'PayPal',
      binance: 'Binance'
    };
    return methods[method] || method;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Procesando', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completado', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rechazado', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const availableStars = parseFloat(wallet?.star_credits) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
            Canjear Estrellas
            <Star3D size={34} />
          </h1>
          <p className="text-gray-600">Cobra en dinero real las estrellas ⭐ que te enviaron tus fans</p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert className="bg-green-50 border-green-200 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>¡Canje Enviado Exitosamente!</AlertTitle>
              <AlertDescription>
                Tu solicitud de canje ha sido recibida y se está procesando. Serás redirigido en breve.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Balance Card */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-yellow-100 text-sm mb-1 flex items-center gap-2">
                    <Star3D size={16} />
                    Estrellas Disponibles para Canje
                  </p>
                  <h2 className="text-5xl font-bold mb-2">{availableStars.toFixed(2)}</h2>
                  <p className="text-yellow-100 text-sm">
                    = ${availableStars.toFixed(2)} USD canjeables
                  </p>
                  <p className="text-xs text-yellow-200 mt-1">
                    💡 1 Estrella ⭐ = 1 USD
                  </p>
                </div>
                <div className="text-right">
                  <Star3D size={96} className="opacity-95" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Información Importante */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Información Importante
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Mínimo de retiro:</strong> 1 Estrella ⭐ (1 USD)</span>
              </li>
              <li className="flex items-start gap-2">
                <Star3D size={16} className="mt-0.5" />
                <span><strong>Conversión:</strong> 1 Estrella ⭐ = 1 USD</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Qué se canjea:</strong> solo las Estrellas ⭐ que te llegan por regalos de fans</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Métodos:</strong> PayPal o Binance, con una cuenta activa a tu nombre</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Tiempo:</strong> 24-48 horas hábiles desde la solicitud</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Comisiones:</strong> el costo de la transferencia lo paga quien recibe</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Datos de pago:</strong> revisalos bien, no nos hacemos cargo de cuentas mal informadas, cerradas o de demoras de PayPal/Binance</span>
              </li>
              <li className="flex items-start gap-2">
                <Trophy className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span><strong>Premio del concurso:</strong> no se cobra acá. La organización lo paga directo a tu PayPal o Binance dentro de los 10 días hábiles del cierre</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Solicitar Canje */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Solicitar Canje de Estrellas ⭐
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!user.withdrawal_method || user.withdrawal_method === '' ? (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Debes configurar tu método de retiro en{' '}
                  <Link to={createPageUrl('EditProfile')} className="underline font-bold">
                    Editar Perfil
                  </Link>{' '}
                  antes de solicitar un canje.
                </AlertDescription>
              </Alert>
            ) : availableStars < 1 ? ( // Updated minimum stars check for display
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  No tienes suficientes Estrellas ⭐ disponibles para canjear (mínimo 1 Estrella). Gana convocatorias o comparte perfiles para acumular Estrellas ⭐.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>📤 Método configurado:</strong> {getMethodName(user.withdrawal_method)}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>👤 Titular:</strong> {user.withdrawal_full_name || 'No configurado'}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>🔖 Cuenta de pago:</strong> {user.withdrawal_alias_cbu || 'No configurado'}
                  </p>
                  {user.withdrawal_additional_info && (
                    <p className="text-sm text-gray-700">
                      <strong>ℹ️ Info adicional:</strong> {user.withdrawal_additional_info}
                    </p>
                  )}
                  <Link to={createPageUrl('EditProfile')}>
                    <Button variant="link" size="sm" className="px-0 text-purple-600 hover:text-purple-800">
                      Cambiar método de retiro
                    </Button>
                  </Link>
                </div>

                <div>
                  <Label htmlFor="amount">Monto a Canjear (Estrellas ⭐)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1" // Minimum amount is 1
                    max={availableStars}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ingresa el monto (mínimo 1)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Disponible: {availableStars.toFixed(2)} Estrellas ⭐ = ${availableStars.toFixed(2)} USD
                  </p>
                  {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
                    <p className="text-sm text-green-600 mt-2 font-semibold">
                      💵 Recibirás: ${parseFloat(amount).toFixed(2)} USD
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={isSubmitting || availableStars < 1} // Disable if insufficient stars
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando Solicitud...
                    </>
                  ) : (
                    <>
                      <Star3D size={18} className="mr-2" />
                      Solicitar Canje
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Historial de Solicitudes */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawalRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tienes solicitudes de canje aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawalRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">
                          {parseFloat(request.amount).toFixed(2)} Estrellas ⭐
                        </p>
                        <p className="text-sm text-gray-600">
                          = ${parseFloat(request.amount).toFixed(2)} USD
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Método:</strong> {getMethodName(request.withdrawal_method)}</p>
                      <p><strong>Cuenta de pago:</strong> {request.alias_cbu}</p>
                      <p><strong>Solicitado:</strong> {new Date(request.created_date).toLocaleString('es-ES')}</p>
                      {request.processing_time && (
                        <p><strong>Tiempo estimado:</strong> {request.processing_time}</p>
                      )}
                      {request.admin_notes && (
                        <p className="text-blue-600"><strong>Nota admin:</strong> {request.admin_notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}