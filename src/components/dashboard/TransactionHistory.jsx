import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, CheckCircle, Clock, AlertCircle, Loader2, Coins, Trophy, DollarSign, Eye, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

export default function TransactionHistory({ user, onUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      loadTransactions();
    }
  }, [user]);

  // Auto-recarga cuando el usuario vuelve a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && user.id) {
        console.log('👁️ Usuario volvió a la pestaña, recargando transacciones...');
        loadTransactions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const loadTransactions = async () => {
    if (!user || !user.id) {
      setError('Usuario no identificado');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 ===== DEBUG TRANSACTION HISTORY =====');
      console.log('🔍 User ID:', user.id);
      console.log('🔍 User Email:', user.email);
      console.log('🔍 User Role:', user.role);
      
      // PASO 1: Intentar listar TODAS las transacciones (sin filtro) para ver si RLS funciona
      let allTransactionsNoFilter = [];
      try {
        allTransactionsNoFilter = await base44.entities.Transaction.list('-created_date', 100);
        console.log('✅ Total transacciones SIN filtro (RLS aplicado):', allTransactionsNoFilter?.length || 0);
        if (allTransactionsNoFilter && allTransactionsNoFilter.length > 0) {
          console.log('🔍 Primera transacción SIN filtro:', {
            id: allTransactionsNoFilter[0].id,
            user_id: allTransactionsNoFilter[0].user_id,
            created_by: allTransactionsNoFilter[0].created_by,
            type: allTransactionsNoFilter[0].type,
            amount: allTransactionsNoFilter[0].amount
          });
        }
      } catch (noFilterError) {
        console.error('❌ Error listando sin filtro:', noFilterError);
      }
      
      // PASO 2: Intentar con filtro user_id
      let transactionsByUserId = [];
      try {
        transactionsByUserId = await base44.entities.Transaction.filter(
          { user_id: user.id },
          '-created_date'
        );
        console.log('✅ Transacciones filtradas por user_id:', transactionsByUserId?.length || 0);
        if (transactionsByUserId && transactionsByUserId.length > 0) {
          console.log('🔍 Primera transacción filtrada:', {
            id: transactionsByUserId[0].id,
            user_id: transactionsByUserId[0].user_id,
            created_by: transactionsByUserId[0].created_by,
            type: transactionsByUserId[0].type
          });
        }
      } catch (userIdError) {
        console.error('❌ Error filtrando por user_id:', userIdError);
      }
      
      // PASO 3: Intentar con filtro created_by
      let transactionsByCreatedBy = [];
      try {
        transactionsByCreatedBy = await base44.entities.Transaction.filter(
          { created_by: user.email },
          '-created_date'
        );
        console.log('✅ Transacciones filtradas por created_by:', transactionsByCreatedBy?.length || 0);
      } catch (createdByError) {
        console.error('❌ Error filtrando por created_by:', createdByError);
      }
      
      // COMBINAR RESULTADOS (eliminar duplicados por ID)
      const combinedTransactions = [...allTransactionsNoFilter, ...transactionsByUserId, ...transactionsByCreatedBy];
      const uniqueTransactions = Array.from(
        new Map(combinedTransactions.map(t => [t.id, t])).values()
      ).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      
      console.log('📊 Total transacciones ÚNICAS:', uniqueTransactions.length);
      console.log('🔍 ===== FIN DEBUG =====');
      
      setDebugInfo({
        noFilter: allTransactionsNoFilter.length,
        byUserId: transactionsByUserId.length,
        byCreatedBy: transactionsByCreatedBy.length,
        unique: uniqueTransactions.length
      });
      
      setTransactions(uniqueTransactions);
    } catch (err) {
      console.error('❌ Error loading transactions:', err);
      setError('Error al cargar transacciones: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTransactions();
    setIsRefreshing(false);
  };

  const handleReportPayment = async (transaction) => {
    if (!transaction || !transaction.id) {
      alert('❌ Error: Transacción no válida');
      return;
    }

    // VALIDACIÓN: Verificar que el usuario sea el dueño de la transacción
    if (transaction.user_id !== user.id && transaction.created_by !== user.email) {
      alert('❌ Error: No tienes permiso para modificar esta transacción');
      return;
    }

    // VALIDACIÓN: Verificar que la transacción esté en estado correcto
    if (transaction.status !== 'pending') {
      alert('❌ Esta transacción ya fue procesada y no puede modificarse');
      return;
    }

    const reference = window.prompt(
      'Escribe el correo electrónico o el ID de la transacción con el que pagaste en PayPal (no hace falta subir comprobantes):'
    );

    if (reference === null) return;
    if (reference.trim().length < 4) {
      alert('❌ Ingresa un correo electrónico o ID de transacción válido');
      return;
    }

    setUploadingId(transaction.id);
    setError(null);

    try {
      await base44.entities.Transaction.update(transaction.id, {
        payment_reference: reference.trim()
      });

      alert('✅ Datos de pago registrados. Un administrador lo revisará en 24-48 horas.');

      await loadTransactions();

      // Notificar al componente padre para que recargue el wallet si es necesario
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error saving payment reference:', err);
      alert('❌ Error al guardar los datos del pago. Por favor, intenta de nuevo o contacta soporte.');
    } finally {
      setUploadingId(null);
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'credit_purchase': return <Coins className="w-5 h-5 text-blue-600" />;
      case 'contest_entry': return <Upload className="w-5 h-5 text-purple-600" />;
      case 'prize_won': return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'withdrawal': return <DollarSign className="w-5 h-5 text-green-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user || !user.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Cargando usuario...</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historial de Transacciones
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Recargando...' : 'Recargar'}
          </Button>
        </div>
        {debugInfo && (
          <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
            <p>🔍 Debug: Sin filtro: {debugInfo.noFilter} | Por user_id: {debugInfo.byUserId} | Por created_by: {debugInfo.byCreatedBy} | Únicas: {debugInfo.unique}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map(tx => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {tx.created_date ? new Date(tx.created_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Fecha no disponible'}
                    </p>
                    {tx.payment_method && (
                      <p className="text-xs text-gray-500">
                        Método: {tx.payment_method}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <p className={`font-bold text-lg ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}{parseFloat(tx.amount).toFixed(2)}
                  </p>
                  {getStatusBadge(tx.status)}
                  
                  {tx.type === 'credit_purchase' && tx.status === 'pending' && !tx.payment_reference && (
                    <Button
                      size="sm"
                      onClick={() => handleReportPayment(tx)}
                      disabled={uploadingId === tx.id}
                      className="mt-1"
                    >
                      {uploadingId === tx.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 mr-1" />
                          Informar datos del pago
                        </>
                      )}
                    </Button>
                  )}
                  
                  {tx.payment_reference && (
                    <p className="text-xs text-gray-500 text-right break-all">
                      Pago: {tx.payment_reference}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No tienes transacciones aún</p>
            <p className="text-xs text-gray-400 mb-4">Las compras, participaciones y premios aparecerán aquí</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar Transacciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}