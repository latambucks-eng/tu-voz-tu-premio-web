import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getPrizeSplit } from '@/lib/prize';

export default function TestNotifications() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      alert('Debes iniciar sesión para probar notificaciones');
    }
  };

  const addResult = (type, message, success = true) => {
    setResults(prev => [...prev, {
      type,
      message,
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testNotification = async (type) => {
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    setIsLoading(true);
    try {
      const notifications = {
        vote: {
          title: '⭐ ¡Nuevo voto!',
          message: 'Recibiste un voto de 5 estrellas en "Mi Canción de Prueba". ¡Sigue compartiendo!',
          type: 'vote',
          link: createPageUrl('ArtistDashboard')
        },
        winner: {
          title: '🏆 ¡GANASTE!',
          message: 'Ganaste la convocatoria "Pop Internacional" con 150 votos. Premio: 312 Estrellas ⭐',
          type: 'winner',
          link: createPageUrl('ArtistDashboard')
        },
        withdrawal_requested: {
          title: '⏳ Solicitud de Canje Enviada',
          message: 'Tu solicitud de canje de 50 Estrellas ⭐ ha sido enviada. Te notificaremos cuando sea procesada.',
          type: 'withdrawal_requested',
          link: createPageUrl('Withdraw')
        },
        withdrawal_completed: {
          title: '✅ ¡Canje Completado!',
          message: 'Tu canje de 50 Estrellas ⭐ ($50 USD) ha sido procesado exitosamente.',
          type: 'withdrawal_completed',
          link: createPageUrl('ArtistDashboard')
        },
        profile_incomplete: {
          title: '📝 Completa tu perfil',
          message: 'Completa tu perfil de artista para destacarte y recibir más votos en las competencias.',
          type: 'profile_incomplete',
          link: createPageUrl('EditProfile')
        },
        credit_purchase: {
          title: '💳 Comprobante Enviado',
          message: 'Tu comprobante de $10.50 USD ha sido enviado. Te notificaremos cuando el administrador lo apruebe (24-48hrs).',
          type: 'credit_purchase',
          link: createPageUrl('ArtistDashboard')
        },
        credit_approved: {
          title: '✅ ¡Créditos Aprobados!',
          message: '10.50 créditos han sido agregados a tu cuenta. Ya puedes enviar regalos a tus artistas favoritos.',
          type: 'credit_purchase',
          link: createPageUrl('BuyCredits')
        },
        contest_reminder: {
          title: '🎤 Convocatoria por Finalizar',
          message: 'La convocatoria "Rock Nacional" finaliza en 48 horas. ¡Comparte tu video para más votos!',
          type: 'contest_reminder',
          link: createPageUrl('VotingRoom') + '?contestId=test'
        },
        admin_new_participant: {
          title: '🎵 Nuevo Participante',
          message: 'Juan Pérez se inscribió en "Pop Internacional". Pago verificado: Pendiente.',
          type: 'contest_reminder',
          link: createPageUrl('AdminDashboard')
        },
        admin_new_withdrawal: {
          title: '💸 Nueva Solicitud de Canje',
          message: 'María González solicitó canjear 50 Estrellas ⭐ ($50 USD). Revisa el panel de administración.',
          type: 'withdrawal_requested',
          link: createPageUrl('AdminDashboard')
        }
      };

      const notif = notifications[type];
      if (!notif) {
        addResult(type, 'Tipo de notificación no encontrado', false);
        return;
      }

      await base44.entities.Notification.create({
        user_id: user.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        link: notif.link
      });

      addResult(type, '✅ Notificación creada exitosamente');
      console.log(`🔔 Notificación de prueba creada: ${type}`);

    } catch (error) {
      console.error('Error creating notification:', error);
      addResult(type, `❌ Error: ${error.message}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  const testFinalizationMath = () => {
    console.log('🧮 ===== TEST DE MATEMÁTICAS DE FINALIZACIÓN =====');

    // Caso 1: premio total definido por el administrador = 400 USD
    const test1 = getPrizeSplit(400);
    console.log('TEST 1: premio total $400');
    console.log('  Ganador:', test1.winner);
    console.log('  ✅ OK:', Math.abs(test1.winner - test1.total) < 0.03);

    // Caso 2: premio total 250 USD
    const test2 = getPrizeSplit(250);
    console.log('\nTEST 2: premio total $250');
    console.log('  Ganador:', test2.winner);
    console.log('  ✅ OK:', Math.abs(test2.winner - test2.total) < 0.03);

    // Caso 3: Empate - 2 ganadores
    const test3 = getPrizeSplit(400);
    const test3_per_winner = Math.round((test3.winner / 2) * 100) / 100;

    console.log('\nTEST 3: Empate de 2 ganadores - premio $400');
    console.log('  Total ganadores:', test3.winner);
    console.log('  Por ganador:', test3_per_winner);
    console.log('  Verificación: 2 x', test3_per_winner, '=', test3_per_winner * 2);

    console.log('\n🧮 ===== FIN TEST MATEMÁTICAS =====');
    alert('✅ Tests de matemática ejecutados. Revisa la consola para ver resultados.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Prueba de Notificaciones</h2>
            <p className="text-gray-600 mb-4">
              Debes iniciar sesión para probar el sistema de notificaciones
            </p>
            <Button onClick={() => base44.auth.redirectToLogin(window.location.href)}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">🔔 Test de Notificaciones</h1>
        <p className="text-gray-600 mb-8">Panel de pruebas para el sistema de notificaciones</p>

        <div className="grid gap-6">
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Sistema de Prueba de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Usuario actual:</strong> {user.email} ({user.role === 'admin' ? 'Administrador' : user.user_type === 'artist' ? 'Artista' : 'Fan'})
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Las notificaciones aparecerán en el ícono de campana en la esquina superior derecha
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">🎨 Notificaciones para Artistas</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={() => testNotification('vote')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      ⭐ Nuevo Voto Recibido
                    </Button>
                    <Button
                      onClick={() => testNotification('winner')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      🏆 Ganador de Convocatoria
                    </Button>
                    <Button
                      onClick={() => testNotification('profile_incomplete')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      📝 Perfil Incompleto
                    </Button>
                    <Button
                      onClick={() => testNotification('contest_reminder')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      🎤 Recordatorio de Convocatoria
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">💰 Notificaciones Financieras</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={() => testNotification('credit_purchase')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      💳 Comprobante Enviado
                    </Button>
                    <Button
                      onClick={() => testNotification('credit_approved')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      ✅ Créditos Aprobados
                    </Button>
                    <Button
                      onClick={() => testNotification('withdrawal_requested')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      ⏳ Solicitud de Canje
                    </Button>
                    <Button
                      onClick={() => testNotification('withdrawal_completed')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      ✅ Canje Completado
                    </Button>
                  </div>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">👑 Notificaciones para Administradores</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    <Button
                      onClick={() => testNotification('admin_new_participant')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      🎵 Nuevo Participante
                    </Button>
                    <Button
                      onClick={() => testNotification('admin_new_withdrawal')}
                      disabled={isLoading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      💸 Nueva Solicitud de Canje
                    </Button>
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">📊 Resultados</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                    {results.map((result, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-2 rounded ${
                          result.success ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Bell className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{result.type}</p>
                          <p className="text-xs text-gray-600">{result.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{result.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧮 Test de Matemáticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Verifica que el premio completo se asigne al ganador
              </p>
              <Button onClick={testFinalizationMath} className="w-full">
                Ejecutar Test de Cálculos
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-yellow-900 mb-2">💡 Instrucciones</h3>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-yellow-800">
                <li>Haz clic en cualquier botón para crear una notificación de prueba</li>
                <li>La notificación aparecerá en el ícono de campana (arriba a la derecha)</li>
                <li>Verás un badge rojo con el número de notificaciones no leídas</li>
                <li>Haz clic en la campana para ver todas las notificaciones</li>
                <li>Puedes marcar como leídas o eliminar notificaciones</li>
                <li>Las notificaciones se actualizan automáticamente cada 30 segundos</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}