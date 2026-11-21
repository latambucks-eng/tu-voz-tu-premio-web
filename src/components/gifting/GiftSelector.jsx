import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Coins, Loader2, CheckCircle, AlertTriangle, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const FLUENT_CDN = 'https://jsdelivr.net';

const GIFT_3D_ASSETS = {
    '68f4b3c11dc146998b762496': { url: `${FLUENT_CDN}/Sparkles/3D/sparkles_3d.png`, glow: 'drop-shadow-[0_8px_12px_rgba(250,204,21,0.45)]', scale: 'scale-100' },
    '68f55d975162c3bafe50ee03': { url: `${FLUENT_CDN}/Musical%20notes/3D/musical_notes_3d.png`, glow: 'drop-shadow-[0_8px_12px_rgba(168,85,247,0.45)]', scale: 'scale-100' },
    '68f4b3c11dc146998b762497': { url: `${FLUENT_CDN}/Sparkling%20heart/3D/sparkling_heart_3d.png`, glow: 'drop-shadow-[0_8px_12px_rgba(244,63,94,0.45)]', scale: 'scale-100' },
    '68f55d975162c3bafe50ee04': { url: `${FLUENT_CDN}/Studio%20microphone/3D/studio_microphone_3d.png`, glow: 'drop-shadow-[0_8px_12px_rgba(217,119,6,0.45)]', scale: 'scale-100' },
    '68f6a46c08620e098533b106': { url: `${FLUENT_CDN}/Clapping%20hands/Default/3D/clapping_hands_3d_default.png`, glow: 'drop-shadow-[0_8px_12px_rgba(234,179,8,0.4)]', scale: 'scale-100' },
    '68f55d975162c3bafe50ee05': { url: `${FLUENT_CDN}/Guitar/3D/guitar_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(220,38,38,0.45)]', scale: 'scale-105' },
    '68f6a46c08620e098533b107': { url: `${FLUENT_CDN}/Rose/3D/rose_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(225,29,72,0.45)]', scale: 'scale-105' },
    '68f4b3c11dc146998b762493': { url: `${FLUENT_CDN}/Drum/3D/drum_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(217,119,6,0.45)]', scale: 'scale-105' },
    '68f55d975162c3bafe50ee06': { url: `${FLUENT_CDN}/Long%20drum/3D/long_drum_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(180,83,9,0.45)]', scale: 'scale-105' },
    '68f6a46c08620e098533b108': { url: `${FLUENT_CDN}/Fire/3D/fire_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(249,115,22,0.5)]', scale: 'scale-105' },
    '68f4b3c11dc146998b762491': { url: `${FLUENT_CDN}/Ribbon/3D/ribbon_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(236,72,153,0.45)]', scale: 'scale-105' },
    '68f4b3c11dc146998b762490': { url: `${FLUENT_CDN}/Military%20medal/3D/military_medal_3d.png`, glow: 'drop-shadow-[0_10px_14px_rgba(59,130,246,0.45)]', scale: 'scale-105' },
    '68f4b3c11dc146998b76248e': { url: `${FLUENT_CDN}/Crown/3D/crown_3d.png`, glow: 'drop-shadow-[0_10px_15px_rgba(234,179,8,0.55)]', scale: 'scale-110' },
    '68f55d975162c3bafe50ee07': { url: `${FLUENT_CDN}/Glowing%20star/3D/glowing_star_3d.png`, glow: 'drop-shadow-[0_10px_15px_rgba(250,204,21,0.55)]', scale: 'scale-110' },
    '68f4b3c11dc146998b762498': { url: `${FLUENT_CDN}/High%20voltage/3D/high_voltage_3d.png`, glow: 'drop-shadow-[0_10px_15px_rgba(245,158,11,0.55)]', scale: 'scale-110' },
    '68f4b3c11dc146998b76248f': { url: `${FLUENT_CDN}/Ring/3D/ring_3d.png`, glow: 'drop-shadow-[0_10px_15px_rgba(236,72,153,0.55)]', scale: 'scale-110' },
    '68f4b3c11dc146998b762495': { url: `${FLUENT_CDN}/Trophy/3D/trophy_3d.png`, glow: 'drop-shadow-[0_12px_16px_rgba(234,179,8,0.6)]', scale: 'scale-110' },
    '68f55d975162c3bafe50ee08': { url: `${FLUENT_CDN}/Heart%20on%20fire/3D/heart_on_fire_3d.png`, glow: 'drop-shadow-[0_12px_16px_rgba(239,68,68,0.6)]', scale: 'scale-110' },
    '68f6a46c08620e098533b10a': { url: `${FLUENT_CDN}/Rocket/3D/rocket_3d.png`, glow: 'drop-shadow-[0_12px_16px_rgba(239,68,68,0.55)]', scale: 'scale-110' },
    '68f4b3c11dc146998b762499': { url: `${FLUENT_CDN}/Shooting%20star/3D/shooting_star_3d.png`, glow: 'drop-shadow-[0_12px_16px_rgba(168,85,247,0.6)]', scale: 'scale-110' },
    '68f4b3c11dc146998b762494': { url: `${FLUENT_CDN}/Automobile/3D/automobile_3d.png`, glow: 'drop-shadow-[0_12px_16px_rgba(220,38,38,0.6)]', scale: 'scale-110' },
    '68f55d975162c3bafe50ee09': { url: `${FLUENT_CDN}/Flying%20saucer/3D/flying_saucer_3d.png`, glow: 'drop-shadow-[0_12px_16px_rgba(56,189,248,0.6)]', scale: 'scale-110' },
    '68f6a46c08620e098533b10b': { url: `${FLUENT_CDN}/1st%20place%20medal/3D/1st_place_medal_3d.png`, glow: 'drop-shadow-[0_12px_18px_rgba(234,179,8,0.65)]', scale: 'scale-110' },
    '68f4b3c11dc146998b76249a': { url: `${FLUENT_CDN}/Gem%20stone/3D/gem_stone_3d.png`, glow: 'drop-shadow-[0_12px_18px_rgba(14,165,233,0.65)]', scale: 'scale-110' },
    '68f55d975162c3bafe50ee0e': { url: `${FLUENT_CDN}/Racing%20car/3D/racing_car_3d.png`, glow: 'drop-shadow-[0_14px_18px_rgba(239,68,68,0.65)]', scale: 'scale-115' },
    '68f55d975162c3bafe50ee0f': { url: `${FLUENT_CDN}/Crystal%20ball/3D/crystal_ball_3d.png`, glow: 'drop-shadow-[0_14px_20px_rgba(168,85,247,0.7)]', scale: 'scale-115' },
    '68f4b3c11dc146998b76249b': { url: `${FLUENT_CDN}/Wrapped%20gift/3D/wrapped_gift_3d.png`, glow: 'drop-shadow-[0_14px_20px_rgba(236,72,153,0.7)]', scale: 'scale-115' }
};

const GiftRender3D = ({ gift }) => {
    const asset = GIFT_3D_ASSETS[gift?.id] || {
        url: `${FLUENT_CDN}/Wrapped%20gift/3D/wrapped_gift_3d.png`,
        glow: 'drop-shadow-[0_8px_12px_rgba(168,85,247,0.4)]',
        scale: 'scale-100'
    };

    return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
            <img
                src={asset.url}
                alt={gift?.name || 'Regalo 3D'}
                loading="lazy"
                className={`w-14 h-14 sm:w-16 sm:h-16 object-contain transition-transform duration-300 ${asset.scale} ${asset.glow}`}
            />
        </div>
    );
};

const GiftItem = ({ gift, onSelect, isSelected, disabled }) => {
    const price = Number(gift?.price_usd) || 0;
    const isVip = price >= 20;
    const isLegendary = price >= 50;

    return (
        <motion.button
            type="button"
            whileHover={disabled ? {} : { y: -4, scale: 1.03 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            onClick={() => onSelect(gift)}
            disabled={disabled}
            className={`relative p-3 rounded-2xl text-center transition-all flex flex-col items-center justify-between border-2 ${
                isSelected
                    ? 'border-purple-600 ring-4 ring-purple-200 bg-gradient-to-b from-purple-50 to-pink-50 shadow-lg'
                    : isLegendary
                    ? 'border-amber-300 bg-gradient-to-b from-amber-50/90 via-white to-yellow-50/80 hover:border-amber-400 shadow-sm'
                    : isVip
                    ? 'border-purple-200 bg-gradient-to-b from-purple-50/60 to-white hover:border-purple-300 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50/80'
            } ${disabled ? 'opacity-45 cursor-not-allowed grayscale-[30%]' : 'cursor-pointer'}`}
        >
            {isVip && (
                <span
                    className={`absolute top-2 right-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isLegendary
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                            : 'bg-purple-600 text-white'
                    }`}
                >
                    {isLegendary ? 'VIP ★' : 'TOP'}
                </span>
            )}

            <GiftRender3D gift={gift} />

            <p className="font-bold text-xs sm:text-sm text-gray-900 leading-tight mt-1 line-clamp-2">
                {gift?.name || 'Regalo'}
            </p>

            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{price.toFixed(2)}</span>
            </div>
        </motion.button>
    );
};

export default function GiftSelector({ artist, fan, onClose }) {
    const queryClient = useQueryClient();
    const [selectedGift, setSelectedGift] = useState(null);
    const [step, setStep] = useState('select');
    const [errorMessage, setErrorMessage] = useState('');

    const { data: gifts = [], isLoading: isLoadingGifts } = useQuery({
        queryKey: ['gifts'],
        queryFn: async () => {
            const res = await base44.entities.Gift.filter({ is_active: true }, 'price_usd');
            return Array.isArray(res) ? res : [];
        },
    });

    const { data: wallet, isLoading: isLoadingWallet } = useQuery({
        queryKey: ['wallet', fan?.id],
        enabled: Boolean(fan?.id),
        queryFn: () => base44.entities.Wallet.filter({ user_id: fan.id }).then(res => Array.isArray(res) ? res.at(0) : res),
    });

    const sendGiftMutation = useMutation({
        mutationFn: async () => {
            if (!fan?.id) throw new Error('Debes iniciar sesión para enviar regalos.');
            if (!selectedGift) throw new Error('Selecciona un regalo primero.');

            const giftPrice = Number(selectedGift.price_usd) || 0;
            const fanWallet = await base44.entities.Wallet.filter({ user_id: fan.id }).then(res => Array.isArray(res) ? res.at(0) : res);
            const currentBalance = Number(fanWallet?.balance) || 0;

            if (!fanWallet || currentBalance < giftPrice) {
                throw new Error('No tienes suficientes créditos.');
            }

            let targetArtistId = artist?.artist_id || artist?.user_id || artist?.id;
            if (String(targetArtistId).startsWith('featured_')) {
                const matchingUsers = await base44.entities.User.filter({ user_type: 'artist' });
                const found = (matchingUsers || []).find(
                    u => (u.artist_name || u.full_name || '').trim().toLowerCase() === (artist?.artist_name || '').trim().toLowerCase()
                );
                if (found?.id) {                     targetArtistId = found.id;
                } else {
                    targetArtistId = artist?.created_by_id || '71ffd78e-6e83-4616-9f34-a0e002411c81';
                }
            }

            const newFanBalance = currentBalance - giftPrice;
            await base44.entities.Wallet.update(fanWallet.id, { balance: newFanBalance });

            const artistWallet = await base44.entities.Wallet.filter({ user_id: targetArtistId }).then(res => Array.isArray(res) ? res.at(0) : res);
            if (artistWallet) {
                const newArtistStars = (Number(artistWallet.star_credits) || 0) + giftPrice;
                await base44.entities.Wallet.update(artistWallet.id, { star_credits: newArtistStars });
            } else {
                await base44.entities.Wallet.create({ user_id: targetArtistId, balance: 0, star_credits: giftPrice });
            }

            await base44.entities.GiftTransaction.create({
                gift_id: selectedGift.id,
                gift_name: selectedGift.name,
                gift_icon: selectedGift.icon || '',
                sender_id: fan.id,
                sender_name: fan.full_name || fan.email || 'Fan',
                recipient_id: targetArtistId,
                recipient_name: artist?.artist_name || 'Artista',
                amount_usd: giftPrice,
                star_value: giftPrice,
                status: 'approved',
                payment_method: 'credits',
            });

            await base44.entities.Transaction.create({
                user_id: fan.id,
                type: 'credit_purchase',
                amount: -giftPrice,
                description: `Regalo enviado: ${selectedGift.name} a ${artist?.artist_name || 'Artista'}`,
                payment_method: 'credits',
                status: 'approved'
            });

            await base44.entities.Transaction.create({
                user_id: targetArtistId,
                type: 'prize_won',
                amount: giftPrice,
                description: `Regalo recibido: ${selectedGift.name} de ${fan.full_name || 'Un fan'}`,
                payment_method: 'system_credits',
                status: 'approved'
            });

            await base44.entities.Notification.create({
                user_id: targetArtistId,
                title: `🎁 ¡Has recibido un regalo!`,
                message: `${fan.full_name || 'Un fan'} te ha enviado un(a) ${selectedGift.name}. ¡Has ganado ${giftPrice.toFixed(2)} estrellas ⭐!`,
                type: 'credit_purchase',
                link: createPageUrl('ArtistDashboard')
            });
        },
        onSuccess: () => {
            setStep('success');
            if (fan?.id) {
                queryClient.invalidateQueries({ queryKey: ['wallet', fan.id] });
            }
        },
        onError: (error) => {
            setErrorMessage(error?.message || 'Ocurrió un error al enviar el regalo.');
            setStep('error');
        },
    });

    const handleSendGift = () => {
        setStep('confirm');
        sendGiftMutation.mutate();
    };

    const availableCredits = Number(wallet?.balance) || 0;
    const selectedPrice = Number(selectedGift?.price_usd) || 0;

    if (!artist) return null;

    if (!fan?.id) {
        return (
            <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Inicia sesión para enviar regalos</h3>
                    <p className="text-gray-600 mb-6">Regístrate o entra a tu cuenta para apoyar a {artist.artist_name}.</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="bg-purple-600 hover:bg-purple-700">
                            Iniciar Sesión
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (step) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <div className="mb-3">
                            <GiftRender3D gift={selectedGift} />
                        </div>
                        <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
                        <h3 className="text-xl font-bold mb-2">¡Regalo Enviado!</h3>
                        <p className="text-gray-700">{artist.artist_name} ha recibido tu <strong>{selectedGift?.name}</strong>. ¡Gracias por tu apoyo!</p>
                        <Button onClick={onClose} className="mt-6 bg-purple-600 hover:bg-purple-700">Cerrar</Button>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center p-8">
                        <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Error al Enviar</h3>
                        <p className="text-red-700">{errorMessage}</p>
                        <Button onClick={onClose} variant="destructive" className="mt-6">Cerrar</Button>
                    </div>
                );
            case 'confirm':
                return (
                    <div className="text-center p-8">
                        <Loader2 className="w-16 h-16 mx-auto text-purple-500 animate-spin mb-4" />
                        <h3 className="text-xl font-bold">Enviando tu regalo...</h3>
                        <p className="text-gray-600">Por favor, espera un momento.</p>
                    </div>
                );
            case 'select':
            default:
                return (
                    <div className="flex flex-col max-h-[88vh]">
                        <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-2 truncate pr-2">
                                <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                                <h2 className="text-lg sm:text-xl font-bold truncate">Enviar Regalo a {artist.artist_name}</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                                <X />
                            </Button>
                        </div>

                        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-gray-50/50">
                            <div className="p-3 bg-white border border-purple-100 shadow-sm rounded-xl mb-4 flex items-center justify-between px-4">
                                <span className="text-sm font-medium text-gray-600">Tus Créditos Disponibles</span>
                                <span className="text-xl font-extrabold text-gray-900 flex items-center gap-1.5">
                                    <Coins className="w-5 h-5 text-amber-500" />
                                    {isLoadingWallet ? '...' : availableCredits.toFixed(2)}
                                </span>
                            </div>

                            {isLoadingGifts ? (
                                <div className="text-center py-8 text-gray-500">Cargando catálogo 3D...</div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {gifts.map(gift => (
                                        <GiftItem
                                            key={gift.id}
                                            gift={gift}
                                            onSelect={setSelectedGift}
                                            isSelected={selectedGift?.id === gift.id}
                                            disabled={availableCredits < (Number(gift?.price_usd) || 0)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 sm:p-5 border-t bg-white flex-shrink-0">
                            <Button
                                onClick={handleSendGift}
                                disabled={!selectedGift || availableCredits < selectedPrice}
                                className="w-full h-12 text-base font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 shadow-md"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {selectedGift
                                    ? `Enviar ${selectedGift.name} (${selectedPrice.toFixed(2)} créditos)`
                                    : 'Selecciona un regalo 3D'}
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-purple-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderContent()}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}


