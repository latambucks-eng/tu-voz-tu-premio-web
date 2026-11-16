import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Eye, ExternalLink, Clock, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ModerationDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user, filter]);

  const checkAdmin = async () => {
    try {
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl('Home'));
        return;
      }
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl('Home'));
    }
  };

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const filterCondition = filter === 'all' ? {} : { status: filter };
      const allReports = await base44.entities.ContentReport.filter(filterCondition, '-created_date');
      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for loadPendingParticipations to make handleApprove callable.
  // Note: This function is not fully integrated into the UI or state of this ModerationDashboard
  // which primarily handles content reports. It's added to fulfill the dependency of handleApprove.
  const loadPendingParticipations = async () => {
    console.log("loadPendingParticipations called (stub). This function should load pending participations for a dedicated UI.");
    // In a full implementation, this would fetch participations and update a state variable.
    // Example: const participations = await base44.entities.Participant.filter({ status: 'pending' });
    // setPendingParticipations(participations);
  };

  const handleApprove = async (participation) => {
    if (!window.confirm(`¿Aprobar la participación "${participation.song_title}"?`)) {
      return;
    }

    try {
      // 1. Activar participante
      await base44.entities.Participant.update(participation.id, {
        status: 'active',
        payment_verified: true
      });

      // 2. Si había transacción pendiente, aprobarla
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
        }
      }

      // 3. Actualizar Contest (AHORA COMO ADMIN SÍ PUEDE)
      const contests = await base44.entities.Contest.filter({ id: participation.contest_id });
      if (contests && contests.length > 0) {
        const contest = contests[0];
        
        await base44.entities.Contest.update(contest.id, {
          current_participants: (contest.current_participants || 0) + 1
        });
      }

      // 4. Notificar artista
      await base44.entities.Notification.create({
        user_id: participation.artist_id,
        title: '✅ Participación Aprobada',
        message: `Tu participación "${participation.song_title}" ha sido aprobada y ya está activa.`,
        type: 'contest_reminder',
        link: createPageUrl('VotingRoom') + `?contestId=${participation.contest_id}`
      });

      alert('✅ Participación aprobada exitosamente');
      await loadPendingParticipations();

    } catch (error) {
      console.error('Error approving participation:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    setIsProcessing(true);
    try {
      await base44.entities.ContentReport.update(reportId, {
        status: newStatus,
        admin_notes: adminNotes,
        resolution_date: new Date().toISOString()
      });

      const report = reports.find(r => r.id === reportId);
      if (report) {
        await base44.entities.Notification.create({
          user_id: report.reporter_id,
          title: `📋 Actualización de Reporte`,
          message: `Tu reporte ha sido ${newStatus === 'resolved' ? 'resuelto' : 'rechazado'}. ${adminNotes ? `Nota: ${adminNotes}` : ''}`,
          type: 'profile_incomplete'
        });
      }

      alert(`✅ Reporte ${newStatus === 'resolved' ? 'resuelto' : 'rechazado'} exitosamente`);
      setSelectedReport(null);
      setAdminNotes('');
      await loadReports();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Error al actualizar el reporte');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      under_review: { label: 'En Revisión', className: 'bg-blue-100 text-blue-800' },
      resolved: { label: 'Resuelto', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rechazado', className: 'bg-red-100 text-red-800' }
    };
    return config[status] || config.pending;
  };

  const getReasonLabel = (reason) => {
    const labels = {
      copyright_infringement: 'Infracción de Derechos de Autor',
      inappropriate_content: 'Contenido Inapropiado',
      spam: 'Spam',
      harassment: 'Acoso',
      fake_profile: 'Perfil Falso',
      external_theft: 'Robo Externo',
      other: 'Otro'
    };
    return labels[reason] || reason;
  };

  const statsData = {
    pending: reports.filter(r => r.status === 'pending').length,
    under_review: reports.filter(r => r.status === 'under_review').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Verificando permisos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Moderación</h1>
          <p className="text-gray-600">Gestiona reportes de contenido y denuncias de abuso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{statsData.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Revisión</p>
                  <p className="text-3xl font-bold text-blue-600">{statsData.under_review}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resueltos</p>
                  <p className="text-3xl font-bold text-green-600">{statsData.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rechazados</p>
                  <p className="text-3xl font-bold text-red-600">{statsData.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pendientes ({statsData.pending})</TabsTrigger>
            <TabsTrigger value="under_review">En Revisión ({statsData.under_review})</TabsTrigger>
            <TabsTrigger value="resolved">Resueltos ({statsData.resolved})</TabsTrigger>
            <TabsTrigger value="rejected">Rechazados ({statsData.rejected})</TabsTrigger>
            <TabsTrigger value="all">Todos ({reports.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">Cargando reportes...</p>
                </CardContent>
              </Card>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Flag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay reportes en esta categoría</p>
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{getReasonLabel(report.reason)}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span>Reportado por: <strong>{report.reporter_name}</strong></span>
                            <span>•</span>
                            <span>{new Date(report.created_date).toLocaleDateString('es-AR')}</span>
                            <span>•</span>
                            <Badge className={getStatusBadge(report.status).className}>
                              {getStatusBadge(report.status).label}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{report.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Tipo: <strong>{report.reported_content_type}</strong></span>
                        {report.evidence_url && (
                          <>
                            <span>•</span>
                            <a 
                              href={report.evidence_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              Ver Evidencia <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {selectedReport && (
          <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detalles del Reporte</DialogTitle>
                <DialogDescription>
                  ID: {selectedReport.id} | Creado: {new Date(selectedReport.created_date).toLocaleString('es-AR')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reportado por:</Label>
                    <p className="font-semibold">{selectedReport.reporter_name}</p>
                  </div>
                  <div>
                    <Label>Estado:</Label>
                    <Badge className={getStatusBadge(selectedReport.status).className}>
                      {getStatusBadge(selectedReport.status).label}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Motivo:</Label>
                  <p className="font-semibold">{getReasonLabel(selectedReport.reason)}</p>
                </div>

                <div>
                  <Label>Descripción:</Label>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.evidence_url && (
                  <div>
                    <Label>Evidencia:</Label>
                    <a 
                      href={selectedReport.evidence_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2 mt-1"
                    >
                      {selectedReport.evidence_url} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                <div>
                  <Label>Tipo de Contenido:</Label>
                  <p>{selectedReport.reported_content_type}</p>
                </div>

                {selectedReport.admin_notes && (
                  <div>
                    <Label>Notas del Administrador:</Label>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedReport.admin_notes}</p>
                  </div>
                )}

                {(selectedReport.status === 'pending' || selectedReport.status === 'under_review') && (
                  <div>
                    <Label htmlFor="admin-notes">Notas del Administrador:</Label>
                    <Textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Agrega notas sobre la resolución de este caso..."
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                {(selectedReport.status === 'pending' || selectedReport.status === 'under_review') && (
                  <div className="flex gap-2 w-full justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedReport(null)}
                    >
                      Cerrar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus(selectedReport.id, 'rejected')}
                      disabled={isProcessing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolver
                    </Button>
                  </div>
                )}
                {(selectedReport.status === 'resolved' || selectedReport.status === 'rejected') && (
                  <Button variant="outline" onClick={() => setSelectedReport(null)}>
                    Cerrar
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}