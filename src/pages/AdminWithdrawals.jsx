import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
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
  return <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
};

const WithdrawalDetailsModal = ({ request }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Ver Detalles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalles del Retiro #{request.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Usuario:</p>
            <p className="font-medium">{request.full_name}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Monto:</p>
            <p className="font-bold text-lg text-green-600">${request.amount.toFixed(2)} USD</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Método:</p>
            <p className="font-medium">{request.withdrawal_method}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Tipo de Cuenta:</p>
            <p className="font-medium">{request.account_type}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-gray-500">Alias/CBU:</p>
            <p className="font-medium">{request.alias_cbu}</p>
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
    mutationFn: ({ id, status }) => base44.entities.WithdrawalRequest.update(id, { status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
      
      // Enviar notificación al usuario
      base44.entities.Notification.create({
        user_id: data.user_id,
        title: `Retiro ${status === 'completed' ? 'Completado' : status === 'processing' ? 'En Proceso' : 'Actualizado'}`,
        message: status === 'completed' 
          ? `¡Tu retiro de $${data.amount.toFixed(2)} USD ha sido completado! El dinero debería llegar en las próximas 24-48 horas.`
          : status === 'processing'
          ? `Tu retiro de $${data.amount.toFixed(2)} USD está siendo procesado. Te notificaremos cuando esté completo.`
          : status === 'rejected'
          ? `Tu retiro de $${data.amount.toFixed(2)} USD fue rechazado. Contacta soporte para más información.`
          : `Tu solicitud de retiro de $${data.amount.toFixed(2)} ha sido actualizada a '${status}'.`,
        type: status === 'completed' ? 'withdrawal_completed' : 'withdrawal_processing',
        link: createPageUrl('Withdraw'),
      });
    },
  });

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Retiros</h1>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] })}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refrescar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Retiro</CardTitle>
          <CardDescription>
            Aquí puedes ver y procesar las solicitudes de retiro de estrellas de los usuarios.
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
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{new Date(request.created_date).toLocaleDateString()}</TableCell>
                    <TableCell>{request.full_name}</TableCell>
                    <TableCell className="font-bold">${request.amount.toFixed(2)}</TableCell>
                    <TableCell>{request.withdrawal_method}</TableCell>
                    <TableCell><StatusBadge status={request.status} /></TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <WithdrawalDetailsModal request={request} />
                      <Select
                        value={request.status}
                        onValueChange={(newStatus) => handleStatusChange(request.id, newStatus)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[180px]">
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
                )) : (
                  <TableRow>
                    <TableCell colSpan="6" className="h-24 text-center">
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