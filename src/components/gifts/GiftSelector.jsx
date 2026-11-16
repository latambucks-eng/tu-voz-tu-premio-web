import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Gift, Star, Send, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GIFT_ICONS = {
  microphone: '🎤',
  crown_king: '👑',
  crown_queen: '👸',
  crown_prince: '🤴',
  crown_princess: '👸',
  red_car: '🚗',
  musical_note: '🎵',
  drum: '🥁',
  guitar: '🎸',
  trophy: '🏆',
  star: '⭐',
  heart: '❤️',
  fire: '🔥',
  rocket: '🚀',
  diamond: '💎'
};

export default function GiftSelector({ artist, isOpen, onClose }) {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadGifts();
      loadCurrentUser();
    }
  }, [isOpen]);

  const loadCurrentUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const loadGifts = async () => {
    setIsLoading(true);
    try {
      const allGifts = await base44.entities.Gift.filter({ is_active: true }, 'price_usd');
      setGifts(Array.isArray(allGifts) ? allGifts : []);
    } catch (error) {
      console.error('Error loading gifts:', error);
      setGifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendGift = async () => {
    if (!selectedGift || !currentUser) return;

    if (!artist.accepts_gifts) {
      alert('❌ Este artista no acepta regalos en este momento.');
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmas enviar "${selectedGift.name}" a ${artist.artist_name}?\n\n` +
      `💰 Costo: $${selectedGift.price_usd.toFixed(2)} USD\n` +
      `⭐ El artista recibirá: ${selectedGift.star_value} estrellas\n\n` +
      `Serás redirigido a comprar créditos para pagar con PayPal.`
    );

    if (!confirmed) return;

    setIsSending(true);
    try {
      // Crear la transacción de regalo pendiente
      await base44.entities.GiftTransaction.create({
        gift_id: selectedGift.id,
        gift_name: selectedGift.name,
        gift_icon: selectedGift.icon,
        sender_id: currentUser.id,
        sender_name: isAnonymous ? 'Anónimo' : (currentUser.full_name || currentUser.artist_name || 'Fan'),
        recipient_id: artist.id,
        recipient_name: artist.artist_name,
        amount_usd: selectedGift.price_usd,
        star_value: selectedGift.star_value,
        message: message,
        is_anonymous: isAnonymous,
        payment_method: 'paypal',
        status: 'pending'
      });

      // Notificar al artista
      await base44.entities.Notification.create({
        user_id: artist.id,
        title: '🎁 ¡Nuevo regalo recibido!',
        message: `${isAnonymous ? 'Un fan anónimo' : (currentUser.full_name || 'Un fan')} te envió: ${selectedGift.name}! Una vez aprobado el pago recibirás ${selectedGift.star_value} estrellas.`,
        type: 'vote',
        link: `/artist-dashboard`
      });

      alert(
        '✅ ¡Regalo registrado!\n\n' +
        'Serás redirigido a comprar créditos para completar el pago con PayPal.\n' +
        'Una vez verificado el pago, el artista recibirá las estrellas.\n\n' +
        '💡 Por favor sube el comprobante de pago en "Mis Créditos".'
      );

      // Redirigir a página de compra de créditos con información del regalo
      window.location.href = `/buy-credits?gift=true&amount=${selectedGift.price_usd}`;

    } catch (error) {
      console.error('Error sending gift:', error);
      alert('❌ Error al enviar el regalo. Por favor, intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  if (!artist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Gift className="w-6 h-6 text-purple-600" />
            Enviar Regalo a {artist.artist_name}
          </DialogTitle>
          <DialogDescription>
            Apoya a tu artista favorito enviándole un regalo virtual. El artista recibirá estrellas canjeables.
          </DialogDescription>
        </DialogHeader>

        {!currentUser ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">Debes iniciar sesión para enviar regalos</p>
            <Button onClick={() => base44.auth.redirectToLogin(window.location.href)}>
              Iniciar Sesión
            </Button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600">Cargando regalos...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista de regalos */}
            <div>
              <h3 className="font-semibold mb-3">Selecciona un regalo:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gifts.map(gift => (
                  <motion.button
                    key={gift.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGift(gift)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedGift?.id === gift.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-2">{GIFT_ICONS[gift.icon] || '🎁'}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{gift.name}</div>
                    <div className="text-xs text-gray-600">${gift.price_usd.toFixed(2)} USD</div>
                    <div className="text-xs text-yellow-600 flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      {gift.star_value}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {selectedGift && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Detalles del regalo seleccionado */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{GIFT_ICONS[selectedGift.icon] || '🎁'}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-1">{selectedGift.name}</h4>
                        {selectedGift.description && (
                          <p className="text-sm text-gray-600 mb-2">{selectedGift.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-purple-700">
                            💰 ${selectedGift.price_usd.toFixed(2)} USD
                          </span>
                          <span className="flex items-center gap-1 text-yellow-700">
                            <Star className="w-4 h-4 fill-current" />
                            {selectedGift.star_value} estrellas para el artista
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mensaje opcional */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mensaje para el artista (opcional)
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje de apoyo..."
                    maxLength={200}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{message.length}/200 caracteres</p>
                </div>

                {/* Opción anónima */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <label
                    htmlFor="anonymous"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enviar como anónimo
                  </label>
                </div>

                {/* Botón de enviar */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSendGift}
                    disabled={isSending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Regalo (${selectedGift.price_usd.toFixed(2)} USD)
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={onClose} disabled={isSending}>
                    Cancelar
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <p className="text-blue-900">
                    💡 <strong>Cómo funciona:</strong>
                  </p>
                  <ul className="text-blue-800 text-xs space-y-1 mt-2 ml-4">
                    <li>• Serás redirigido a comprar créditos y pagarás ${selectedGift.price_usd.toFixed(2)} USD con PayPal</li>
                    <li>• Sube el comprobante en "Mis Créditos"</li>
                    <li>• Una vez verificado, {artist.artist_name} recibirá {selectedGift.star_value} estrellas</li>
                    <li>• Las estrellas se canjean por dinero (1 ⭐ = 1 USD)</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}