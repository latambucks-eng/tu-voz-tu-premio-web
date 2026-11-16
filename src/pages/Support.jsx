import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Ticket, Send, HelpCircle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import NewTicketForm from '@/components/support/NewTicketForm';
import SupportFAQ from '@/components/support/SupportFAQ';

// --- Bubble de Chat ---
const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const isAdmin = message.role === 'admin';

  let bubbleClass = 'bg-gray-200 text-gray-900';
  let justification = 'justify-start';
  let author = 'Soporte';

  if (isUser) {
    bubbleClass = 'bg-purple-600 text-white';
    justification = 'justify-end';
    author = 'Tú';
  } else if (isAdmin) {
    bubbleClass = 'bg-blue-500 text-white';
    author = 'Admin';
  }

  return (
    <div className={`flex my-2 ${justification}`}>
      <div className={`max-w-[85%] p-3 rounded-xl text-sm ${bubbleClass}`}>
        <p className="font-bold mb-1">{author}</p>
        {message.content && (
          <ReactMarkdown className="prose prose-sm max-w-none text-current">
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function Support() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState('faq');

  // Estado para los Tickets
  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['supportTickets', user?.id],
    queryFn: () => base44.entities.SupportTicket.filter({ user_id: user.id }, '-updated_date'),
    enabled: !!user,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const loginPrompt = (
    <Card>
      <CardHeader>
        <CardTitle>Iniciá sesión para continuar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Para abrir un ticket y ver su seguimiento necesitás iniciar sesión. Las preguntas frecuentes están disponibles para todos.
        </p>
        <Button
          onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Iniciar Sesión
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-purple-600" />
          Centro de Soporte
        </h1>
        <p className="text-gray-600 mb-6">
          Revisá las preguntas frecuentes o abrí un ticket de consulta para que te responda el equipo.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq"><HelpCircle className="w-4 h-4 mr-2"/>Preguntas Frecuentes</TabsTrigger>
            <TabsTrigger value="new"><Send className="w-4 h-4 mr-2"/>Abrir Ticket</TabsTrigger>
            <TabsTrigger value="tickets"><Ticket className="w-4 h-4 mr-2"/>Mis Tickets</TabsTrigger>
          </TabsList>

          {/* Pestaña de Preguntas Frecuentes */}
          <TabsContent value="faq">
            <SupportFAQ onOpenTicket={() => setActiveTab('new')} />
          </TabsContent>

          {/* Pestaña de Nuevo Ticket / Contacto */}
          <TabsContent value="new">
            {user ? (
              <NewTicketForm
                user={user}
                onCreated={() => {
                  queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
                  queryClient.invalidateQueries({ queryKey: ['mySupportTickets'] });
                }}
              />
            ) : loginPrompt}
          </TabsContent>

          {/* Pestaña de Tickets Anteriores */}
          <TabsContent value="tickets">
            {!user ? loginPrompt : (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {isLoadingTickets ? (
                    <div className="p-4 space-y-4">
                      <Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" />
                    </div>
                  ) : tickets && tickets.length > 0 ? (
                    tickets.map(ticket => (
                      <Card key={ticket.id} className="m-4">
                        <CardHeader>
                          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Ticket #{ticket.id.substring(0,8)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-gray-50">
                            {(ticket.conversation || []).map((msg, index) => (
                              <ChatBubble key={index} message={msg} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                      <p>No tienes tickets de soporte anteriores.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}