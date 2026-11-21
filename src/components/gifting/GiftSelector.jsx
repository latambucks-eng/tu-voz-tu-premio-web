import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Coins, Loader2, CheckCircle, AlertTriangle, Sparkles, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const CAP_CONFIGS = {
    '68f4b3c11dc146998b762496': { style: 'cap', c1: '#7dd3fc', c2: '#0284c7', c3: '#0c4a6e', visor: '#0369a1', badge: '★', badgeBg: '#ffffff', badgeColor: '#0284c7', ring: 'from-sky-200 via-blue-100 to-cyan-300', glow: 'shadow-[0_10px_18px_-4px_rgba(2,132,199,0.45)]' },
    '68f55d975162c3bafe50ee03': { style: 'cap', c1: '#6ee7b7', c2: '#059669', c3: '#064e3b', visor: '#047857', badge: '♪', badgeBg: '#ecfdf5', badgeColor: '#059669', ring: 'from-emerald-200 via-teal-100 to-green-300', glow: 'shadow-[0_10px_18px_-4px_rgba(5,150,105,0.45)]' },
    '68f4b3c11dc146998b762497': { style: 'cap', c1: '#fda4af', c2: '#e11d48', c3: '#881337', visor: '#be123c', badge: '♥', badgeBg: '#fff1f2', badgeColor: '#e11d48', ring: 'from-pink-200 via-rose-100 to-pink-300', glow: 'shadow-[0_10px_18px_-4px_rgba(225,29,72,0.45)]' },
    '68f55d975162c3bafe50ee04': { style: 'cap', c1: '#fef08a', c2: '#eab308', c3: '#854d0e', visor: '#a16207', badge: '🎙', badgeBg: '#fefce8', badgeColor: '#a16207', ring: 'from-amber-200 via-yellow-100 to-amber-300', glow: 'shadow-[0_10px_18px_-4px_rgba(234,179,8,0.5)]' },
    '68f6a46c08620e098533b106': { style: 'cap', c1: '#fdba74', c2: '#ea580c', c3: '#7c2d12', visor: '#c2410c', badge: '👏', badgeBg: '#fff7ed', badgeColor: '#ea580c', ring: 'from-orange-200 via-amber-100 to-orange-300', glow: 'shadow-[0_10px_18px_-4px_rgba(234,88,12,0.45)]' },
    '68f55d975162c3bafe50ee05': { style: 'snapback', c1: '#475569', c2: '#0f172a', c3: '#020617', visor: '#dc2626', badge: '⚡', badgeBg: '#fef08a', badgeColor: '#b91c1c', ring: 'from-red-200 via-slate-100 to-red-300', glow: 'shadow-[0_12px_20px_-4px_rgba(220,38,38,0.5)]' },
    '68f6a46c08620e098533b107': { style: 'beret', c1: '#f43f5e', c2: '#be123c', c3: '#4c0519', visor: '#fda4af', badge: '🌹', badgeBg: '#fff1f2', badgeColor: '#be123c', ring: 'from-rose-200 via-pink-100 to-red-300', glow: 'shadow-[0_12px_20px_-4px_rgba(190,18,60,0.5)]' },
    '68f4b3c11dc146998b762493': { style: 'bucket', c1: '#c084fc', c2: '#7e22ce', c3: '#3b0764', visor: '#581c87', badge: 'ılıl', badgeBg: '#faf5ff', badgeColor: '#7e22ce', ring: 'from-purple-200 via-violet-100 to-purple-300', glow: 'shadow-[0_12px_20px_-4px_rgba(126,34,206,0.5)]' },
    '68f55d975162c3bafe50ee06': { style: 'band', c1: '#3b82f6', c2: '#1e3a8a', c3: '#0f172a', visor: '#020617', badge: '🥁', badgeBg: '#fef08a', badgeColor: '#854d0e', ring: 'from-blue-200 via-indigo-100 to-amber-200', glow: 'shadow-[0_12px_20px_-4px_rgba(30,58,138,0.5)]' },
    '68f6a46c08620e098533b108': { style: 'snapback', c1: '#fb923c', c2: '#dc2626', c3: '#450a0a', visor: '#facc15', badge: '🔥', badgeBg: '#fef9c3', badgeColor: '#dc2626', ring: 'from-orange-200 via-red-100 to-amber-300', glow: 'shadow-[0_12px_20px_-4px_rgba(220,38,38,0.55)]' },
    '68f4b3c11dc146998b762491': { style: 'tiaraCap', c1: '#f9a8d4', c2: '#ec4899', c3: '#831843', visor: '#fbcfe8', badge: '♛', badgeBg: '#ffffff', badgeColor: '#db2777', ring: 'from-pink-300 via-rose-100 to-pink-400', glow: 'shadow-[0_12px_22px_-4px_rgba(236,72,153,0.55)]' },
    '68f4b3c11dc146998b762490': { style: 'tiaraCap', c1: '#60a5fa', c2: '#2563eb', c3: '#1e3a8a', visor: '#cbd5e1', badge: '⚜', badgeBg: '#eff6ff', badgeColor: '#1d4ed8', ring: 'from-blue-300 via-sky-100 to-indigo-400', glow: 'shadow-[0_12px_22px_-4px_rgba(37,99,235,0.55)]' },
    '68f4b3c11dc146998b76248e': { style: 'crownCap', c1: '#fef08a', c2: '#d97706', c3: '#78350f', visor: '#991b1b', badge: '👑', badgeBg: '#fef9c3', badgeColor: '#92400e', ring: 'from-yellow-300 via-amber-100 to-yellow-400', glow: 'shadow-[0_14px_24px_-4px_rgba(217,119,6,0.65)]' },
    '68f55d975162c3bafe50ee07': { style: 'fedora', c1: '#818cf8', c2: '#3730a3', c3: '#1e1b4b', visor: '#312e81', badge: '🌟', badgeBg: '#fef08a', badgeColor: '#854d0e', ring: 'from-indigo-200 via-yellow-100 to-amber-300', glow: 'shadow-[0_14px_24px_-4px_rgba(250,204,21,0.6)]' },
    '68f4b3c11dc146998b762498': { style: 'flameCap', c1: '#f87171', c2: '#b91c1c', c3: '#450a0a', visor: '#f97316', badge: '💥', badgeBg: '#fef08a', badgeColor: '#b91c1c', ring: 'from-red-300 via-orange-100 to-amber-400', glow: 'shadow-[0_14px_24px_-4px_rgba(239,68,68,0.65)]' },
    '68f4b3c11dc146998b76248f': { style: 'fedora', c1: '#f0abfc', c2: '#a21caf', c3: '#4a044e', visor: '#86198f', badge: '💎', badgeBg: '#fdf4ff', badgeColor: '#a21caf', ring: 'from-fuchsia-300 via-pink-100 to-purple-400', glow: 'shadow-[0_14px_24px_-4px_rgba(192,38,211,0.6)]' },
    '68f4b3c11dc146998b762495': { style: 'snapback', c1: '#f8fafc', c2: '#cbd5e1', c3: '#475569', visor: '#eab308', badge: '🏆', badgeBg: '#fef9c3', badgeColor: '#a16207', ring: 'from-yellow-300 via-slate-100 to-amber-400', glow: 'shadow-[0_14px_26px_-4px_rgba(234,179,8,0.7)]' },
    '68f55d975162c3bafe50ee08': { style: 'flameCap', c1: '#334155', c2: '#0f172a', c3: '#020617', visor: '#ef4444', badge: '❤️‍🔥', badgeBg: '#fee2e2', badgeColor: '#dc2626', ring: 'from-red-300 via-orange-100 to-rose-400', glow: 'shadow-[0_14px_26px_-4px_rgba(239,68,68,0.7)]' },
    '68f6a46c08620e098533b10a': { style: 'snapback', c1: '#38bdf8', c2: '#1d4ed8', c3: '#172554', visor: '#f43f5e', badge: '🚀', badgeBg: '#eff6ff', badgeColor: '#1d4ed8', ring: 'from-sky-200 via-indigo-100 to-pink-300', glow: 'shadow-[0_14px_26px_-4px_rgba(37,99,235,0.65)]' },
    '68f4b3c11dc146998b762499': { style: 'tophat', c1: '#a855f7', c2: '#581c87', c3: '#2e1065', visor: '#3b0764', badge: '🌠', badgeBg: '#fef08a', badgeColor: '#6b21a8', ring: 'from-purple-300 via-amber-100 to-fuchsia-400', glow: 'shadow-[0_14px_26px_-4px_rgba(168,85,247,0.7)]' },
    '68f4b3c11dc146998b762494': { style: 'fedora', c1: '#991b1b', c2: '#450a0a', c3: '#1c0404', visor: '#7f1d1d', badge: '✦', badgeBg: '#fef08a', badgeColor: '#78350f', ring: 'from-amber-300 via-red-100 to-yellow-400', glow: 'shadow-[0_16px_28px_-4px_rgba(185,28,28,0.7)]' },
    '68f55d975162c3bafe50ee09': { style: 'space', c1: '#67e8f9', c2: '#0891b2', c3: '#164e63', visor: '#a5f3fc', badge: '🛸', badgeBg: '#ecfeff', badgeColor: '#0e7490', ring: 'from-cyan-300 via-sky-100 to-indigo-400', glow: 'shadow-[0_16px_28px_-4px_rgba(6,182,212,0.75)]' },
    '68f6a46c08620e098533b10b': { style: 'crownCap', c1: '#c084fc', c2: '#6b21a8', c3: '#3b0764', visor: '#eab308', badge: '👑', badgeBg: '#fef9c3', badgeColor: '#6b21a8', ring: 'from-amber-300 via-purple-100 to-yellow-400', glow: 'shadow-[0_16px_28px_-4px_rgba(168,85,247,0.75)]' },
    '68f4b3c11dc146998b76249a': { style: 'diamondCap', c1: '#e0f2fe', c2: '#38bdf8', c3: '#0369a1', visor: '#bae6fd', badge: '💎', badgeBg: '#ffffff', badgeColor: '#0284c7', ring: 'from-cyan-200 via-sky-100 to-blue-400', glow: 'shadow-[0_16px_28px_-4px_rgba(14,165,233,0.75)]' },
    '68f55d975162c3bafe50ee0e': { style: 'racing', c1: '#ef4444', c2: '#991b1b', c3: '#18181b', visor: '#18181b', badge: '🏎️', badgeBg: '#ffffff', badgeColor: '#dc2626', ring: 'from-red-300 via-amber-100 to-zinc-300', glow: 'shadow-[0_18px_30px_-4px_rgba(220,38,38,0.8)]' },
    '68f55d975162c3bafe50ee0f': { style: 'diamondCap', c1: '#f5d0fe', c2: '#a855f7', c3: '#4c1d95', visor: '#e879f9', badge: '🔮', badgeBg: '#fdf4ff', badgeColor: '#7e22ce', ring: 'from-purple-300 via-fuchsia-100 to-pink-400', glow: 'shadow-[0_18px_30px_-4px_rgba(168,85,247,0.85)]' },
    '68f4b3c11dc146998b76249b': { style: 'supreme', c1: '#fef08a', c2: '#f59e0b', c3: '#78350f', visor: '#38bdf8', badge: '💎', badgeBg: '#ffffff', badgeColor: '#d97706', ring: 'from-amber-300 via-cyan-100 to-yellow-400', glow: 'shadow-[0_18px_32px_-4px_rgba(234,179,8,0.9)]' }
};

const CapArtwork3D = ({ gift }) => {
    const id = String(gift?.id || '');
    const cfg = CAP_CONFIGS[id] || CAP_CONFIGS['68f4b3c11dc146998b762496'];
    const uid = id.replace(/[^a-zA-Z0-9]/g, '') || 'cap';

    return (
        <svg viewBox="0 0 110 92" className="w-16 h-16 drop-shadow-[0_8px_10px_rgba(0,0,0,0.28)]">
            <defs>
                <linearGradient id={`grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={cfg.c1} />
                    <stop offset="55%" stopColor={cfg.c2} />
                    <stop offset="100%" stopColor={cfg.c3} />
                </linearGradient>
            </defs>

            <ellipse cx="55" cy="80" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />

            {cfg.style === 'beret' && (
                <>
                    <path d="M18 54 C14 32, 48 18, 86 30 C96 34, 92 52, 76 58 L24 58 Z" fill={`url(#grad-${uid})`} />
                    <path d="M52 24 L56 16" stroke={cfg.c3} strokeWidth="3" strokeLinecap="round" />
                    <rect x="24" y="55" width="52" height="6" rx="3" fill={cfg.c3} />
                </>
            )}

            {cfg.style === 'bucket' && (
                <>
                    <path d="M12 62 Q55 50 98 62 L88 68 Q55 58 22 68 Z" fill={cfg.visor} />
                    <path d="M28 58 L33 26 C38 20, 72 20, 77 26 L82 58 Z" fill={`url(#grad-${uid})`} />
                    <path d="M31 48 Q55 53 79 48" stroke="#38bdf8" strokeWidth="4" fill="none" />
                </>
            )}

            {cfg.style === 'fedora' && (
                <>
                    <ellipse cx="55" cy="61" rx="46" ry="11" fill={cfg.c3} />
                    <ellipse cx="55" cy="59" rx="44" ry="9" fill={`url(#grad-${uid})`} />
                    <path d="M31 57 L36 25 C43 20, 67 20, 74 25 L79 57 Z" fill={`url(#grad-${uid})`} />
                    <path d="M32 50 Q55 55 78 50 L79 55 Q55 60 31 55 Z" fill="#facc15" />
                </>
            )}             {cfg.style === 'tophat' && (
                <>
                    <ellipse cx="55" cy="64" rx="44" ry="10" fill={cfg.c3} />
                    <rect x="32" y="16" width="46" height="48" rx="6" fill={`url(#grad-${uid})`} />
                    <rect x="32" y="52" width="46" height="7" fill="#facc15" />
                    <path d="M22 14 L24 19 L29 21 L24 23 L22 28 L20 23 L15 21 L20 19 Z" fill="#fef08a" />
                </>
            )}

            {cfg.style === 'band' && (
                <>
                    <path d="M20 44 L30 24 L80 24 L90 44 L80 56 L30 56 Z" fill={`url(#grad-${uid})`} />
                    <path d="M28 54 Q55 48 94 60 Q72 70 28 60 Z" fill={cfg.visor} />
                    <path d="M28 50 L82 50" stroke="#facc15" strokeWidth="3.5" />
                </>
            )}

            {cfg.style === 'space' && (
                <>
                    <ellipse cx="55" cy="48" rx="48" ry="10" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6 4" />
                    <path d="M22 58 C22 28, 88 28, 88 58 Z" fill={`url(#grad-${uid})`} />
                    <path d="M24 54 Q58 46 100 58 Q74 70 26 60 Z" fill={cfg.visor} opacity="0.85" />
                </>
            )}

            {(cfg.style === 'cap' || cfg.style === 'snapback' || cfg.style === 'tiaraCap' || cfg.style === 'crownCap' || cfg.style === 'flameCap' || cfg.style === 'diamondCap' || cfg.style === 'racing' || cfg.style === 'supreme') && (
                <>
                    {cfg.style === 'flameCap' && (
                        <path d="M18 54 C10 38, 22 22, 30 16 C28 26, 36 28, 40 20 C46 10, 64 10, 70 20 C74 28, 82 26, 80 16 C88 22, 100 38, 92 54 Z" fill="#f97316" opacity="0.85" />
                    )}

                    {cfg.style === 'tiaraCap' && (
                        <polygon points="36,24 42,12 55,20 68,12 74,24" fill="#fde047" stroke="#ffffff" strokeWidth="1" />
                    )}

                    {(cfg.style === 'crownCap' || cfg.style === 'supreme') && (
                        <polygon points="34,24 38,8 48,18 55,6 62,18 72,8 76,24" fill="#facc15" stroke="#92400e" strokeWidth="1.2" />
                    )}

                    <circle cx="55" cy="21" r="3.5" fill={cfg.c1} />

                    <path d="M22 58 C22 31, 40 21, 55 21 C70 21, 88 31, 88 58 Z" fill={`url(#grad-${uid})`} />
                    <path d="M55 21 C47 33, 45 45, 45 58" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" fill="none" />

                    {cfg.style === 'snapback' || cfg.style === 'racing' ? (
                        <path d="M24 55 L102 57 Q84 68 26 62 Z" fill={cfg.visor} />
                    ) : (
                        <path d="M22 55 Q58 47 100 60 Q75 72 26 62 Z" fill={cfg.visor} />
                    )}

                    {cfg.style === 'racing' && (
                        <path d="M30 57 L88 58" stroke="#ffffff" strokeWidth="3" strokeDasharray="5 5" />
                    )}

                    {cfg.style === 'supreme' && (
                        <path d="M16 18 L22 24 M94 18 L88 24 M12 40 L19 40 M98 40 L91 40" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                    )}
                </>
            )}

            <circle cx="55" cy="41" r="10.5" fill={cfg.badgeBg} stroke={cfg.c2} strokeWidth="1.5" />
            <text x="55" y="45" textAnchor="middle" fontSize="11" fontWeight="bold" fill={cfg.badgeColor}>
                {cfg.badge}
            </text>
        </svg>
    );
};

const GiftRender3D = ({ gift }) => {
    const id = String(gift?.id || '');
    const cfg = CAP_CONFIGS[id] || CAP_CONFIGS['68f4b3c11dc146998b762496'];

    return (
        <div className={`relative w-20 h-20 mx-auto my-1 rounded-2xl bg-gradient-to-br ${cfg.ring} p-[2px] ${cfg.glow} transition-transform duration-300`}>
            <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-white/95 to-white/75 flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-6 -left-6 w-14 h-14 rounded-full bg-white/80 blur-sm pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center">
                    <CapArtwork3D gift={gift} />
                </div>
            </div>
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
                    className={`absolute top-2 right-2 z-20 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
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
                {gift?.name || 'Gorra'}
            </p>

            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{price.toFixed(2)}</span>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 ml-0.5" />
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
            if (!fan?.id) throw new Error('Debes iniciar sesión para dejar tu aporte a la gorra.');
            if (!selectedGift) throw new Error('Selecciona una gorra primero.');

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
                if (found?.id) {
                    targetArtistId = found.id;
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
                recipient_name: artist?.artist_name || 'Artista',                amount_usd: giftPrice,
                star_value: giftPrice,
                status: 'approved',
                payment_method: 'credits',
            });

            await base44.entities.Transaction.create({
                user_id: fan.id,
                type: 'credit_purchase',
                amount: -giftPrice,
                description: `Aporte a la gorra: ${selectedGift.name} a ${artist?.artist_name || 'Artista'}`,
                payment_method: 'credits',
                status: 'approved'
            });

            await base44.entities.Transaction.create({
                user_id: targetArtistId,
                type: 'prize_won',
                amount: giftPrice,
                description: `Aporte recibido en la gorra: ${selectedGift.name} de ${fan.full_name || 'Un fan'}`,
                payment_method: 'system_credits',
                status: 'approved'
            });

            await base44.entities.Notification.create({
                user_id: targetArtistId,
                title: `🧢 ¡Nuevo aporte en tu gorra!`,
                message: `${fan.full_name || 'Un fan'} dejó una ${selectedGift.name} en tu gorra. ¡Sumaste ${giftPrice.toFixed(2)} estrellas ⭐!`,
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
            setErrorMessage(error?.message || 'Ocurrió un error al enviar tu aporte.');
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
                    <h3 className="text-xl font-bold mb-2">Inicia sesión para aportar a la gorra</h3>
                    <p className="text-gray-600 mb-6">Entra a tu cuenta para apoyar el talento de {artist.artist_name}.</p>
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
                        <h3 className="text-xl font-bold mb-2">¡Aporte en la Gorra Enviado!</h3>
                        <p className="text-gray-700">
                            {artist.artist_name} recibió tu <strong>{selectedGift?.name}</strong> ({selectedPrice.toFixed(2)} ⭐). ¡Gracias por apoyar!
                        </p>
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
                        <h3 className="text-xl font-bold">Dejando tu aporte en la gorra...</h3>
                        <p className="text-gray-600">Por favor, espera un momento.</p>
                    </div>
                );
            case 'select':
            default:
                return (
                    <div className="flex flex-col max-h-[88vh]">
                        <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center flex-shrink-0">
                            <div className="truncate pr-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                                    <h2 className="text-lg sm:text-xl font-bold truncate">A la Gorra • {artist.artist_name}</h2>
                                </div>
                                <p className="text-xs text-purple-100 mt-0.5">Elegí una gorra según el monto que quieras dejar (1 crédito = 1 ⭐)</p>
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
                                <div className="text-center py-8 text-gray-500">Cargando gorras...</div>
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
                                    ? `Dejar ${selectedGift.name} (${selectedPrice.toFixed(2)} ⭐)`
                                    : 'Selecciona una gorra para aportar'}
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
