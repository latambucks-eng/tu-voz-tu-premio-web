import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins, Sparkles, AlertCircle, Check, Star, Gift } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import Icon3D from '@/components/brand/Icon3D';
import Star3D from '@/components/brand/Star3D';

const TIERS = {
  5: { band: 'from-sky-500 to-cyan-500', badge: 'Para empezar' },
  10: { band: 'from-violet-500 to-purple-500', badge: 'El más elegido' },
  20: { band: 'from-fuchsia-500 to-purple-600', badge: 'Mejor valor' },
  50: { band: 'from-amber-500 to-orange-500', badge: 'Fan premium' },
  100: { band: 'from-emerald-500 to-teal-600', badge: 'Súper fan' },
};

const DEFAULT_TIER = { band: 'from-gray-600 to-gray-800', badge: 'Paquete' };

export default function PackageSelection({ onSelect }) {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const links = await base44.entities.PaymentLink.filter({
        is_active: true,
        payment_method: 'paypal'
      }, 'package_amount');

      setPaymentLinks(links || []);

      if (!links || links.length === 0) {
        setError('No hay paquetes disponibles en este momento. Contacta soporte.');
      }
    } catch (err) {
      console.error('Error loading packages:', err);
      setError('Error al cargar paquetes. Por favor, recarga la página.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // 1 crédito = 1 USD
  const packages = paymentLinks.map(link => ({
    ...link,
    credits: link.package_amount,
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Elegí tu paquete de créditos
        </h3>
        <p className="text-gray-600">
          1 crédito = 1 USD • Con tus créditos enviás regalos y el artista recibe el mismo valor en estrellas ⭐
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const tier = TIERS[pkg.package_amount] || DEFAULT_TIER;
          const isPopular = pkg.package_amount === 20;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={isPopular ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <Card
                className={`relative h-full overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPopular ? 'border-purple-500 shadow-lg shadow-purple-100' : 'border-gray-200'
                }`}
              >
                {isPopular && (
                  <div className="absolute right-4 top-4 z-10">
                    <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-purple-700 shadow">
                      <Sparkles className="w-3 h-3" />
                      Más popular
                    </span>
                  </div>
                )}

                <div className={`bg-gradient-to-br ${tier.band} px-6 pb-6 pt-8 text-center text-white`}>
                  <Icon3D icon={Coins} size="lg" gradient="bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600" className="mb-4" />
                  <p className="text-4xl font-extrabold leading-none">{pkg.credits}</p>
                  <p className="mt-1 text-sm font-medium text-white/90">
                    {pkg.credits === 1 ? 'crédito' : 'créditos'}
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {tier.badge}
                  </span>
                </div>

                <CardContent className="flex flex-col p-6">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-gray-900">
                      ${pkg.package_amount.toFixed(2)}
                      <span className="ml-1 text-sm font-semibold text-gray-500">USD</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Pago seguro con PayPal</p>
                  </div>

                  <div className="my-5 h-px w-full bg-gray-100" />

                  <ul className="mb-6 space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      Enviá regalos a tus artistas favoritos
                    </li>
                    <li className="flex items-start gap-2">
                      <Star3D size={16} className="mt-0.5" />
                      El artista recibe {pkg.credits} {pkg.credits === 1 ? 'estrella' : 'estrellas'} ⭐
                    </li>
                    <li className="flex items-start gap-2">
                      <Gift className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                      1 crédito = 1 USD, sin recargos
                    </li>
                  </ul>

                  <Button
                    onClick={() => onSelect(pkg)}
                    className={`mt-auto w-full rounded-xl bg-gradient-to-r ${tier.band} py-6 text-base font-bold text-white shadow-md transition-opacity hover:opacity-90`}
                  >
                    Comprar {pkg.credits} {pkg.credits === 1 ? 'crédito' : 'créditos'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>💡 Cómo funciona:</strong> elegís un paquete → pagás con PayPal → escribís el correo o ID de la transacción (sin comprobantes) → aprobamos tu pago en 24-48 hs y los créditos se acreditan en tu wallet.
        </AlertDescription>
      </Alert>
    </div>
  );
}