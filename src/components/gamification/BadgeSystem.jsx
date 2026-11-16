import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Trophy, Star, Zap, Heart, TrendingUp, Users, Medal } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BADGE_CONFIGS = {
  first_participation: {
    icon: Trophy,
    name: 'Primera Participación',
    description: '¡Participaste en tu primer concurso!',
    color: 'from-blue-400 to-blue-600'
  },
  first_vote: {
    icon: Star,
    name: 'Primer Voto',
    description: '¡Votaste por primera vez!',
    color: 'from-yellow-400 to-orange-500'
  },
  first_win: {
    icon: Medal,
    name: 'Primera Victoria',
    description: '¡Ganaste tu primer concurso!',
    color: 'from-purple-400 to-pink-600'
  },
  super_sharer: {
    icon: Zap,
    name: 'Súper Compartidor',
    description: 'Compartiste más de 50 perfiles',
    color: 'from-green-400 to-emerald-600'
  },
  loyal_fan: {
    icon: Heart,
    name: 'Fan Leal',
    description: 'Sigues a más de 10 artistas',
    color: 'from-red-400 to-pink-500'
  },
  rising_star: {
    icon: TrendingUp,
    name: 'Estrella en Ascenso',
    description: 'Recibiste más de 100 votos',
    color: 'from-cyan-400 to-blue-500'
  },
  veteran_artist: {
    icon: Award,
    name: 'Artista Veterano',
    description: 'Participaste en 5+ concursos',
    color: 'from-amber-400 to-orange-600'
  },
  top_voter: {
    icon: Users,
    name: 'Votante TOP',
    description: 'Votaste en más de 20 participaciones',
    color: 'from-indigo-400 to-purple-600'
  }
};

export default function BadgeSystem({ userId, compact = false }) {
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    if (userId) {
      loadBadges();
    }
  }, [userId]);

  const loadBadges = async () => {
    try {
      const userBadges = await base44.entities.UserBadge.filter(
        { user_id: userId },
        '-earned_date'
      );
      setBadges(Array.isArray(userBadges) ? userBadges : []);
    } catch (error) {
      console.error('Error loading badges:', error);
      setBadges([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 3).map((badge) => {
          const config = BADGE_CONFIGS[badge.badge_type];
          if (!config) return null;
          const BadgeIcon = config.icon;
          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}
              title={badge.badge_name}
            >
              <BadgeIcon className="w-5 h-5 text-white" />
            </motion.div>
          );
        })}
        {badges.length > 3 && (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
            +{badges.length - 3}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-20 right-4 z-50"
          >
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  {(() => {
                    const config = BADGE_CONFIGS[newBadge.badge_type];
                    if (!config) return null;
                    const Icon = config.icon;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  🏆 ¡Nueva Insignia!
                </h3>
                <p className="text-sm font-semibold text-gray-700">{newBadge.badge_name}</p>
                <p className="text-xs text-gray-600 mt-1">{newBadge.badge_description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(BADGE_CONFIGS).map(([type, config]) => {
          const earned = badges.find(b => b.badge_type === type);
          const BadgeIcon = config.icon;
          
          return (
            <motion.div
              key={type}
              whileHover={earned ? { scale: 1.05 } : {}}
              className={`p-4 rounded-xl border-2 ${
                earned 
                  ? 'bg-white border-gray-200 shadow-md' 
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center ${!earned && 'grayscale'}`}>
                <BadgeIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-sm text-center text-gray-900 mb-1">
                {config.name}
              </h4>
              <p className="text-xs text-center text-gray-600">
                {config.description}
              </p>
              {earned && (
                <p className="text-xs text-center text-green-600 mt-2 font-semibold">
                  ✓ Desbloqueada
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

export const checkBadgeEligibility = async (userId) => {
  if (!userId) return;
  
  try {
    const [participations, votes, shares, followers, wins] = await Promise.all([
      base44.entities.Participant.filter({ artist_id: userId }),
      base44.entities.Vote.filter({ voter_id: userId }),
      base44.entities.FanShare.filter({ fan_id: userId }),
      base44.entities.Follower.filter({ fan_id: userId }),
      base44.entities.Winner.filter({ artist_id: userId })
    ]);

    const checks = [];

    if (participations && participations.length === 1) {
      checks.push('first_participation');
    }

    if (votes && votes.length === 1) {
      checks.push('first_vote');
    }

    if (wins && wins.length === 1) {
      checks.push('first_win');
    }

    if (shares && shares.length >= 50) {
      checks.push('super_sharer');
    }

    if (followers && followers.length >= 10) {
      checks.push('loyal_fan');
    }

    if (participations && participations.length >= 5) {
      checks.push('veteran_artist');
    }

    if (votes && votes.length >= 20) {
      checks.push('top_voter');
    }

    const existingBadges = await base44.entities.UserBadge.filter({ user_id: userId });
    const existingTypes = existingBadges ? existingBadges.map(b => b.badge_type) : [];

    for (const badgeType of checks) {
      if (!existingTypes.includes(badgeType)) {
        const config = BADGE_CONFIGS[badgeType];
        await base44.entities.UserBadge.create({
          user_id: userId,
          badge_type: badgeType,
          badge_name: config.name,
          badge_description: config.description
        });

        await base44.entities.Notification.create({
          user_id: userId,
          title: `🏆 ¡Nueva insignia desbloqueada!`,
          message: `Has ganado la insignia "${config.name}": ${config.description}`,
          type: 'profile_update'
        });
      }
    }
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
  }
};