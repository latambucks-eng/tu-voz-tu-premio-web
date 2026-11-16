import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const items = [
  {
    title: 'Qué es',
    text: 'Una plataforma de concursos de canto online. No es apuestas, juegos de azar ni sorteos.'
  },
  {
    title: 'Cómo participás',
    text: 'Completás tu perfil, subís tu video a la sala de tu género y pagás la inscripción por Passline.'
  },
  {
    title: 'Cuánto cuesta',
    text: 'La inscripción es de 10 USD por convocatoria. Mirar y votar es gratis.'
  },
  {
    title: 'El premio',
    text: 'Es un monto fijo en USD por sala. Lo paga la organización al ganador por PayPal o Binance dentro de los 10 días hábiles posteriores al cierre.'
  },
  {
    title: 'Estrellas ⭐',
    text: 'Te las envían tus fans con regalos. 1 Estrella ⭐ = 1 USD y las canjeás cuando quieras.'
  },
  {
    title: 'Tus datos',
    text: 'Pedimos solo lo necesario. No guardamos datos de tarjetas: los pagos los procesan Passline, PayPal o Binance.'
  }
];

export default function LegalPlainSummary() {
  return (
    <Card className="mb-8 border-purple-200 bg-purple-50/60">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-purple-900 mb-1">Todo esto, en simple</h2>
        <p className="text-sm text-purple-800 mb-5">Lo esencial antes de leer el detalle.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-lg border border-purple-100 p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-purple-900/70 mt-5">
          Este resumen es orientativo. El texto legal completo que aparece abajo es el que rige.
        </p>
      </CardContent>
    </Card>
  );
}