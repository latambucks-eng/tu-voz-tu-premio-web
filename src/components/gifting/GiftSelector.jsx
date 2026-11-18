import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Coins, Gift as GiftIcon, Loader2, CheckCircle, AlertTriangle,
    Music, Heart, Flame, Mic, Rocket, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

// Mapeo de íconos de Lucide
const iconMap = {
    musical_note: Music,
    heart: Heart,
    fire: Flame,
    microphone: Mic,
    rocket: Rocket,
    crown_king: Crown,
};

const GiftItem = ({ gift, onSelect, isSelected, disabled }) => {
    const Icon = iconMap[gift.icon] || GiftIcon;
    return (
        <button
            onClick={() => onSelect(gift)}
            disabled={disabled}
            className={`p-4 border rounded-lg text-center transition-all ${isSelected ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-50' : 'hover:bg-gray-50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Icon className="w-10 h-10 mx-auto text-purple-600 mb-2" />
            <p className="font-semibold">{gift.name}</p>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-yellow-500" /> {gift.price_usd.toFixed(2)}
            </p>
        </button>
    );
};

export default function GiftSelector({ artist, fan, onClose }) {
    const queryClient = useQueryClient();
    const [selectedGift, setSelectedGift] = useState(null);
    const [step, setStep] = useState('select'); // 'select', 'confirm', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const { data: gifts, isLoading: isLoadingGifts } = useQuery({
        queryKey: ['gifts'],
        queryFn: () => base44.entities.Gift.filter({ is_active: true }, 'price_usd'),
    });

    const { data: wallet, isLoading: isLoadingWallet } = useQuery({
        queryKey: ['wallet', fan.id],
        queryFn: () => base44.entities.Wallet.filter({ user_id: fan.id }).then(res => Array.isArray(res) ? res.at(0) : res),
    });

    const sendGiftMutation = useMutation({
        mutationFn: async () => {
            const fanWallet = await base44.entities.Wallet.filter({ user_id: fan.id }).then(res => Array.isArray(res) ? res.at(0) : res);
            if (!fanWallet || fanWallet.balance < selectedGift.price_usd) {
                throw new Error('No tienes suficientes créditos.');
            }

            // Resolver el ID real del usuario artista (o el ID de custodia Admin si aún no se registró)
            let targetArtistId = artist.artist_id || artist.user_id || artist.id;
            if (String(targetArtistId).startsWith('featured_')) {
                const matchingUsers = await base44.entities.User.filter({ user_type: 'artist' });
                const found = (matchingUsers || []).find(
                    u => (u.artist_name || u.full_name || '').trim().toLowerCase() === (artist.artist_name || '').trim().toLowerCase()
                );
                if (found?.id) {
                    targetArtistId = found.id;
                } else {
                    targetArtistId = artist.created_by_id || '71ffd78e-6e83-4616-9f34-a0e002411c81';
                }
            }

            // 1. Deducir créditos del fan
            const newFanBalance = fanWallet.balance - selectedGift.price_usd;
            await base44.entities.Wallet.update(fanWallet.id, { balance: newFanBalance });

            // 2. Acreditar estrellas al artista
            const starsToCredit = selectedGift.price_usd;
            const artistWallet = await base44.entities.Wallet.filter({ user_id: targetArtistId }).then(res => Array.isArray(res) ? res.at(0) : res);
            if (artistWallet) {
                const newArtistStars = (artistWallet.star_credits || 0) + starsToCredit;
                await base44.entities.Wallet.update(artistWallet.id, { star_credits: newArtistStars });
            } else {
                await base44.entities.Wallet.create({ user_id: targetArtistId, balance: 0, star_credits: starsToCredit });
            }

            // 3. Registrar la transacción del regalo
            await base44.entities.GiftTransaction.create({
                gift_id: selectedGift.id,
                gift_name: selectedGift.name,
                gift_icon: selectedGift.icon,
                sender_id: fan.id,
                sender_name: fan.full_name || fan.email,
                recipient_id: targetArtistId,
                recipient_name: artist.artist_name,
                amount_usd: selectedGift.price_usd,
                star_value: selectedGift.price_usd,
                status: 'approved',
                payment_method: 'credits',
            });


            // 4. Crear transacción de descuento para el fan
            await base44.entities.Transaction.create({
                user_id: fan.id,
                type: 'credit_purchase',
                amount: -selectedGift.price_usd,
                description: `Regalo enviado: ${selectedGift.name} a ${artist.artist_name}`,
                payment_method: 'credits',
                status: 'approved'
            });

            // 5. Crear transacción de premio para el artista
            await base44.entities.Transaction.create({
                user_id: targetArtistId,
                type: 'prize_won',
                amount: selectedGift.price_usd,
                description: `Regalo recibido: ${selectedGift.name} de ${fan.full_name || 'Un fan'}`,
                payment_method: 'system_credits',
                status: 'approved'
            });

            // 6. Notificar al artista
            await base44.entities.Notification.create({
                user_id: targetArtistId,
                title: `🎁 ¡Has recibido un regalo!`,
                message: `${fan.full_name || 'Un fan'} te ha enviado un(a) ${selectedGift.name}. ¡Has ganado ${selectedGift.price_usd.toFixed(2)} estrellas ⭐!`,
                type: 'credit_purchase',
                link: createPageUrl('ArtistDashboard')
            });
        },

        onSuccess: () => {
            setStep('success');
            queryClient.invalidateQueries({ queryKey: ['wallet', fan.id] });
        },
        onError: (error) => {
            setErrorMessage(error.message || 'Ocurrió un error al enviar el regalo.');
            setStep('error');
        },
    });

    const handleSendGift = () => {
        setStep('confirm');
        sendGiftMutation.mutate();
    };

    const availableCredits = wallet?.balance || 0;

    const renderContent = () => {
        switch (step) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">¡Regalo Enviado!</h3>
                        <p>{artist.artist_name} ha recibido tu {selectedGift.name}. ¡Gracias por tu apoyo!</p>
                        <Button onClick={onClose} className="mt-6">Cerrar</Button>
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
                        <h3 className="text-xl font-bold">Procesando tu regalo...</h3>
                        <p>Por favor, espera un momento.</p>
                    </div>
                );
            case 'select':
            default:
                return (
                    <div className="flex flex-col max-h-[85vh]">
                        <div className="p-4 sm:p-5 border-b flex justify-between items-center flex-shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold truncate pr-2">Enviar Regalo a {artist.artist_name}</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
                        </div>
                        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                            <div className="p-3 bg-gray-100 rounded-lg mb-4 text-center">
                                <p className="text-sm">Mis Créditos</p>
                                <p className="text-2xl font-bold flex items-center justify-center gap-2">
                                    <Coins className="w-6 h-6 text-yellow-500" />
                                    {isLoadingWallet ? '...' : availableCredits.toFixed(2)}
                                </p>
                            </div>

                            {isLoadingGifts ? <p>Cargando regalos...</p> : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {gifts.map(gift => (
                                        <GiftItem
                                            key={gift.id}
                                            gift={gift}
                                            onSelect={setSelectedGift}
                                            isSelected={selectedGift?.id === gift.id}
                                            disabled={availableCredits < gift.price_usd}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 sm:p-5 border-t bg-gray-50 flex-shrink-0">
                            <Button
                                onClick={handleSendGift}
                                disabled={!selectedGift || availableCredits < selectedGift.price_usd}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar {selectedGift ? selectedGift.name : 'Regalo'} ({selectedGift ? selectedGift.price_usd.toFixed(2) : '0.00'} créditos)
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
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-xl w-full max-w-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderContent()}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
