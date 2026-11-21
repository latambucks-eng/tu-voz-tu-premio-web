import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Coins, Loader2, CheckCircle, AlertTriangle, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const RealisticGift3D = ({ gift }) => {
    const raw = `${gift?.name || ''} ${gift?.icon || ''}`.toLowerCase();
    const uid = String(gift?.id || 'g').replace(/[^a-zA-Z0-9]/g, '');

    if (raw.includes('auto') || raw.includes('coche') || raw.includes('car')) {
        const isYellow = raw.includes('deportivo') && !raw.includes('rojo');
        const c1 = isYellow ? '#fde047' : '#ff4d4d';
        const c2 = isYellow ? '#eab308' : '#dc2626';
        const c3 = isYellow ? '#a16207' : '#7f1d1d';
        return (
            <svg viewBox="0 0 120 90" className="w-20 h-16 mx-auto drop-shadow-[0_10px_10px_rgba(220,38,38,0.35)]">
                <defs>
                    <linearGradient id={`carBody-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={c1} />
                        <stop offset="50%" stopColor={c2} />
                        <stop offset="100%" stopColor={c3} />
                    </linearGradient>
                    <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="50%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <radialGradient id={`wheel-${uid}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="55%" stopColor="#475569" />
                        <stop offset="75%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                    </radialGradient>
                </defs>
                <ellipse cx="60" cy="76" rx="48" ry="7" fill="rgba(0,0,0,0.28)" />
                <path d="M14 44 L22 36 L28 38 L22 47 Z" fill={c3} />
                <path
                    d="M14 58 C14 49, 24 44, 36 43 L48 30 C54 25, 72 25, 82 32 L98 43 C106 45, 110 51, 110 58 C110 63, 106 66, 100 66 L20 66 C15 66, 14 62, 14 58 Z"
                    fill={`url(#carBody-${uid})`}
                />
                <path
                    d="M49 32 C55 27, 71 27, 80 33 L93 42 L40 42 Z"
                    fill={`url(#glass-${uid})`}
                />
                <path d="M35 50 Q62 47 96 51" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <ellipse cx="104" cy="52" rx="4.5" ry="2.5" fill="#fef08a" />
                <ellipse cx="105" cy="52" rx="2" ry="1.2" fill="#ffffff" />
                <rect x="14" y="49" width="4" height="5" rx="2" fill="#fca5a5" />
                <circle cx="34" cy="65" r="11" fill={`url(#wheel-${uid})`} />
                <circle cx="34" cy="65" r="5" fill="#cbd5e1" />
                <circle cx="34" cy="65" r="2" fill="#334155" />
                <circle cx="88" cy="65" r="11" fill={`url(#wheel-${uid})`} />
                <circle cx="88" cy="65" r="5" fill="#cbd5e1" />
                <circle cx="88" cy="65" r="2" fill="#334155" />
            </svg>
        );
    }

    if (raw.includes('diamante') || raw.includes('diamond') || raw.includes('gema')) {
        const isMega = raw.includes('mega') || raw.includes('legendario');
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_14px_rgba(56,189,248,0.45)]">
                <defs>
                    <linearGradient id={`diaTop-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isMega ? '#f0abfc' : '#bae6fd'} />
                        <stop offset="50%" stopColor={isMega ? '#38bdf8' : '#7dd3fc'} />
                        <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id={`diaLeft-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isMega ? '#c084fc' : '#38bdf8'} />
                        <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id={`diaCenter-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="45%" stopColor={isMega ? '#67e8f9' : '#7dd3fc'} />
                        <stop offset="100%" stopColor={isMega ? '#6366f1' : '#0369a1'} />
                    </linearGradient>
                    <linearGradient id={`diaRight-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                </defs>
                <ellipse cx="55" cy="84" rx="30" ry="5" fill="rgba(14,165,233,0.25)" />
                <polygon points="32,20 78,20 94,38 16,38" fill={`url(#diaTop-${uid})`} />
                <polygon points="32,20 55,20 42,38 16,38" fill="rgba(255,255,255,0.45)" />
                <polygon points="55,20 78,20 68,38 42,38" fill="rgba(255,255,255,0.75)" />
                <polygon points="16,38 42,38 55,78" fill={`url(#diaLeft-${uid})`} />
                <polygon points="42,38 68,38 55,78" fill={`url(#diaCenter-${uid})`} />
                <polygon points="68,38 94,38 55,78" fill={`url(#diaRight-${uid})`} />
                <path d="M24 14 L26 20 L32 22 L26 24 L24 30 L22 24 L16 22 L22 20 Z" fill="#ffffff" />
                {isMega && (
                    <path d="M86 10 L88 15 L93 17 L88 19 L86 24 L84 19 L79 17 L84 15 Z" fill="#fef08a" />
                )}
            </svg>
        );
    }

    if (raw.includes('corona') || raw.includes('crown') || raw.includes('rey') || raw.includes('reina')) {
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(234,179,8,0.45)]">
                <defs>
                    <linearGradient id={`goldMain-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="45%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                    <linearGradient id={`goldBack-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                </defs>
                <ellipse cx="55" cy="82" rx="36" ry="6" fill="rgba(0,0,0,0.22)" />
                <path d="M25 64 L32 34 L55 46 L78 34 L85 64 Z" fill="#991b1b" />
                <polygon points="33,58 42,26 55,52" fill={`url(#goldBack-${uid})`} />
                <polygon points="77,58 68,26 55,52" fill={`url(#goldBack-${uid})`} />
                <path d="M20 65 L16 32 L38 48 L55 22 L72 48 L94 32 L90 65 Z" fill={`url(#goldMain-${uid})`} />
                <rect x="20" y="63" width="70" height="11" rx="4" fill={`url(#goldMain-${uid})`} stroke="#fef08a" strokeWidth="1" />
                <circle cx="16" cy="30" r="4.5" fill="#fef08a" />
                <circle cx="55" cy="19" r="5.5" fill="#fef08a" />
                <circle cx="94" cy="30" r="4.5" fill="#fef08a" />
                <circle cx="55" cy="54" r="5" fill="#ef4444" stroke="#fef08a" strokeWidth="1.5" />
                <circle cx="36" cy="68.5" r="3" fill="#10b981" />
                <circle cx="55" cy="68.5" r="3.5" fill="#3b82f6" />
                <circle cx="74" cy="68.5" r="3" fill="#10b981" />
            </svg>
        );
    }

    if (raw.includes('cohete') || raw.includes('rocket') || raw.includes('estrellato') || raw.includes('exito') || raw.includes('éxito')) {
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(147,51,234,0.35)]">
                <defs>
                    <linearGradient id={`rocketHull-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <linearGradient id={`rocketNose-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f87171" />
                        <stop offset="50%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                    <linearGradient id={`flame-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <path d="M45 68 Q55 92 65 68 Q55 76 45 68 Z" fill={`url(#flame-${uid})`} />
                <path d="M49 68 Q55 83 61 68 Z" fill="#ffffff" />
                <path d="M38 48 L22 66 L39 64 Z" fill={`url(#rocketNose-${uid})`} />
                <path d="M72 48 L88 66 L71 64 Z" fill={`url(#rocketNose-${uid})`} />
                <path d="M55 10 C38 26, 36 48, 41 66 L69 66 C74 48, 72 26, 55 10 Z" fill={`url(#rocketHull-${uid})`} />
                <path d="M55 10 C47 18, 43 25, 41 31 L69 31 C67 25, 63 18, 55 10 Z" fill={`url(#rocketNose-${uid})`} />
            );
    }

    if (raw.includes('mic') || raw.includes('voz') || raw.includes('canto')) {
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(217,119,6,0.35)]">
                <defs>
                    <radialGradient id={`micHead-${uid}`} cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="55%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                    </radialGradient>
                    <linearGradient id={`micBody-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="45%" stopColor="#cbd5e1" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                </defs>
                <ellipse cx="55" cy="84" rx="22" ry="5" fill="rgba(0,0,0,0.22)" />
                <polygon points="46,44 64,44 60,78 50,78" fill={`url(#micBody-${uid})`} />
                <rect x="43" y="41" width="24" height="5" rx="2.5" fill="#fbbf24" />
                <circle cx="55" cy="28" r="16" fill={`url(#micHead-${uid})`} />
                <path d="M40 28 L70 28" stroke="#78350f" strokeWidth="2.5" />
                <ellipse cx="49" cy="21" rx="4" ry="2.5" fill="rgba(255,255,255,0.65)" transform="rotate(-25 49 21)" />
            </svg>
        );
    }

    if (raw.includes('coraz') || raw.includes('heart') || raw.includes('amor')) {
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(225,29,72,0.4)]">
                <defs>
                    <radialGradient id={`heart3d-${uid}`} cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fda4af" />
                        <stop offset="40%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#881337" />
                    </radialGradient>
                </defs>
                <ellipse cx="55" cy="82" rx="24" ry="5" fill="rgba(225,29,72,0.22)" />
                <path
                    d="M55 76 C55 76, 20 54, 20 33 C20 20, 31 13, 42 15 C49 16, 53 21, 55 25 C57 21, 61 16, 68 15 C79 13, 90 20, 90 33 C90 54, 55 76, 55 76 Z"
                    fill={`url(#heart3d-${uid})`}
                />
                <ellipse cx="36" cy="27" rx="6" ry="3.5" fill="rgba(255,255,255,0.65)" transform="rotate(-30 36 27)" />
            </svg>
        );
    }

    if (raw.includes('fuego') || raw.includes('fire') || raw.includes('llama')) {
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(249,115,22,0.4)]">
                <defs>
                    <linearGradient id={`fireOuter-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#facc15" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#b91c1c" />
                    </linearGradient>
                </defs>
                <path
                    d="M55 12 C68 28, 84 40, 80 60 C77 73, 66 80, 55 80 C42 80, 30 71, 30 56 C30 43, 39 34, 43 28 C43 35, 47 38, 50 36 C47 26, 51 18, 55 12 Z"
                    fill={`url(#fireOuter-${uid})`}
                />
                <path
                    d="M55 42 C63 50, 68 57, 65 67 C63 73, 59 76, 55 76 C49 76, 44 71, 44 64 C44 56, 50 49, 55 42 Z"
                    fill="#fef08a"
                />
            </svg>
        );
    }

    if (raw.includes('nota') || raw.includes('music') || raw.includes('música') || raw.includes('cancion')) {
        return (
            <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(168,85,247,0.4)]">
                <defs>
                    <linearGradient id={`note3d-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                </defs>
                <ellipse cx="55" cy="83" rx="28" ry="5" fill="rgba(168,85,247,0.22)" />
                <path d="M44 62 L44 22 L80 14 L80 54" stroke={`url(#note3d-${uid})`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M44 32 L80 24" stroke={`url(#note3d-${uid})`} strokeWidth="7" fill="none" />
                <ellipse cx="35" cy="64" rx="12" ry="9" transform="rotate(-20 35 64)" fill={`url(#note3d-${uid})`} />
                <ellipse cx="71" cy="56" rx="12" ry="9" transform="rotate(-20 71 56)" fill={`url(#note3d-${uid})`} />
                <ellipse cx="32" cy="61" rx="4" ry="2" transform="rotate(-20 32 61)" fill="rgba(255,255,255,0.65)" />
                <ellipse cx="68" cy="53" rx="4" ry="2" transform="rotate(-20 68 53)" fill="rgba(255,255,255,0.65)" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 110 95" className="w-20 h-16 mx-auto drop-shadow-[0_10px_12px_rgba(234,179,8,0.4)]">
            <defs>
                <linearGradient id={`starGold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef9c3" />
                    <stop offset="45%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
            </defs>
            <ellipse cx="55" cy="83" rx="26" ry="5" fill="rgba(202,138,4,0.25)" />
            <polygon
                points="55,12 67,36 93,40 74,58 79,83 55,71 31,83 36,58 17,40 43,36"
                fill={`url(#starGold-${uid})`}
                stroke="#fef08a"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <polygon points="55,12 67,36 55,48 43,36" fill="rgba(255,255,255,0.55)" />
        </svg>
    );
};

const GiftItem = ({ gift, onSelect, isSelected, disabled }) => {
    const isVip = gift.price_usd >= 25;
    const isLegendary = gift.price_usd >= 90;

    return (
        <motion.button
            type="button"
            whileHover={disabled ? {} : { y: -4, scale: 1.03 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            onClick={() => onSelect(gift)}
            disabled={disabled}
            className={`relative p-3.5 rounded-2xl text-center transition-all flex flex-col items-center justify-between border-2 ${
                isSelected
                    ? 'border-purple-600 ring-4 ring-purple-200 bg-gradient-to-b from-purple-50 to-pink-50 shadow-lg'
                    : isLegendary
                    ? 'border-amber-300 bg-gradient-to-b from-amber-50/80 via-white to-yellow-50/70 hover:border-amber-400 shadow-sm'
                    : isVip
                    ? 'border-purple-200 bg-gradient-to-b from-purple-50/50 to-white hover:border-purple-300 shadow-sm'
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

            <div className="my-1 flex items-center justify-center">
                <RealisticGift3D gift={gift} />
            </div>

            <p className="font-bold text-xs sm:text-sm text-gray-900 leading-tight mt-1 line-clamp-2">
                {gift.name}
            </p>

            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{gift.price_usd.toFixed(2)}</span>
            </div>
        </motion.button>
    );
};

export default function GiftSelector({ artist, fan, onClose }) {
    const queryClient = useQueryClient();
    const [selectedGift, setSelectedGift] = useState(null);
    const [step, setStep] = useState('select');
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

            const newFanBalance = fanWallet.balance - selectedGift.price_usd;
            await base44.entities.Wallet.update(fanWallet.id, { balance: newFanBalance });

            const starsToCredit = selectedGift.price_usd;
            const artistWallet = await base44.entities.Wallet.filter({ user_id: targetArtistId }).then(res => Array.isArray(res) ? res.at(0) : res);
            if (artistWallet) {
                const newArtistStars = (artistWallet.star_credits || 0) + starsToCredit;
                await base44.entities.Wallet.update(artistWallet.id, { star_credits: newArtistStars });
            } else {
                await base44.entities.Wallet.create({ user_id: targetArtistId, balance: 0, star_credits: starsToCredit });
            }

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

            await base44.entities.Transaction.create({
                user_id: fan.id,
                type: 'credit_purchase',
                amount: -selectedGift.price_usd,
                description: `Regalo enviado: ${selectedGift.name} a ${artist.artist_name}`,
                payment_method: 'credits',
                status: 'approved'
            });

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
                        <div className="mb-3">
                            <RealisticGift3D gift={selectedGift} />
                        </div>
                        <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-2" />
                        <h3 className="text-xl font-bold mb-2">¡Regalo Enviado!</h3>
                        <p className="text-gray-700">{artist.artist_name} ha recibido tu <strong>{selectedGift.name}</strong>. ¡Gracias por tu apoyo!</p>
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
                                    {(gifts || []).map(gift => (
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

                        <div className="p-4 sm:p-5 border-t bg-white flex-shrink-0">
                            <Button
                                onClick={handleSendGift}
                                disabled={!selectedGift || availableCredits < selectedGift.price_usd}
                                className="w-full h-12 text-base font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 shadow-md"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {selectedGift
                                    ? `Enviar ${selectedGift.name} (${selectedGift.price_usd.toFixed(2)} créditos)`
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
                className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-purple-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderContent()}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
