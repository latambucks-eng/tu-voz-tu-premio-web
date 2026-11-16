import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Trash2, Loader2, Link as LinkIcon, DollarSign, AlertCircle } from 'lucide-react';
import { Switch } from "@/components/ui/switch"

export default function AdminPaymentLinks() {
  const queryClient = useQueryClient();
  const [newLink, setNewLink] = useState({ package_amount: '', payment_url: '', is_active: true, payment_method: 'paypal' });
  const [editingLink, setEditingLink] = useState(null);

  const { data: paymentLinks, isLoading } = useQuery({
    queryKey: ['paymentLinksAdmin'],
    queryFn: () => base44.entities.PaymentLink.list('package_amount'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentLinksAdmin']);
      setNewLink({ package_amount: '', payment_url: '', is_active: true, payment_method: 'paypal' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PaymentLink.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentLinksAdmin']);
      setEditingLink(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PaymentLink.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentLinksAdmin']);
    },
  });

  const handleSaveNewLink = (e) => {
    e.preventDefault();
    if (!newLink.package_amount || !newLink.payment_url) {
      alert('Por favor completa todos los campos.');
      return;
    }
    createMutation.mutate({
      ...newLink,
      package_amount: parseFloat(newLink.package_amount),
    });
  };

  const handleUpdateLink = (e) => {
    e.preventDefault();
    if (!editingLink || !editingLink.package_amount || !editingLink.payment_url) {
      alert('Por favor completa todos los campos.');
      return;
    }
    const { id, ...data } = editingLink;
    updateMutation.mutate({ 
        id, 
        data: {
            ...data,
            package_amount: parseFloat(data.package_amount)
        } 
    });
  };
  
  const renderLinkForm = (linkData, setLinkData, submitHandler, title, buttonText, mutation) => (
    <form onSubmit={submitHandler}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="package_amount" className="flex items-center gap-2"><DollarSign className="w-4 h-4"/>Monto del Paquete (USD)</Label>
            <Input
                id="package_amount"
                type="number"
                step="0.01"
                placeholder="Ej: 5"
                value={linkData.package_amount}
                onChange={(e) => setLinkData({ ...linkData, package_amount: e.target.value })}
                required
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="payment_url" className="flex items-center gap-2"><LinkIcon className="w-4 h-4"/>URL de Pago de PayPal</Label>
            <Input
                id="payment_url"
                type="url"
                placeholder="https://..."
                value={linkData.payment_url}
                onChange={(e) => setLinkData({ ...linkData, payment_url: e.target.value })}
                required
            />
        </div>
        <div className="flex items-center space-x-2">
            <Switch
                id="is_active"
                checked={linkData.is_active}
                onCheckedChange={(checked) => setLinkData({ ...linkData, is_active: checked })}
            />
            <Label htmlFor="is_active">Activo</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {buttonText}
        </Button>
        {editingLink && linkData.id === editingLink.id && (
            <Button variant="ghost" onClick={() => setEditingLink(null)} className="ml-2">Cancelar</Button>
        )}
      </CardFooter>
    </form>
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Gestionar Enlaces de Pago</h1>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-700" />
        <AlertDescription className="text-blue-800">
          Aquí puedes crear y administrar los enlaces de pago de PayPal. Estos enlaces son los que los usuarios utilizarán para comprar créditos. 
          Asegúrate de que el monto del paquete coincida exactamente con el creado en PayPal (1 crédito = 1 USD).
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Columna para agregar nuevo enlace */}
        <Card>
            {renderLinkForm(newLink, setNewLink, handleSaveNewLink, "Agregar Nuevo Enlace", "Guardar Enlace", createMutation)}
        </Card>

        {/* Columna para listar enlaces existentes */}
        <Card>
          <CardHeader>
            <CardTitle>Enlaces Existentes</CardTitle>
            <CardDescription>Edita o elimina los enlaces de pago actuales.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : paymentLinks && paymentLinks.length > 0 ? (
              <div className="space-y-4">
                {paymentLinks.map(link => (
                  <div key={link.id}>
                    {editingLink?.id === link.id ? (
                        <Card className="bg-gray-50">
                            {renderLinkForm(editingLink, setEditingLink, handleUpdateLink, "Editando Enlace", "Guardar Cambios", updateMutation)}
                        </Card>
                    ) : (
                        <div className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                            <div>
                                <p className="font-semibold">${parseFloat(link.package_amount).toFixed(2)} USD</p>
                                <p className={`text-sm ${link.is_active ? 'text-green-600' : 'text-red-600'}`}>{link.is_active ? 'Activo' : 'Inactivo'}</p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">{link.payment_url}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingLink(link)}>Editar</Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                    if (window.confirm('¿Estás seguro que quieres eliminar este enlace?')) {
                                        deleteMutation.mutate(link.id);
                                    }
                                }}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No hay enlaces de pago creados.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}