import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Link as LinkIcon, Copy, Users, Gift, Award, Share2, Trophy, DollarSign, TrendingUp, Heart, MessageCircle, Coins, MessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import BadgeSystem from '../components/gamification/BadgeSystem';
import TransactionHistory from '../components/dashboard/TransactionHistory';

export default function FanDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [activeArtists, setActiveArtists] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated state variables
  const [following, setFollowing] = useState([]); // Replaces followedArtists
  const [shares, setShares] = useState([]);
  const [votes, setVotes] = useState([]); // New state for votes
  const [contestStats, setContestStats] = useState([]);

  useEffect(() => {
    loadData(); // Renamed from loadFanData
  }, []);

  const loadData = async () => { // Renamed from loadFanData
    setIsLoading(true);
    setError(null);
    try {
      // 1. Cargar usuario (con manejo de sesión expirada)
      let userData;
      try {
        userData = await base44.auth.me();
      } catch (authError) {
        console.error('Error de autenticación:', authError);
        
        if (authError.message?.includes('401') || authError.message?.includes('Unauthorized')) {
          alert('⏱️ Tu sesión expiró. Por favor, inicia sesión nuevamente.');
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        
        throw authError;
      }
      
      if (userData.user_type !== 'fan' && userData.role !== 'admin') {
        alert('Esta página es solo para fans. Por favor, selecciona el rol de fan.');
        navigate(createPageUrl('SelectRole'));
        return;
      }
      
      setUser(userData);

      // 2. Cargar wallet con manejo robusto
      try {
        const wallets = await base44.entities.Wallet.filter({ user_id: userData.id });
        if (wallets && wallets.length > 0) {
          setWallet(wallets[0]);
        } else {
          try {
            const newWallet = await base44.entities.Wallet.create({
              user_id: userData.id,
              balance: 0,
              star_credits: 0
            });
            setWallet(newWallet);
          } catch (createError) {
            console.error('No se pudo crear wallet:', createError);
            setWallet({ user_id: userData.id, balance: 0, star_credits: 0 });
            setError('⚠️ No se pudo cargar tu billetera. Contacta soporte si persiste.');
          }
        }
      } catch (walletError) {
        console.error('Error al cargar wallet:', walletError);
        
        if (walletError.message?.includes('401') || walletError.message?.includes('Unauthorized')) {
          alert('⏱️ Tu sesión expiró. Por favor, inicia sesión nuevamente.');
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        
        setWallet({ user_id: userData.id, balance: 0, star_credits: 0 });
        setError('⚠️ Error al cargar tu billetera.');
      }

      // 3. Cargar shares del fan
      const shareData = await base44.entities.FanShare.filter(
        { fan_id: userData.id },
        '-created_date'
      );
      setShares(Array.isArray(shareData) ? shareData : []);

      // 4. Cargar artistas seguidos
      const followData = await base44.entities.Follower.filter({ fan_id: userData.id });
      setFollowing(Array.isArray(followData) ? followData : []);

      // 5. Cargar votos
      const voteData = await base44.entities.Vote.filter({ voter_id: userData.id });
      setVotes(Array.isArray(voteData) ? voteData : []);

      // Calcular estadísticas por convocatoria
      const sharesByContest = {};
      
      // Primero obtener todos los participantes y concursos de una sola vez
      let allParticipants = [];
      let allContests = [];
      try {
        allParticipants = await base44.entities.Participant.filter({ status: 'active' });
        allContests = await base44.entities.Contest.list();
      } catch (err) {
        console.warn('Error loading participants/contests:', err);
      }
      
      // Procesar shares
      for (const share of (Array.isArray(shareData) ? shareData : [])) {
        try {
          // Buscar participante en el array ya cargado
          const participant = allParticipants.find(p => p.artist_id === share.artist_id);
          
          if (participant) {
            const contestId = participant.contest_id;
            
            if (!sharesByContest[contestId]) {
              const contest = allContests.find(c => c.id === contestId);
              if (contest) {
                sharesByContest[contestId] = {
                  contest: contest,
                  shareCount: 0,
                  artistsShared: new Set()
                };
              }
            }
            
            if (sharesByContest[contestId]) {
              sharesByContest[contestId].shareCount++;
              sharesByContest[contestId].artistsShared.add(share.artist_id);
            }
          }
        } catch (err) {
          console.warn('Error processing share:', err);
        }
      }

      const contestStatsList = Object.entries(sharesByContest)
        .map(([contestId, data]) => ({
          contestId,
          contest: data.contest,
          shareCount: data.shareCount,
          artistCount: data.artistsShared.size
        }))
        .sort((a, b) => b.shareCount - a.shareCount);

      setContestStats(contestStatsList);

      // Cargar artistas activos (Existing logic)
      const activeContests = await base44.entities.Contest.filter({ status: 'voting' });
      if (!activeContests || activeContests.length === 0) {
        setActiveArtists([]);
      } else {
        const contestIds = activeContests.map(c => c.id);
        const participants = await base44.entities.Participant.filter({
          status: 'active'
        });
        
        const validParticipants = Array.from(new Set(Array.isArray(participants) ? participants.filter(p => contestIds.includes(p.contest_id)).map(p => p.artist_id) : [])).map(artistId => {
          // Find one participant object for this artistId to get artist_name and artist_image
          const participant = participants.find(p => p.artist_id === artistId);
          return {
            artist_id: artistId,
            artist_name: participant ? participant.artist_name : 'Artista Desconocido',
            artist_image: participant ? participant.artist_image : null
          };
        });
        
        setActiveArtists(validParticipants);
      }
    } catch (error) {
      console.error("Failed to load fan data:", error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('⚠️ Error de red: No se pudo conectar con el servidor.');
      } else {
        setError('Error al cargar datos. Por favor, recarga la página.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedArtistId && user?.id) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${origin}${createPageUrl('ArtistProfile')}?id=${selectedArtistId}&ref=${user.id}`;
      setShareLink(link);
    } else {
      setShareLink('');
    }
  }, [selectedArtistId, user]);
  
  const copyToClipboard = async () => {
    if (!shareLink) {
      alert('Por favor selecciona un artista primero');
      return;
    }

    // VALIDAR QUE EL ARTISTA SIGUE ACTIVO
    const selectedArtist = activeArtists.find(a => a.artist_id === selectedArtistId);
    if (!selectedArtist) {
      alert('❌ Este artista ya no está participando en convocatorias activas.');
      setSelectedArtistId('');
      setShareLink('');
      return;
    }

    try {
      // PRIMERO REGISTRAR EL SHARE
      try {
        await base44.entities.FanShare.create({
          fan_id: user.id,
          fan_name: user.full_name || user.email,
          artist_id: selectedArtistId,
          artist_name: selectedArtist.artist_name,
          share_platform: 'copy_link'
        });
        console.log('✅ Compartido registrado');
      } catch (shareError) {
        console.error('❌ Error registrando share:', shareError);
        // Continuar con copia del enlace aunque falle el registro
      }

      // LUEGO COPIAR AL PORTAPAPELES
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLink);
        alert(
          '✅ ¡Enlace copiado al portapapeles!\n\n' +
          '🎯 Comparte en:\n' +
          '• WhatsApp • Facebook • Instagram • TikTok • Twitter'
        );
      } else {
        prompt('Copia este enlace:', shareLink);
      }

      // Recargar datos para actualizar estadísticas
      setTimeout(() => {
        loadData();
      }, 500);

    } catch (error) {
      console.error('Error en copyToClipboard:', error);
      alert('❌ Error al copiar el enlace. Por favor, intenta de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Card className="p-6 text-center max-w-md">
          <CardTitle className="text-red-600 mb-4">Error</CardTitle>
          <CardContent>
            <p className="text-lg mb-4">{error}</p>
            <Button onClick={loadData}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Panel de Fan
          </h1>
          <p className="text-gray-600">Bienvenido, {user?.full_name}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 fill-white" />
                <div className="text-3xl font-bold mb-1">
                  {(parseFloat(wallet?.star_credits) || 0).toFixed(2)}
                </div>
                <div className="text-sm text-yellow-100 flex items-center justify-center gap-1">
                  Saldo canjeable <Star className="w-3 h-3 fill-white" />
                </div>
                <div className="text-xs text-yellow-100 mt-1">
                  = ${(parseFloat(wallet?.star_credits) || 0).toFixed(2)} USD en estrellas ⭐
                </div>
                <div className="text-xs text-yellow-200 mt-1">
                  💡 1 Estrella = 1 USD • Mínimo de canje: 1 Estrella
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.05 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">
                  {(parseFloat(wallet?.balance) || 0).toFixed(2)}
                </div>
                <div className="text-sm text-blue-100">
                  Créditos Disponibles
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  Para enviar regalos
                </div>
                <Link to={createPageUrl('BuyCredits')}>
                  <Button size="sm" variant="secondary" className="mt-2 text-blue-700 bg-white/90 hover:bg-white text-xs">
                    Recargar Saldo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <Share2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{shares.length}</div>
                <div className="text-sm text-gray-600">Compartidos Totales</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{votes.length}</div>
                <div className="text-sm text-gray-600">Votos Otorgados</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{following.length}</div>
                <div className="text-sm text-gray-600">Artistas Siguiendo</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Historial de Transacciones */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            {user && <TransactionHistory user={user} />}
        </motion.div>
        
        {/* Información importante */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="text-yellow-500"/>
              Cómo participa un fan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="font-semibold text-red-900 mb-2">🚫 IMPORTANTE: NO te inscribas en la convocatoria</p>
              <p className="text-sm text-red-800">
                Los fans <strong>NO necesitan inscribirse</strong> en ninguna convocatoria. Tu lugar es votar y, si quieres, enviar regalos.
              </p>
            </div>

            <p className="text-gray-700 mb-4">
              <strong>¿Cómo funciona para fans?</strong> Votas gratis a tus artistas favoritos y compartes sus perfiles en redes. El artista con más votos gana el premio de la sala.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
              <p className="font-semibold text-purple-900 mb-2">✅ Lo que puedes hacer como fan:</p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>1️⃣ Vota por tus artistas favoritos (1 voto gratis por artista)</li>
                <li>2️⃣ Comparte perfiles de artistas en redes sociales</li>
                <li>3️⃣ Compra créditos y envíales regalos (estrellas ⭐) si quieres apoyarlos más</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              📊 <strong>Estrategia:</strong> Comparte perfiles de VARIOS artistas de la misma convocatoria para que sus votos crezcan.
            </p>
          </CardContent>
        </Card>

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
                  <Users className="w-4 h-4 mr-2" />
                  Ganadores
                </Button>
              </Link>
              <Link to={createPageUrl('Community')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Comunidad
                </Button>
              </Link>
              <Link to={createPageUrl('VotingRoom')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Sala de Votación
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
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => window.location.href = 'mailto:infotuvoz25@gmail.com'}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacto por Email
              </Button>
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 mb-3">
                <p className="text-xs text-green-900 font-semibold mb-1">
                  🎁 Apoya con regalos
                </p>
                <p className="text-xs text-green-800">
                  Compra créditos y envíale un regalo a tu artista favorito
                </p>
              </div>
              <Link to={createPageUrl('EditProfile')} className="block">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Editar mi Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Generar enlace de fan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="text-purple-600"/>
              Genera tu Enlace de Fan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeArtists && activeArtists.length > 0 ? (
              <>
                <div>
                  <label className="font-medium text-gray-800 block mb-2">
                    1. Elige un artista para apoyar
                  </label>
                  <Select value={selectedArtistId} onValueChange={setSelectedArtistId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un artista de las convocatorias activas..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeArtists.map(artist => (
                        <SelectItem key={artist.artist_id || artist.id} value={artist.artist_id || artist.id}>
                          <div className="flex items-center gap-3">
                            {artist.artist_image && (
                              <img 
                                src={artist.artist_image} 
                                alt={artist.artist_name || 'Artist'} 
                                className="w-8 h-8 rounded-full object-cover" 
                              />
                            )}
                            <span>{artist.artist_name || 'Artista Desconocido'}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {shareLink && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <label className="font-medium text-gray-800 block">
                      2. Copia y comparte tu enlace único
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareLink}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                      />
                      <Button onClick={copyToClipboard} size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      💡 Cada vez que alguien haga clic en este enlace, se registrará como un compartido tuyo
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4"/>
                <p>No hay artistas en convocatorias activas en este momento.</p>
                <p>Vuelve pronto para apoyar a nuevos talentos.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas por convocatoria */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Mis Estadísticas por Convocatoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contestStats.length > 0 ? (
              <div className="space-y-4">
                {contestStats.map((stat, idx) => (
                  <div key={idx} className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{stat.contest.name}</h4>
                        <p className="text-sm text-gray-600">
                          {stat.contest.genre} • {
                            stat.contest.status === 'finished' ? 'Finalizado' : 
                            stat.contest.status === 'voting' ? 'En Votación' : 'Abierto'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-purple-600" />
                        <span><strong>{stat.shareCount}</strong> compartidos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span><strong>{stat.artistCount}</strong> artistas</span>
                      </div>
                    </div>
                    {stat.contest.status !== 'finished' && (
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Sigue compartiendo para que tu artista sume votos
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Share2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-2">Aún no has compartido ningún perfil</p>
                <p className="text-xs text-gray-400">Comparte perfiles de artistas para ayudarlos a sumar votos</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}