// Definiciones centrales de las tres unidades de valor de la plataforma.
// Se usan en Home, FAQ y textos legales para que la diferencia sea siempre la misma.

export const CREDITOS = {
  nombre: 'Créditos',
  resumen: 'Saldo que se compra con dinero y sirve para enviar regalos a un artista.',
  detalles: [
    'Se compran en paquetes (desde 5.25 USD). 1 crédito = 1 USD de referencia.',
    'Se usan para enviar regalos a los artistas. La inscripción NO se paga con créditos: son 10 USD por Passline.',
    'No son estrellas y NO se canjean por dinero.'
  ]
};

export const PREMIO = {
  nombre: 'Premio del concurso (USD)',
  resumen: 'Monto fijo en dólares que publica la organización para cada sala y que la plataforma entrega al ganador.',
  detalles: [
    'Es un monto definido de antemano: no depende de las inscripciones ni de los créditos comprados.',
    'Cada sala tiene un único ganador: recibe el premio completo de esa sala.',
    'No se canjea ni pasa por tu saldo de estrellas: la organización lo transfiere directo a tus datos de pago.',
    'Se abona al ganador por PayPal o Binance dentro de los 10 días hábiles posteriores al cierre de la convocatoria.'
  ]
};

export const ESTRELLAS = {
  nombre: 'Estrellas ⭐ canjeables',
  resumen: 'Recompensa que recibe el artista cuando un fan le envía un regalo pagado con sus créditos.',
  detalles: [
    'El fan compra créditos y los usa para enviar un regalo; el artista recibe las estrellas de ese regalo.',
    'Cada regalo acredita la cantidad de estrellas indicada en el catálogo de regalos.',
    '1 Estrella ⭐ = 1 USD canjeable, sin mínimo de canje.',
    'No las entrega la plataforma como premio: provienen del apoyo de los fans.'
  ]
};

export const COMPARACION = [
  { aspecto: '¿Quién la entrega?', premio: 'La plataforma (organización)', estrellas: 'Los fans, con sus créditos' },
  { aspecto: '¿Cómo se obtiene?', premio: 'Ganando la sala (el artista más votado)', estrellas: 'Recibiendo regalos de fans' },
  { aspecto: '¿De qué monto?', premio: 'Fijo en USD, publicado en la tarjeta de la sala', estrellas: 'Según el regalo recibido' },
  { aspecto: '¿Cuándo se acredita?', premio: 'Al cerrar la sala; se abona dentro de los 10 días hábiles posteriores', estrellas: 'Al enviarse el regalo' },
  { aspecto: '¿Cómo se cobra?', premio: 'Pago directo a tus datos de PayPal o Binance, sin canje', estrellas: 'Canje en USD desde la plataforma (24-48 h hábiles)' }
];