import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export const faqs = [
  {
    category: 'Lo básico',
    questions: [
      {
        q: '¿Qué es Tu Voz, Tu Premio?',
        a: 'Concursos de canto online: subís un video y el público vota.\nEl más votado de cada sala gana un premio fijo en USD. No es apuestas ni sorteos.'
      },
      {
        q: '¿Cómo participo?',
        a: '1. Completá tu perfil.\n2. Elegí la convocatoria de tu género.\n3. Subí tu video y completá la inscripción (mediante Passline en Argentina, PayPal en el exterior, o con Acceso Gratuito $0 USD cuando haya promoción activa).\n4. Una vez confirmada, tu video queda activo para recibir votos.'
      },
      {
        q: '¿Cuánto se gana?',
        a: 'El premio fijo en USD que figura en la convocatoria.\nNo depende de las inscripciones ni de los créditos: la organización lo paga completo al ganador.'
      },
      {
        q: '¿Cómo se define al ganador?',
        a: 'Gana el artista con más votos del público en su sala.\nEl segundo porcentaje más alto queda como finalista destacado, sin premio, y el resto como participante destacado.'
      },
      {
        q: '¿Qué pasa si hay empate en el primer lugar?',
        a: 'El premio NO se reparte. Se abre una ronda de finalistas: solo los artistas empatados siguen compitiendo y se cuentan los votos nuevos de esa ronda. El que quede primero se lleva el 100% del premio. Si vuelven a empatar, se abre otra ronda hasta que haya un único ganador.'
      }
    ]
  },
  {
    category: 'Plata, premios y pagos',
    questions: [
      {
        q: '¿Cuánto cuesta inscribirse?',
        a: 'El valor estándar es de 10 USD por convocatoria (abonado por Passline en Argentina o PayPal en el exterior).\nEn convocatorias con promoción de lanzamiento habilitada, el acceso es 100% gratuito ($0.00 USD).'
      },
      {
        q: '¿Cómo se paga el premio?',
        a: 'La organización lo transfiere íntegro por PayPal o Binance al ganador, dentro de los 10 días hábiles posteriores al cierre.\nNo entra al saldo canjeable ni se pide por "Canjear Estrellas".'
      },
      {
        q: '¿Qué datos de cobro informo?',
        a: 'En "Editar Perfil": método (PayPal o Binance), nombre del titular y el email de PayPal o el email/ID de Binance.\nSi el dato está mal, no podemos transferirte el premio.'
      },
      {
        q: '¿Quién paga comisiones e impuestos?',
        a: 'Las comisiones de la transferencia externa las cubre quien recibe.\nLos impuestos de tu país son responsabilidad de cada usuario: no retenemos impuestos.'
      }
    ]
  },
  {
    category: 'Créditos y Estrellas ⭐',
    questions: [
      {
        q: '¿Qué son los créditos?',
        a: 'Un saldo que comprás con dinero y sirve solo para enviar regalos.\nNo se canjean por dinero y no sirven para pagar la inscripción.'
      },
      {
        q: '¿Qué son las Estrellas ⭐?',
        a: 'Es lo que recibe el artista por los regalos de sus fans: 1 ⭐ = 1 USD bruto.\nEs el único saldo canjeable y no tiene relación con el premio del concurso.'
      },
      {
        q: '¿Cómo compro créditos?',
        a: 'En "Comprar Créditos": elegís el paquete, pagás con el enlace de PayPal e informás el email o ID de la transacción.\nEl cobro aparece a nombre de LatamBucks y se acredita en 24-48 horas.'
      },
      {
        q: '¿Cómo envío un regalo?',
        a: 'Entrá al perfil del artista, elegí un regalo del catálogo y pagalo con tus créditos.\nEl artista recibe las Estrellas ⭐ de ese regalo.'
      },
      {
        q: '¿Cómo cobro mis Estrellas ⭐ y qué comisión aplica?',
        a: 'En "Canjear Estrellas": indicás el monto (mínimo 1 ⭐) y tu cuenta de PayPal o Binance.\nAl canjear a dinero real, la plataforma retiene una comisión del 30% por gestión y mantenimiento del sitio, y te transfiere el 70% neto en USD dentro de las 24-48 horas hábiles.'
      },
      {
        q: '¿Los créditos se devuelven?',
        a: 'No. Los créditos no se reembolsan ni se cambian por dinero: solo sirven para enviar regalos.'
      }
    ]
  },
  {
    category: 'Fans y votación',
    questions: [
      {
        q: '¿Necesito cuenta para votar?',
        a: 'No. Podés votar sin registrarte: un voto por artista.\nUsamos control de dispositivo para evitar votos falsos.'
      },
      {
        q: '¿Puedo votar en la ronda de finalistas?',
        a: 'Sí. En esa ronda solo compiten los artistas empatados y cuentan únicamente los votos emitidos desde que empezó la ronda.'
      },
      {
        q: '¿Los fans ganan premios?',
        a: 'No. El premio es solo para el artista ganador; votar es gratis.'
      },
      {
        q: '¿Cómo comparto a un artista?',
        a: 'Desde su perfil o su tarjeta en la sala de votación, con el botón de compartir (WhatsApp, redes o copiar enlace).'
      }
    ]
  },
  {
    category: 'Reglas y confianza',
    questions: [
      {
        q: '¿Tengo que aceptar las Bases y Condiciones?',
        a: 'Sí. Al inscribirte, votar o comprar créditos aceptás las Bases: inscripción, votación, premio y reembolsos.'
      },
      {
        q: '¿Cómo me contacta la organización?',
        a: 'Solo por la plataforma y los datos de tu perfil.\nNunca te pedimos claves ni pagos por mensaje privado.'
      },
      {
        q: '¿Es seguro?',
        a: 'Sí. Pagos con procesadores certificados, control antifraude y protección de contenido.\nNo guardamos datos de tarjetas ni bancarios.'
      },
      {
        q: '¿Cómo reporto contenido inadecuado?',
        a: 'Con el botón de reporte o desde Soporte.\nModeración revisa y actúa en 24-48 horas.'
      },
      {
        q: '¿Desde dónde puedo participar?',
        a: 'Desde cualquier país: la plataforma es 100% online y se opera desde Argentina para toda Latinoamérica.'
      }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={createPageUrl('Home')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al sitio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <HelpCircle className="w-14 h-14 mx-auto text-purple-600 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-600">
            Respuestas cortas y claras sobre cómo funciona la plataforma
          </p>
        </motion.div>


        <div className="space-y-10">
          {faqs.map((category, catIndex) => (
            <div key={category.category}>
              <h2 className="text-xl md:text-2xl font-bold text-purple-900 mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${catIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <Card key={globalIndex} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-purple-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="border-t border-gray-200"
                          >
                            <p className="p-5 text-gray-700 bg-gray-50 whitespace-pre-line leading-relaxed">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">¿Te quedó una duda?</h3>
              <p className="text-purple-100 mb-6">
                Escribinos por Soporte y te respondemos dentro de la plataforma
              </p>
              <Link to={createPageUrl('Support')}>
                <button className="bg-white text-purple-700 hover:bg-purple-50 font-bold py-3 px-8 rounded-lg transition-all">
                  Ir a Soporte
                </button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
