import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Save, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getPrizeSplit } from '@/lib/prize';

export default function ContestForm({ contest, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: 'Pop',
    entry_price: 10,
    passline_url: '',
    prize_pool: 100,
    max_participants: 40,
    status: 'open',
    start_date: '', // NEW
    end_date: '', // NEW
    voting_end_date: '' // NEW
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isSaving
  const [error, setError] = useState(''); // NEW

  const prizeSplit = getPrizeSplit(formData.prize_pool);

  useEffect(() => {
    if (contest) {
      setFormData({
        name: contest.name || '',
        description: contest.description || '',
        genre: contest.genre || 'Pop',
        entry_price: 10,
        passline_url: contest.passline_url || '',
        prize_pool: contest.prize_pool ?? 100,
        max_participants: contest.max_participants || 40,
        status: contest.status || 'open',
        start_date: contest.start_date || '', // NEW
        end_date: contest.end_date || '',     // NEW
        voting_end_date: contest.voting_end_date || '' // NEW
      });
    }
  }, [contest]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const contestData = {
        name: formData.name,
        description: formData.description,
        genre: formData.genre,
        entry_price: 10,
        passline_url: (formData.passline_url || '').trim(),
        max_participants: parseInt(formData.max_participants),
        prize_pool: parseFloat(formData.prize_pool) || 0,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        voting_end_date: formData.voting_end_date || null
      };

      if (!contestData.name || !contestData.genre || !contestData.start_date || !contestData.end_date) {
        setError('Por favor completa los campos obligatorios: Nombre, Género, Fecha de inicio y Fecha de fin.');
        setIsSubmitting(false);
        return;
      }

      if (contest && contest.id) { // Using 'contest' prop as per existing code
        await base44.entities.Contest.update(contest.id, contestData);
      } else {
        await base44.entities.Contest.create(contestData);
      }

      alert('✅ Concurso guardado exitosamente');
      onSave();
    } catch (error) {
      console.error("Error saving contest:", error);
      setError('Error al guardar concurso: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const declareWinnersAutomatically = async (contestData) => {
    try {
      if (!contestData || !contestData.id) {
        throw new Error('Datos de concurso inválidos');
      }

      console.log('🏆 Iniciando declaración de ganadores para:', contestData.name);
      console.log(`💰 Premio total del concurso: $${contestData.prize_pool.toFixed(2)}`);

      // PASO 1: Obtener participantes
      const allParticipants = await base44.entities.Participant.filter(
        { contest_id: contestData.id, status: 'active' },
        '-total_votes'
      );

      if (!Array.isArray(allParticipants) || allParticipants.length === 0) {
        alert('⚠️ No hay participantes activos en este concurso');
        return false;
      }

      // PASO 2: Calcular distribución
      const { total: totalPrizePool, winner: artistsPrize } = getPrizeSplit(contestData.prize_pool);

      console.log(`💰 Premio para el ganador: $${artistsPrize.toFixed(2)}`);

      // PASO 3: Determinar ganador(es)
      const maxVotes = parseInt(allParticipants[0].total_votes) || 0;
      
      if (maxVotes === 0) {
        alert('⚠️ No hay votos en este concurso');
        return false;
      }

      const winners = allParticipants.filter(p => (parseInt(p.total_votes) || 0) === maxVotes);

      if (winners.length === 0) {
        alert('⚠️ No se encontraron ganadores');
        return false;
      }

      const prizePerWinner = Math.round((artistsPrize / winners.length) * 100) / 100;

      console.log(`🏆 ${winners.length} ganador(es) con ${maxVotes} votos, premio c/u: $${prizePerWinner.toFixed(2)}`);

      // PASO 5: Procesar ganadores
      for (const winner of winners) {
        if (!winner || !winner.id || !winner.artist_id) {
          console.error('Ganador con datos inválidos, saltando...');
          continue;
        }

        // Verificar duplicados
        const existingWinner = await base44.entities.Winner.filter({
          contest_id: contestData.id,
          participant_id: winner.id
        });

        if (existingWinner && existingWinner.length > 0) {
          console.log(`Ganador ${winner.artist_name} ya procesado`);
          continue;
        }

        // ✅ CREAR REGISTRO DE GANADOR CON TODA LA INFORMACIÓN
        await base44.entities.Winner.create({
          contest_id: contestData.id,
          contest_name: contestData.name,
          genre: contestData.genre,
          participant_id: winner.id,
          artist_id: winner.artist_id,
          artist_name: winner.artist_name || 'Artista',
          artist_image: winner.artist_image || '',
          artist_bio: winner.artist_bio || '',
          youtube_url: winner.youtube_url || '',
          youtube_video_id: winner.youtube_video_id || '',
          video_url: winner.video_url || '',
          song_title: winner.song_title || 'Sin título',
          total_votes: winner.total_votes || 0,
          average_rating: winner.average_rating || 0,
          prize_amount: prizePerWinner,
          prize_paid: false,
          social_instagram: winner.social_instagram || '',
          social_facebook: winner.social_facebook || '',
          social_tiktok: winner.social_tiktok || ''
        });

        console.log(`✅ Registro de ganador creado para ${winner.artist_name}`);

        // Convertir en artista destacado
        await createFeaturedArtistFromWinner(winner, contestData);

        // El premio NO se acredita en la wallet ni se cobra por canje:
        // lo abona la organización directamente al ganador por PayPal o Binance.

        // Crear transacción (registro del premio ganado)
        await base44.entities.Transaction.create({
          user_id: winner.artist_id,
          type: 'prize_won',
          amount: prizePerWinner,
          description: winners.length > 1 
            ? `Premio compartido en "${contestData.name}" (${winners.length} ganadores con ${maxVotes} votos)`
            : `Premio por ganar "${contestData.name}" con ${maxVotes} votos`,
          payment_method: 'system',
          status: 'approved',
          related_contest_id: contestData.id
        });

        // Notificar ganador
        try {
          await base44.entities.Notification.create({
            user_id: winner.artist_id,
            title: winners.length > 1 ? '🏆 ¡Empataste en 1er lugar!' : '🏆 ¡Ganaste el Concurso!',
            message: winners.length > 1
              ? `¡Empataste en "${contestData.name}" con ${maxVotes} votos! Premio: $${prizePerWinner.toFixed(2)} USD, que la organización abona a tu cuenta de PayPal o Binance dentro de los 10 días hábiles. ¡Ahora eres Artista Destacado!`
              : `¡Ganaste "${contestData.name}" con ${maxVotes} votos! Premio: $${prizePerWinner.toFixed(2)} USD, que la organización abona a tu cuenta de PayPal o Binance dentro de los 10 días hábiles. ¡Ahora eres Artista Destacado!`,
            type: 'winner',
            link: createPageUrl('ArtistDashboard')
          });
        } catch (notifError) {
          console.error('Error notificando ganador:', notifError);
        }

        console.log(`✅ $${prizePerWinner.toFixed(2)} acreditados a ${winner.artist_name}`);
      }

      // PASO 6: Mostrar resumen
      let summaryMessage = `🎉 CONCURSO FINALIZADO - ${contestData.name}\n\n`;
      summaryMessage += `💰 Premio Total: $${totalPrizePool.toFixed(2)}\n\n`;
      
      summaryMessage += `🏆 GANADOR${winners.length > 1 ? 'ES' : ''}:\n`;
      winners.forEach(w => {
        summaryMessage += `   ${w.artist_name} (${maxVotes} votos) - $${prizePerWinner.toFixed(2)}\n`;
      });
      
      summaryMessage += `\n✅ Premio registrado: lo abona la organización directamente al ganador\n`;
      summaryMessage += `⭐ Ganadores destacados\n`;
      summaryMessage += `📄 Todo guardado en Winners`;

      alert(summaryMessage);
      return true;

    } catch (error) {
      console.error('❌ Error declarando ganadores:', error);
      alert(`⚠️ Error: ${error.message || 'Error desconocido'}`);
      return false;
    }
  };

  const createFeaturedArtistFromWinner = async (winner, contestData) => {
    try {
      const existing = await base44.entities.FeaturedArtist.filter({ artist_name: winner.artist_name });
      
      if (!existing || existing.length === 0) {
        await base44.entities.FeaturedArtist.create({
          artist_name: winner.artist_name,
          bio: winner.artist_bio || `Ganador del concurso ${contestData.name}`,
          profile_image: winner.artist_image || '',
          country: winner.artist_country || 'Argentina',
          genre: contestData.genre,
          social_instagram: winner.social_instagram || '',
          social_facebook: winner.social_facebook || '',
          social_tiktok: winner.social_tiktok || '',
          followers_count: winner.total_votes || 0,
          participations_count: 1,
          is_active: true,
          order: 0
        });
      }

      await base44.auth.updateMe({ profile_visible_in_community: true });
    } catch (error) {
      console.error('Error creando artista destacado:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          {contest ? 'Editar Concurso' : 'Crear Nuevo Concurso'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nombre del Concurso *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Concurso de Pop - Enero 2025"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el concurso..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="genre">Género Musical *</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({...prev, genre: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Urbano">Urbano</SelectItem>
                  <SelectItem value="Balada">Balada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Precio de Inscripción (USD)</Label>
              <div className="h-10 flex items-center px-3 rounded-md border border-gray-200 bg-gray-50 font-bold text-gray-900">
                $10.00 USD
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Precio fijo para todas las convocatorias. Se cobra por Passline.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <Label htmlFor="passline_url" className="text-base font-bold text-gray-900">
              Link de pago de Passline para esta convocatoria
            </Label>
            <p className="text-xs text-gray-600 mb-2">
              Pega acá el link de pago de Passline correspondiente a este evento. Es el link que verá el artista al inscribirse.
            </p>
            <Input
              id="passline_url"
              type="url"
              value={formData.passline_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4">
            <Label htmlFor="prize_pool" className="text-base font-bold text-gray-900">
              Premio Total del Concurso (USD) *
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              Es el premio que se lleva el ganador. No depende de la cantidad de inscripciones.
            </p>
            <Input
              id="prize_pool"
              type="number"
              min="0"
              step="0.01"
              value={formData.prize_pool}
              onChange={handleChange}
              required
            />
            <div className="mt-3 text-sm">
              <div className="bg-white rounded-lg p-2 border border-yellow-200">
                <p className="text-gray-600 text-xs">🏆 Ganador de la sala</p>
                <p className="font-bold text-gray-900">${prizeSplit.winner.toFixed(2)} USD</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              El ganador recibe el premio completo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="max_participants">Máximo de Participantes *</Label>
              <Input
                id="max_participants"
                type="number"
                min="2"
                value={formData.max_participants}
                onChange={handleChange}
                required
              />
            </div>

            {contest && (
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Inscripciones Abiertas</SelectItem>
                    <SelectItem value="voting">En Votación</SelectItem>
                    <SelectItem value="finalists">Ronda de Finalistas</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* New Date Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="start_date">Fecha de Inicio *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">Fecha de Fin *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="voting_end_date">Fecha de Fin de Votación (Opcional)</Label>
            <Input
              id="voting_end_date"
              type="date"
              value={formData.voting_end_date}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Guardando...' : contest ? 'Actualizar Concurso' : 'Crear Concurso'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}