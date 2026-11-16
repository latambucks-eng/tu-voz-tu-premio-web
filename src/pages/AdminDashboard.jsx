import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, Trophy, Flag, BarChart, Settings, Link as LinkIcon, MessageCircle, Loader2, DollarSign, Coins, History } from 'lucide-react';
import ContestListView from '../components/admin/ContestListView';
import FinalizeContestDialog from '../components/admin/FinalizeContestDialog';
import PendingTransactionsView from '../components/admin/PendingTransactionsView';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [contests, setContests] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [pendingParticipations, setPendingParticipations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingParticipations, setIsLoadingParticipations] = useState(true);
  const [contestToFinalize, setContestToFinalize] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      await Promise.all([
        loadContests(), 
        loadPendingTransactions(),
        loadPendingParticipations()
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContests = async () => {
    try {
      const contestData = await base44.entities.Contest.list('-created_date');
      setContests(Array.isArray(contestData) ? contestData : []);
    } catch (error) {
      console.error("Error loading contests:", error);
    }
  };

  const loadPendingTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      console.log('🔍 [AdminDashboard] Cargando transacciones pendientes...');
      
      const transactions = await base44.entities.Transaction.filter(
        { 
          status: 'pending',
          type: 'credit_purchase'
        },
        '-created_date'
      );
      
      console.log('✅ [AdminDashboard] Transacciones pendientes cargadas:', transactions?.length || 0);
      
      setPendingTransactions(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error("❌ [AdminDashboard] Error loading transactions:", error);
      setPendingTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const loadPendingParticipations = async () => {
    setIsLoadingParticipations(true);
    try {
      console.log('🔍 [AdminDashboard] Cargando participaciones pendientes...');
      
      const participations = await base44.entities.Participant.filter(
        { status: 'pending_payment' },
        '-created_date'
      );
      
      console.log('✅ [AdminDashboard] Participaciones pendientes cargadas:', participations?.length || 0);
      
      setPendingParticipations(Array.isArray(participations) ? participations : []);
    } catch (error) {
      console.error("❌ [AdminDashboard] Error loading participations:", error);
      setPendingParticipations([]);
    } finally {
      setIsLoadingParticipations(false);
    }
  };

  const handleFinalize = (contest) => {
    setContestToFinalize(contest);
  };

  const handleApproveTransaction = async (tx) => {
    if (tx.status !== 'pending') {
      alert('❌ Esta transacción ya fue procesada');
      await loadPendingTransactions();
      return;
    }

    if (!tx.payment_reference || tx.payment_reference.trim() === '') {
      alert('❌ Esta transacción no tiene los datos del pago. Pídele al usuario el correo o ID de transacción de PayPal.');
      return;
    }

    if (!confirm(`¿Aprobar ${tx.amount} créditos para el usuario?\n\nVerifica el pago con estos datos: ${tx.payment_reference}`)) {
      return;
    }

    try {
      console.log('✅ [AdminDashboard] Aprobando transacción:', tx.id);
      
      // 1. Recargar transacción para verificar estado actual
      const currentTxList = await base44.entities.Transaction.filter({ id: tx.id });
      if (!currentTxList || currentTxList.length === 0 || currentTxList[0].status !== 'pending') {
        alert('❌ La transacción ya fue procesada');
        await loadPendingTransactions();
        return;
      }

      // 2. Marcar como aprobada
      await base44.entities.Transaction.update(tx.id, { status: 'approved' });

      // 3. Actualizar wallet
      const wallets = await base44.entities.Wallet.filter({ user_id: tx.user_id });
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        const newBalance = Math.round((parseFloat(wallet.balance) + parseFloat(tx.amount)) * 100) / 100;
        
        await base44.entities.Wallet.update(wallet.id, { balance: newBalance });

        // 4. Obtener usuario
        const users = await base44.entities.User.filter({ id: tx.user_id });
        const targetUser = users && users.length > 0 ? users[0] : null;

        // 5. Notificar
        await base44.entities.Notification.create({
          user_id: tx.user_id,
          title: '✅ Compra Aprobada',
          message: `Tu compra de ${tx.amount} créditos ha sido aprobada y acreditada a tu cuenta.`,
          type: 'credit_purchase',
          link: createPageUrl(targetUser?.user_type === 'artist' ? 'ArtistDashboard' : 'FanDashboard')
        });

        alert('✅ Transacción aprobada y créditos acreditados');
      } else {
        alert('⚠️ Transacción aprobada pero no se encontró la wallet del usuario.');
      }

      await loadPendingTransactions();
    } catch (error) {
      console.error('❌ Error approving transaction:', error);
      alert('❌ Error al aprobar: ' + error.message);
    }
  };

  const handleRejectTransaction = async (tx) => {
    if (tx.status !== 'pending') {
      alert('❌ Esta transacción ya fue procesada');
      await loadPendingTransactions();
      return;
    }

    const reason = prompt('Motivo del rechazo (será enviado al usuario):');
    if (!reason) return;

    try {
      // 1. Recargar transacción
      const currentTxList = await base44.entities.Transaction.filter({ id: tx.id });
      if (!currentTxList || currentTxList.length === 0 || currentTxList[0].status !== 'pending') {
        alert('❌ La transacción ya fue procesada');
        await loadPendingTransactions();
        return;
      }

      // 2. Marcar como rechazada
      await base44.entities.Transaction.update(tx.id, { status: 'rejected' });

      // 3. Obtener usuario
      const users = await base44.entities.User.filter({ id: tx.user_id });
      const targetUser = users && users.length > 0 ? users[0] : null;

      // 4. Notificar
      await base44.entities.Notification.create({
        user_id: tx.user_id,
        title: '❌ Compra Rechazada',
        message: `Tu compra de ${tx.amount} créditos fue rechazada. Motivo: ${reason}. Contacta soporte si tienes dudas.`,
        type: 'credit_purchase',
        link: createPageUrl('Support')
      });

      alert('✅ Transacción rechazada');
      await loadPendingTransactions();
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      alert('❌ Error al rechazar: ' + error.message);
    }
  };

  const handleApproveParticipation = async (participation) => {
    if (!window.confirm(`¿Aprobar la participación "${participation.song_title}" de ${participation.artist_name}?`)) {
      return;
    }

    try {
      console.log('✅ [AdminDashboard] Aprobando participación:', participation.id);

      // 1. Activar participante
      await base44.entities.Participant.update(participation.id, {
        status: 'active',
        payment_verified: true
      });

      // 2. Aprobar transacción relacionada (si existe)
      if (participation.payment_method !== 'credits') {
        const transactions = await base44.entities.Transaction.filter({
          user_id: participation.artist_id,
          related_contest_id: participation.contest_id,
          type: 'contest_entry',
          status: 'pending'
        });

        if (transactions && transactions.length > 0) {
          await base44.entities.Transaction.update(transactions[0].id, {
            status: 'approved'
          });
          console.log('✅ Transacción relacionada aprobada');
        }
      }

      // 3. 🔥 ACTUALIZAR CONTEST (solo el contador de participantes; el premio lo define el admin)
      const contests = await base44.entities.Contest.filter({ id: participation.contest_id });
      if (contests && contests.length > 0) {
        const contest = contests[0];
        
        // Recalcular participantes activos
        const allParticipants = await base44.entities.Participant.filter({
          contest_id: contest.id,
          status: 'active',
          payment_verified: true
        });
        
        const realCount = allParticipants.length;
        
        await base44.entities.Contest.update(contest.id, {
          current_participants: realCount
        });
        
        console.log(`✅ Contest actualizado: ${realCount} participantes`);
      }

      // 4. Notificar artista
      await base44.entities.Notification.create({
        user_id: participation.artist_id,
        title: '✅ Participación Aprobada',
        message: `Tu participación "${participation.song_title}" ha sido aprobada y ya está activa en la sala de votación.`,
        type: 'contest_reminder',
        link: createPageUrl('VotingRoom') + `?contestId=${participation.contest_id}`
      });

      alert('✅ Participación aprobada exitosamente');
      await Promise.all([loadPendingParticipations(), loadContests()]);

    } catch (error) {
      console.error('❌ Error approving participation:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  const handleRejectParticipation = async (participation) => {
    const reason = prompt('Motivo del rechazo (será enviado al artista):');
    if (!reason) return;

    try {
      // 1. Marcar como rechazada
      await base44.entities.Participant.update(participation.id, {
        status: 'rejected'
      });

      // 2. Rechazar transacción relacionada (si existe)
      if (participation.payment_method !== 'credits') {
        const transactions = await base44.entities.Transaction.filter({
          user_id: participation.artist_id,
          related_contest_id: participation.contest_id,
          type: 'contest_entry',
          status: 'pending'
        });

        if (transactions && transactions.length > 0) {
          await base44.entities.Transaction.update(transactions[0].id, {
            status: 'rejected'
          });
        }
      }

      // 3. Notificar artista
      await base44.entities.Notification.create({
        user_id: participation.artist_id,
        title: '❌ Participación Rechazada',
        message: `Tu participación "${participation.song_title}" fue rechazada. Motivo: ${reason}. Contacta soporte si tienes dudas.`,
        type: 'contest_reminder',
        link: createPageUrl('Support')
      });

      alert('✅ Participación rechazada');
      await loadPendingParticipations();

    } catch (error) {
      console.error('❌ Error rejecting participation:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  const adminSections = [
    {
      title: "Gestionar Convocatorias",
      description: "Crear, editar y finalizar convocatorias.",
      icon: Trophy,
      url: createPageUrl('AdminDashboard'),
      page: 'AdminDashboard',
    },
    {
      title: "Gestionar Retiros",
      description: "Procesar solicitudes de retiro de los usuarios.",
      icon: DollarSign,
      url: createPageUrl('AdminWithdrawals'),
      page: 'AdminWithdrawals',
    },
    {
      title: "Historial de Convocatorias",
      description: "Ganadores destacados de ediciones pasadas.",
      icon: History,
      url: createPageUrl('AdminEditionWinners'),
      page: 'AdminEditionWinners',
    },
    {
      title: "Moderar Contenido",
      description: "Revisar y aprobar/rechazar participaciones y perfiles.",
      icon: Flag,
      url: createPageUrl('ModerationDashboard'),
      page: 'ModerationDashboard',
    },
    {
      title: "Tickets de Soporte",
      description: "Gestionar consultas de usuarios",
      icon: MessageCircle,
      url: createPageUrl('AdminSupport'),
      page: 'AdminSupport',
    },
    {
      title: "Enlaces de Pago",
      description: "Administrar links de PayPal",
      icon: LinkIcon,
      url: createPageUrl('AdminPaymentLinks'),
      page: 'AdminPaymentLinks',
    },
    {
      title: "Estadísticas",
      description: "Ver métricas de la plataforma.",
      icon: BarChart,
      url: createPageUrl('AdminStats'),
      disabled: false,
    },
    {
      title: "Configuración",
      description: "Ajustes generales de la aplicación.",
      icon: Settings,
      url: createPageUrl('AdminSettings'),
      disabled: false,
    },
    {
      title: "Gestionar Usuarios",
      description: "Ver y administrar todos los usuarios.",
      icon: Users,
      url: createPageUrl('AdminUsers'),
      disabled: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminSections.map((section) => (
          <Link to={section.url} key={section.title} className={section.disabled ? 'pointer-events-none' : ''}>
            <Card className={`hover:bg-gray-50 h-full ${section.disabled ? 'bg-gray-100 text-gray-400' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <section.icon className="w-8 h-8" />
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* TABS PARA CONVOCATORIAS, TRANSACCIONES Y PARTICIPACIONES */}
      <Tabs defaultValue="contests" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="contests" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Convocatorias
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2 relative">
            <Coins className="w-4 h-4" />
            Compras
            {!isLoadingTransactions && pendingTransactions.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {pendingTransactions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="participations" className="flex items-center gap-2 relative">
            <Flag className="w-4 h-4" />
            Inscripciones
            {!isLoadingParticipations && pendingParticipations.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {pendingParticipations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contests" className="mt-6">
          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-500" />
              <p className="mt-2 text-gray-500">Cargando convocatorias...</p>
            </div>
          ) : (
            <ContestListView 
              contests={contests} 
              onFinalize={handleFinalize}
              onRefresh={loadContests}
            />
          )}
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <PendingTransactionsView
            transactions={pendingTransactions}
            isLoading={isLoadingTransactions}
            onApprove={handleApproveTransaction}
            onReject={handleRejectTransaction}
            onRefresh={loadPendingTransactions}
          />
        </TabsContent>

        <TabsContent value="participations" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="w-6 h-6 text-orange-600" />
                    Inscripciones Pendientes de Pago
                    {pendingParticipations.length > 0 && (
                      <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                        {pendingParticipations.length}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Aprueba las inscripciones después de verificar el pago
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadPendingParticipations}>
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingParticipations ? (
                <div className="text-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-500" />
                </div>
              ) : pendingParticipations.length === 0 ? (
                <div className="text-center py-12">
                  <Flag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No hay inscripciones pendientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingParticipations.map((participation) => (
                    <Card key={participation.id} className="border-2 border-orange-200 bg-orange-50/30">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 mb-2">
                              {participation.song_title}
                            </h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <p className="text-gray-600">
                                <span className="font-semibold">Artista:</span> {participation.artist_name}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-semibold">Método:</span> {participation.payment_method}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-semibold">Fecha:</span> {new Date(participation.created_date).toLocaleDateString('es-ES')}
                              </p>
                              {participation.payment_proof_url && (
                                <a 
                                  href={participation.payment_proof_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Ver Comprobante →
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[140px]">
                            <Button
                              onClick={() => handleApproveParticipation(participation)}
                              className="w-full bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              ✅ Aprobar
                            </Button>
                            <Button
                              onClick={() => handleRejectParticipation(participation)}
                              variant="destructive"
                              className="w-full"
                              size="sm"
                            >
                              ❌ Rechazar
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
        </TabsContent>
      </Tabs>

      <FinalizeContestDialog
        contest={contestToFinalize}
        open={!!contestToFinalize}
        onClose={() => setContestToFinalize(null)}
        onDone={loadContests}
      />
    </div>
  );
}