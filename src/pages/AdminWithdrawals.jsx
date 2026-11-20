import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, DollarSign, Percent, Send } from 'lucide-react';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const statusLabels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    rejected: 'Rechazado',
  };
  return <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>{statusLabels[status] || status}</Badge>;
};

const WithdrawalDetailsModal = ({ request }) => {
  const gross = parseFloat(request.gross_amount || request.amount) || 0;
  const commission = parseFloat(request.admin_commission) || 0;
  const net = parseFloat(request.net_amount || request.amount) || 0;
  const rate = parseFloat(request.commission_rate) || 30;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Ver Detalles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Detalles del Retiro #{request.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4 text-sm">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Usuario:</p>
            <p className="font-medium">{request.full_name}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Canje bruto:</p>
            <p className="font-medium">{gross.toFixed(2)} ⭐ (${gross.toFixed(2)} USD)</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Comisión Admin ({rate}%):</p>
            <p className="font-bold text-emerald-600">+ ${commission.toFixed(2)} USD</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4 border-t pt-2">
            <p className="text-gray-700 font-semibold">Neto a transferir:</p>
            <p className="font-bold text-lg text-blue-700">${net.toFixed(2)} USD</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4 border-t pt-2">
            <p className="text-gray-500">Método:</p>
            <p className="font-medium uppercase">{request.withdrawal_method}</p>
          </div>
          {request.account_type && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-gray-500">Tipo de Cuenta:</p>
              <p className="font-medium">{request.account_type}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Cuenta / Email / ID:</p>
            <p className="font-medium break-all">{request.alias_cbu}</p>
          </div>
          {request.additional_info && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-gray-500">Info Adicional:</p>
              <p className="font-medium">{request.additional_info}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function AdminWithdrawals() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['withdrawalRequests'],
    queryFn: () => base44.entities.WithdrawalRequest.list('-created_date'),
    initialData: [],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ request, status }) => {
      const updated = await base44.entities.WithdrawalRequest.update(request.id, { status });

      if (status === 'rejected' && request.status !== 'rejected') {
        const refundStars = parseFloat(request.gross_amount || request.amount) || 0;
        if (refundStars > 0) {
          const wallets = await base44.entities.Wallet.filter({ user_id: request.user_id });
          const userWallet = Array.isArray(wallets) ? wallets.at(0) : wallets;
          if (userWallet) {
            const restored = Math.round(((parseFloat(userWallet.star_credits) || 0) + refundStars) * 100) / 100;
            await base44.entities.Wallet.update(userWallet.id, { star_credits: restored });
          }
        }
      }

      const netPaid = parseFloat(request.net_amount || request.amount) || 0;

      await base44.entities.Notification.create({
        user_id: request.user_id,
        title:
          status === 'completed'
            ? '✅ Retiro Completado'
            : status === 'processing'
            ? '⏳ Retiro En Proceso'
            : status === 'rejected'
            ? '❌ Retiro Rechazado'
            : 'Actualización de Retiro',
        message:
          status === 'completed'
            ? `¡Tu retiro de $${netPaid.toFixed(2)} USD netos ha sido completado! El dinero llegará a tu cuenta en las próximas 24-48 horas.`
            : status === 'processing'
            ? `Tu retiro de $${netPaid.toFixed(2)} USD netos está siendo procesado. Te notificaremos cuando esté completo.`
            : status === 'rejected'
            ? `Tu solicitud de retiro fue rechazada y tus estrellas fueron devueltas a tu billetera. Contacta a soporte para más detalles.`
            : `Tu solicitud de retiro de $${netPaid.toFixed(2)} USD ha sido actualizada a '${status}'.`,
        type: status === 'completed' ? 'withdrawal_completed' : 'withdrawal_processing',
        link: createPageUrl('Withdraw'),
      });

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
    },
  });

  const handleStatusChange = (request, newStatus) => {
    updateStatusMutation.mutate({ request, status: newStatus });
  };

  const validRequests = (requests || []).filter((r) => r.status !== 'rejected');
  const totalGross = validRequests.reduce((sum, r) => sum + (parseFloat(r.gross_amount || r.amount) || 0), 0);
  const totalCommission = validRequests.reduce((sum, r) => sum + (parseFloat(r.admin_commission) || 0), 0);
  const totalNet = validRequests.reduce((sum, r) => sum + (parseFloat(r.net_amount || r.amount) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Retiros y Comisiones</h1>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] })}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refrescar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Canjeado Bruto (100%)</p>
              <p className="text-2xl font-bold text-gray-900">${totalGross.toFixed(2)} USD</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-800 font-medium">Tu Comisión Admin (30%)</p>
              <p className="text-2xl font-extrabold text-emerald-700">+ ${totalCommission.toFixed(2)} USD</p>
            </div>
            <Percent className="w-8 h-8 text-emerald-600" />
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Neto a Pagar a Artistas (70%)</p>
              <p className="text-2xl font-bold text-blue-700">${totalNet.toFixed(2)} USD</p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Retiro</CardTitle>
          <CardDescription>
            Visualiza el monto bruto canjeado, tu comisión del 30% y el monto neto a transferir al participante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <p className="text-red-500">Error al cargar las solicitudes.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Bruto ⭐</TableHead>
                  <TableHead>Comisión (30%)</TableHead>
                  <TableHead>Neto a Pagar</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? requests.map((request) => {
                  const gross = parseFloat(request.gross_amount || request.amount) || 0;
                  const commission = parseFloat(request.admin_commission) || 0;
                  const net = parseFloat(request.net_amount || request.amount) || 0;
                  return (
                    <TableRow key={request.id}>
                      <TableCell>{new Date(request.created_date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{request.full_name}</TableCell>
                      <TableCell>{gross.toFixed(2)} ⭐</TableCell>
                      <TableCell className="font-semibold text-emerald-600">+${commission.toFixed(2)}</TableCell>
                      <TableCell className="font-bold text-blue-700">${net.toFixed(2)} USD</TableCell>
                      <TableCell className="uppercase text-xs font-semibold">{request.withdrawal_method}</TableCell>
                      <TableCell><StatusBadge status={request.status} /></TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <WithdrawalDetailsModal request={request} />
                        <Select
                          value={request.status}
                          onValueChange={(newStatus) => handleStatusChange(request, newStatus)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Cambiar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                            <SelectItem value="completed">Completado</SelectItem>
                            <SelectItem value="rejected">Rechazado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan="8" className="h-24 text-center">
                      No hay solicitudes de retiro pendientes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


