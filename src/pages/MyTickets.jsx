import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    open: { icon: MessageSquare, label: 'Abierto', className: 'bg-blue-100 text-blue-800' },
    in_progress: { icon: Clock, label: 'En Progreso', className: 'bg-yellow-100 text-yellow-800' },
    resolved: { icon: CheckCircle, label: 'Resuelto', className: 'bg-green-100 text-green-800' },
    closed: { icon: CheckCircle, label: 'Cerrado', className: 'bg-gray-100 text-gray-800' },
  };
  const config = statusConfig[status] || statusConfig.closed;
  return (
    <Badge className={config.className}>
      <config.icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default function MyTickets() {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: tickets, isLoading: isLoadingTickets, error } = useQuery({
    queryKey: ['mySupportTickets', user?.id],
    queryFn: () => base44.entities.SupportTicket.filter({ user_id: user.id }, '-created_date'),
    enabled: !!user,
  });

  if (isLoadingUser || isLoadingTickets) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-8">Error al cargar los tickets de soporte.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Mis Tickets de Soporte</CardTitle>
            <CardDescription>Aquí puedes ver el historial y el estado de tus consultas.</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets && tickets.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {tickets.map((ticket) => (
                  <AccordionItem value={ticket.id} key={ticket.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full pr-4">
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">{ticket.subject}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Creado: {new Date(ticket.created_date).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                        <StatusBadge status={ticket.status} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-gray-50 rounded-b-lg">
                      <h4 className="font-semibold mb-2">Conversación:</h4>
                      <div className="space-y-4">
                        {(ticket.conversation || []).map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-2 text-right">
                                {new Date(msg.timestamp).toLocaleString('es-AR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {ticket.admin_notes && (
                        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                          <h5 className="font-semibold text-yellow-800">Nota del Administrador:</h5>
                          <p className="text-sm text-yellow-700">{ticket.admin_notes}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">No tienes tickets de soporte</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  Si tienes alguna pregunta o problema, no dudes en contactarnos.
                </p>
                <Link to={createPageUrl('Support')}>
                  <Button>Crear un Nuevo Ticket</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}