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
        a: '1. Completá tu perfil.\n2. Elegí la convocatoria de tu género y revisá las condiciones publicadas en esa sala.\n3. Subí tu video y completá tu inscripción (con el valor publicado en la sala mediante Passline en Argentina o PayPal en el exterior, o gratis en las salas habilitadas sin costo).\n4. Una vez confirmada, tu video queda activo para recibir votos.'
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
        a: 'El valor de inscripción lo define la administración y se publica siempre de forma visible en cada sala antes de inscribirte (abonándose mediante Passline en Argentina o PayPal en el exterior).\nAdemás, la organización puede habilitar salas de concursos 100% gratuitas para que todos los participantes puedan sumarse sin costo.'
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
        a: 'Es lo que recibe el artista por los regalos de sus fans (1 ⭐ = 1 USD de referencia).\nEs el único saldo canjeable y es totalmente independiente del premio del concurso.'
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
        q: '¿Cómo cobro mis Estrellas ⭐ y cómo se reparte el canje?',
        a: 'En "Canjear Estrellas": indicás el monto (mínimo 1 ⭐) y tu cuenta de PayPal o Binance.\nDel total canjeado, vos recibís el 70% neto en USD directamente en tu cuenta y la administración retiene el 30% para el mantenimiento, soporte y operación de la plataforma. Procesamos tu pago en 24-48 horas hábiles.'
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
        a: '1. Completá tu perfil.\n2. Elegí la convocatoria de tu género y revisá las condiciones publicadas en esa sala.\n3. Subí tu video y completá tu inscripción (con el valor publicado en la sala mediante Passline en Argentina o PayPal en el exterior, o gratis en las salas habilitadas sin costo).\n4. Una vez confirmada, tu video queda activo para recibir votos.'
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
        a: 'El valor de inscripción lo define la administración y se publica siempre de forma visible en cada sala antes de inscribirte (abonándose mediante Passline en Argentina o PayPal en el exterior).\nAdemás, la organización puede habilitar salas de concursos 100% gratuitas para que todos los participantes puedan sumarse sin costo.'
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
        a: 'Es lo que recibe el artista por los regalos de sus fans (1 ⭐ = 1 USD de referencia).\nEs el único saldo canjeable y es totalmente independiente del premio del concurso.'
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
        q: '¿Cómo cobro mis Estrellas ⭐ y cómo se reparte el canje?',
        a: 'En "Canjear Estrellas": indicás el monto (mínimo 1 ⭐) y tu cuenta de PayPal o Binance.\nDel total canjeado, vos recibís el 70% neto en USD directamente en tu cuenta y la administración retiene el 30% para el mantenimiento, soporte y operación de la plataforma. Procesamos tu pago en 24-48 horas hábiles.'
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
