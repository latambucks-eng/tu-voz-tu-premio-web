import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Star, Share2, Edit, CheckCircle, Clock, Users, Award, Eye, Plus, Crown, MessageCircle, Upload, MessageSquare } from 'lucide-react';
import BadgeSystem from '../components/gamification/BadgeSystem';
import TransactionHistory from '../components/dashboard/TransactionHistory';

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [activeContests, setActiveContests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    checkProfileCompletion();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Cargar usuario (con manejo de sesión expirada)
      let userData;
      try {
        userData = await base44.auth.me();
      } catch (authError) {
        console.error('Error de autenticación:', authError);
        
        // Si el error es 401, redirigir al login
        if (authError.message?.includes('401') || authError.message?.includes('Unauthorized')) {
          alert('⏱️ Tu sesión expiró. Por favor, inicia sesión nuevamente.');
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        
        throw authError; // Re-throw other errors to be caught by the outer try-catch
      }
      
      if (userData.user_type !== 'artist' && userData.role !== 'admin') {
        alert('Esta página es solo para artistas. Por favor, selecciona el rol de artista.');
        navigate(createPageUrl('SelectRole'));
        return;
      }
      
      setUser(userData);

      // 2. Cargar wallet con manejo robusto de errores
      try {
        const wallets = await base44.entities.Wallet.filter({ user_id: userData.id });
        if (wallets && wallets.length > 0) {
          setWallet(wallets[0]);
        } else {
          // Intentar crear wallet
          try {
            const newWallet = await base44.entities.Wallet.create({
              user_id: userData.id,
              balance: 0,
              star_credits: 0
            });
            setWallet(newWallet);
          } catch (createError) {
            console.error('No se pudo crear wallet:', createError);
            // Establecer wallet por defecto para evitar crashes
            setWallet({
              user_id: userData.id,
              balance: 0,
              star_credits: 0
            });
            setError('⚠️ No se pudo cargar tu billetera. Los datos mostrados pueden no ser actuales. Contacta soporte si persiste.');
          }
        }
      } catch (walletError) {
        console.error('Error al cargar wallet:', walletError);
        
        // Verificar si es error de sesión
        if (walletError.message?.includes('401') || walletError.message?.includes('Unauthorized')) {
          alert('⏱️ Tu sesión expiró. Por favor, inicia sesión nuevamente.');
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        
        // Wallet por defecto como fallback para otros errores
        setWallet({
          user_id: userData.id,
          balance: 0,
          star_credits: 0
        });
        setError('⚠️ Error al cargar tu billetera. Los datos mostrados pueden no estar actualizados.');
      }

      // 3. Cargar participaciones
      const participantData = await base44.entities.Participant.filter(
        { artist_id: userData.id },
        '-created_date'
      );
      const participationsList = Array.isArray(participantData) ? participantData : [];
      setParticipations(participationsList);

      // Calcular estadísticas
      const active = participationsList.filter(p => p.status === 'active').length;
      const totalVotesCount = participationsList.reduce((sum, p) => sum + (p.total_votes || 0), 0);
      setActiveContests(active);
      setTotalVotes(totalVotesCount);

      // 4. Cargar victorias
      const winnerData = await base44.entities.Winner.filter({ artist_id: userData.id });
      setWinnings(Array.isArray(winnerData) ? winnerData : []);

      // 5. Cargar seguidores
      const followers = await base44.entities.Follower.filter({ artist_id: userData.id });
      setFollowersCount(Array.isArray(followers) ? followers.length : 0);

    } catch (error) {
      console.error("Failed to load artist data:", error);
      // More specific error messages for network issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('⚠️ Error de red: No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        setError('Error al cargar datos. Por favor, recarga la página o contacta a soporte.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkProfileCompletion = async () => {
    try {
      const userData = await base44.auth.me();
      
      const isComplete = userData.artist_name && 
                        userData.bio && 
                        userData.profile_image && 
                        userData.country &&
                        userData.phone &&
                        userData.social_instagram &&
                        userData.social_facebook &&
                        userData.social_tiktok;
      
      if (!isComplete) {
        // Verificar si ya existe una notificación reciente
        const existingNotifs = await base44.entities.Notification.filter({
          user_id: userData.id,
          type: 'profile_incomplete'
        });
        
        const now = new Date();
        const recentNotif = existingNotifs.find(n => {
          const notifDate = new Date(n.created_date);
          const daysDiff = (now - notifDate) / (1000 * 60 * 60 * 24);
          return daysDiff < 7;
        });
        
        if (!recentNotif) {
          await base44.entities.Notification.create({
            user_id: userData.id,
            title: '📝 Completa tu perfil',
            message: 'Completa tu perfil de artista para destacarte y recibir más votos en las competencias.',
            type: 'profile_incomplete',
            link: createPageUrl('EditProfile')
          });
        }
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      // If profile check fails due to 401, loadData would have already redirected.
      // If it's another error, we log it but don't prevent dashboard render.
    }
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}${createPageUrl('ArtistProfile')}?id=${user.id}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('¡Enlace a tu perfil público copiado! Compártelo para conseguir votos.');
      }).catch(() => {
        prompt('Copia este enlace:', shareUrl);
      });
    } else {
      prompt('Copia este enlace:', shareUrl);
    }
  };

  const getProfileCompletion = () => {
    if (!user) return 0;
    
    const fields = [
      user.artist_name,
      user.bio,
      user.profile_image,
      user.country,
      user.phone,
      user.social_instagram,
      user.social_facebook,
      user.social_tiktok
    ];
    
    const completed = fields.filter(f => f && f.length > 0).length;
    return Math.round((completed / fields.length) * 100);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <Skeleton className="h-48 w-full mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData}>Reintentar</Button>
        </Card>
      </div>
    );
  }

  const profileCompletion = getProfileCompletion();
  const isProfileComplete = profileCompletion === 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Panel de Artista</h1>
            <p className="text-gray-600">Bienvenido, {user.artist_name || user.full_name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={createPageUrl('Withdraw')}>
              <Button variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                <Star className="w-4 h-4 mr-2 fill-yellow-500" /> Canjear Estrellas
              </Button>
            </Link>
            <Button variant="outline" onClick={handleShareProfile}>
              <Share2 className="w-4 h-4 mr-2" /> Compartir Perfil
            </Button>
            <Link to={createPageUrl('EditProfile')}>
              <Button><Edit className="w-4 h-4 mr-2" /> Editar Perfil</Button>
            </Link>
          </div>
        </motion.div>

        {/* Alerta de perfil incompleto */}
        {!isProfileComplete && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Edit className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 mb-2">Completa tu perfil ({profileCompletion}%)</h3>
                    <p className="text-sm text-orange-800 mb-3">
                      Un perfil completo aumenta tus posibilidades de recibir votos. Completa todos los campos para destacar.
                    </p>
                    <div className="w-full bg-orange-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all" 
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <Link to={createPageUrl('EditProfile')}>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Completar Ahora
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Balance y Estadísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-purple-100 text-sm">Mis Inscripciones</p>
                  <Upload className="w-5 h-5 opacity-50" />
                </div>
                <h2 className="text-3xl font-bold mb-1">
                  {participations.length}
                </h2>
                <p className="text-xs text-purple-100">
                  Se pagan por Passline en cada convocatoria abierta
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.05 }}>
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-yellow-100 text-sm flex items-center gap-1">
                    Estrellas <Star className="w-4 h-4 fill-white" />
                  </p>
                  <Star className="w-5 h-5 opacity-50 fill-white" />
                </div>
                <h2 className="text-3xl font-bold mb-1">
                  {(parseFloat(wallet?.star_credits) || 0).toFixed(2)}
                </h2>
                <p className="text-xs text-yellow-100">
                  Estrellas ⭐ de regalos, canjeables 1 a 1 en USD
                </p>
                <p className="text-xs text-yellow-200 mt-1">
                  💡 1 Estrella = 1 USD • Mínimo de canje: 1 Estrella
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100 text-sm">Mis Seguidores</p>
                  <Users className="w-5 h-5 opacity-50" />
                </div>
                <h2 className="text-3xl font-bold mb-1">{followersCount}</h2>
                <p className="text-xs text-blue-100">
                  {followersCount === 1 ? 'Persona te sigue' : 'Personas te siguen'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.15 }}>
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-green-100 text-sm">Votos Totales</p>
                  <Trophy className="w-5 h-5 opacity-50" />
                </div>
                <h2 className="text-3xl font-bold mb-1">{totalVotes}</h2>
                <p className="text-xs text-green-100">En todas tus participaciones</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Victorias */}
        {winnings.length > 0 && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="mb-8">
            <div className="space-y-4">
              {winnings.map(win => (
                <Card key={win.id} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-xl">
                  <CardContent className="p-6 flex items-center gap-6">
                    <Trophy className="w-16 h-16" />
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-1">¡Felicitaciones!</h3>
                      <p className="text-lg mb-2">
                        Ganaste la convocatoria "{win.contest_name}"
                      </p>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-5 h-5 fill-white" />
                        <p className="text-2xl font-bold">
                          ${parseFloat(win.prize_amount).toFixed(2)} USD
                        </p>
                      </div>
                      <p className="text-sm opacity-90">
                        Premio del concurso · lo abona la organización directamente a tu cuenta
                      </p>
                      {user?.withdrawal_method && user?.withdrawal_alias_cbu ? (
                        <p className="text-sm opacity-90 mt-1">
                          Datos de pago informados: {user.withdrawal_method === 'binance' ? 'Binance' : 'PayPal'} · {user.withdrawal_alias_cbu}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm opacity-95 mt-1 font-semibold">
                            Necesitamos tus datos de pago para transferirte el premio.
                          </p>
                          <Link to={createPageUrl('EditProfile')}>
                            <Button size="sm" variant="secondary" className="mt-2">
                              <Edit className="w-4 h-4 mr-2" />
                              Informar mis datos de pago
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                    <Award className="w-16 h-16 opacity-50" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Insignias */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Mis Insignias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeSystem userId={user.id} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ACCESO RÁPIDO - Nuevo */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🎯 Navegación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={createPageUrl('Contests')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Trophy className="w-4 h-4 mr-2" />
                  Convocatorias Activas
                </Button>
              </Link>
              <Link to={createPageUrl('Winners')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Ganadores
                </Button>
              </Link>
              <Link to={createPageUrl('Community')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Comunidad
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">❓ Ayuda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={createPageUrl('MyTickets')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mis Tickets de Soporte
                </Button>
              </Link>
              <Link to={createPageUrl('FAQ')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Preguntas Frecuentes
                </Button>
              </Link>
              <Link to={createPageUrl('Support')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Centro de Soporte
                </Button>
              </Link>
              <a href="mailto:infotuvoz25@gmail.com" className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacto por Email
                </Button>
              </a>
              <Link to={createPageUrl('Legal')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📋 Términos y Condiciones
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">✨ Para Ti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={createPageUrl('Participate')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Participar como Artista
                </Button>
              </Link>
              <Link to={createPageUrl('EditProfile')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar mi Perfil
                </Button>
              </Link>
              <Link to={createPageUrl('Withdraw')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                  <Star className="w-4 h-4 mr-2 fill-yellow-500" />
                  Canjear Estrellas ⭐
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Historial de Transacciones */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <TransactionHistory user={user} onUpdate={loadData} />
          </motion.div>
        )}

        {/* Participaciones Recientes */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mis Participaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {participations.length > 0 ? (
                <div className="space-y-3">
                  {participations.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium">{p.song_title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3" />
                          {p.total_votes || 0} votos
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {p.status === 'active' && <Badge className="bg-green-100 text-green-800">Activo</Badge>}
                        {p.status === 'pending_payment' && <Badge variant="secondary">Pendiente</Badge>}
                        {p.status === 'disqualified' && <Badge variant="destructive">Descalificado</Badge>}
                        <Link to={createPageUrl('VotingRoom') + `?contestId=${p.contest_id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-2">No tienes participaciones activas</p>
                  <Link to={createPageUrl('Contests')}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ver Convocatorias
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Todas las Participaciones */}
        <h2 className="text-2xl font-bold mb-4">Todas mis Participaciones</h2>
        {participations.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {participations.map(p => (
              <Card key={p.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center flex-wrap gap-2">
                    <span>{p.song_title}</span>
                    {p.status === 'active' && <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/>Activo</Badge>}
                    {p.status === 'pending_payment' && <Badge variant="secondary"><Clock className="w-3 h-3 mr-1"/>Pendiente</Badge>}
                    {p.status === 'disqualified' && <Badge variant="destructive">Descalificado</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center items-center bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                    <div className="text-center">
                      <div className="font-bold text-4xl flex items-center gap-2 justify-center text-purple-600">
                        <Star className="w-8 h-8 fill-current" />
                        {p.total_votes || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Votos Totales</div>
                    </div>
                  </div>
                  <Link to={createPageUrl('VotingRoom') + `?contestId=${p.contest_id}`}>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ir a la Convocatoria
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Aún no has participado</h3>
              <p className="text-gray-500 mb-6">
                Tus videos y estadísticas de convocatoria aparecerán aquí una vez que te inscribas.
              </p>
              <Link to={createPageUrl('Contests')}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Trophy className="w-4 h-4 mr-2" />
                  Explorar Convocatorias
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}