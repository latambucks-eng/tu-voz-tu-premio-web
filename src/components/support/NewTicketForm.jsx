import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { REFUND_CATEGORY, SUPPORT_CATEGORIES } from '@/lib/supportCategories';

export default function NewTicketForm({ user, onCreated }) {
  const [category, setCategory] = useState('consulta_general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const isRefund = category === REFUND_CATEGORY;

  const handleSubmit = async () => {
    setError('');

    if (!subject.trim() || !message.trim()) {
      setError('Completá el asunto y el mensaje de tu consulta.');
      return;
    }
    if (isRefund && (!purchaseEmail.trim() || !orderNumber.trim())) {
      setError('Para solicitar un reembolso, ingresá el correo de compra y el número de orden o ticket.');
      return;
    }

    setIsSending(true);
    try {
      const content = [
        message.trim(),
        isRefund ? `Correo de compra: ${purchaseEmail.trim()}` : null,
        isRefund ? `N° de orden o ticket: ${orderNumber.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n\n');

      await base44.entities.SupportTicket.create({
        user_id: user.id,
        user_name: user.full_name || user.email,
        user_email: user.email,
        subject: subject.trim(),
        category,
        priority: isRefund ? 'high' : 'normal',
        conversation: [
          { role: 'user', content, timestamp: new Date().toISOString() },
        ],
      });

      setIsSent(true);
      setSubject('');
      setMessage('');
      setPurchaseEmail('');
      setOrderNumber('');
      onCreated?.();
    } catch (err) {
      setError('No pudimos enviar tu consulta. Intentá nuevamente en unos minutos.');
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="w-14 h-14 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Consulta enviada</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Recibimos tu solicitud y la responderemos por el sistema de tickets. Podés seguir el estado en
            "Mis Tickets".
          </p>
          <Button onClick={() => setIsSent(false)}>Enviar otra consulta</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactar a Soporte</CardTitle>
        <CardDescription>
          Elegí la categoría de tu consulta para que podamos responderte más rápido.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Elegí una categoría" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORT_CATEGORIES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isRefund && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
            <p className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Antes de enviar tu solicitud
            </p>
            <ul className="list-disc ml-5 space-y-1 text-sm text-amber-900">
              <li>Las estrellas ⭐ <strong>ya enviadas como regalo a un artista no son reembolsables</strong>.</li>
              <li>Solo se reembolsan las estrellas compradas que permanezcan <strong>sin usar en su totalidad</strong>.</li>
              <li>El reintegro se realiza por el <strong>mismo medio de pago original</strong> de la compra.</li>
            </ul>
            <p className="text-sm text-amber-900 mt-2">
              Para procesarlo necesitamos el <strong>correo electrónico de compra</strong> y el{' '}
              <strong>número de orden o ticket</strong>.
            </p>
          </div>
        )}

        {isRefund && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_email">Correo electrónico de compra</Label>
              <Input
                id="purchase_email"
                type="email"
                className="mt-1"
                value={purchaseEmail}
                onChange={(e) => setPurchaseEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="order_number">N° de orden o ticket</Label>
              <Input
                id="order_number"
                className="mt-1"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Ej: 12345678"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="subject">Asunto</Label>
          <Input
            id="subject"
            className="mt-1"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Resumen de tu consulta"
          />
        </div>

        <div>
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            className="mt-1"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Contanos con detalle qué necesitás"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        )}

        <Button onClick={handleSubmit} disabled={isSending} className="w-full sm:w-auto">
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar consulta
        </Button>
      </CardContent>
    </Card>
  );
}