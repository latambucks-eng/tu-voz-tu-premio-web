import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Eye, RefreshCw, AlertCircle, Coins, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PendingTransactionsView({ transactions, isLoading, onApprove, onReject, onRefresh }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compras de Créditos Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-blue-600" />
              Compras de Créditos Pendientes
              {transactions.length > 0 && (
                <Badge variant="destructive" className="ml-2">{transactions.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Revisa y aprueba las compras de créditos de los usuarios
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No hay compras pendientes</p>
            <p className="text-gray-400 text-sm mt-2">Las nuevas compras aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className="border-2 border-yellow-200 bg-yellow-50/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Info de la Transacción */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Coins className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{tx.description}</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                            <p className="text-gray-600">
                              <span className="font-semibold">Usuario:</span> {tx.user_id}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Créditos:</span> <span className="text-green-600 font-bold">{tx.amount}</span>
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Método:</span> {tx.payment_method}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Fecha:</span> {new Date(tx.created_date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Datos del pago informados por el usuario */}
                      {tx.payment_reference ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-green-800 font-medium text-sm">Datos del pago informados</p>
                            <p className="text-green-900 text-sm break-all font-mono">{tx.payment_reference}</p>
                          </div>
                        </div>
                      ) : (
                        <Alert variant="destructive" className="mb-0">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <strong>Sin datos de pago:</strong> El usuario aún no informó el correo o ID de la transacción de PayPal.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        onClick={() => onApprove(tx)}
                        disabled={!tx.payment_reference}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => onReject(tx)}
                        variant="destructive"
                        className="w-full"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}