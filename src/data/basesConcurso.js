// BASES Y CONDICIONES DEL CONCURSO — TuVozTuPremio (LatamBucks)
// Documento autónomo. Regula exclusivamente el concurso de canto online.
// Los términos de uso del sitio web se rigen por la página de Términos y Condiciones.

export const BASES_VERSION = 'Versión 1.0 · Noviembre 2026';

export const basesHighlights = [
  'Concurso 100% online, por salas separadas por género musical.',
  'Inscripción de 10 USD por Passline: paga el mantenimiento y la gestión de la plataforma.',
  'El premio es un monto fijo en USD que publica la organización y lo cobra el único ganador de la sala.',
  'El ganador se define por votación pública; si hay empate, se abre una ronda de finalistas.',
  'El premio se abona por PayPal o Binance dentro de los 10 días hábiles posteriores al cierre.',
  'Las estrellas ⭐ de los regalos de fans son independientes del premio del concurso.'
];

export const basesSections = [
  {
    n: '1',
    title: 'Organizador del concurso',
    blocks: [
      {
        p: 'El concurso "Tu Voz, Tu Premio" es organizado por LatamBucks, titular de la plataforma y del nombre comercial TuVozTuPremio, con CUIL 27-31164952-9, domicilio en la localidad de San Fernando, Provincia de Buenos Aires, República Argentina, y correo de contacto infotuvoz25@gmail.com.'
      },
      {
        p: 'La organización es la única responsable de la administración del concurso, de la verificación de las inscripciones, de la apertura y el cierre de cada sala, de la proclamación del ganador y del pago del premio. No existen terceros organizadores, promotores ni representantes autorizados a modificar estas bases.'
      },
      {
        note: {
          tone: 'blue',
          title: 'Concurso de talento, no juego de azar',
          text: 'El resultado de cada sala depende exclusivamente de la votación del público y de las reglas de desempate establecidas en la cláusula 18. No hay sorteo, azar, apuesta ni elemento aleatorio en ninguna etapa del concurso.'
        }
      }
    ]
  },
  {
    n: '2',
    title: 'Definiciones',
    blocks: [
      { p: 'A los efectos de estas bases, se entiende por:' },
      {
        subl: [
          ['Convocatoria o sala', 'cada competencia individual identificada por un nombre y un género musical (Pop, Rock, Urbano o Balada), con su propio premio publicado, sus propias fechas y su propia votación.'],
          ['Artista o participante', 'la persona humana mayor de 18 años que, con rol de artista en la plataforma, se inscribe en una sala y publica un video de interpretación vocal.'],
          ['Fan', 'toda persona que vota, comparte o envía regalos a un artista, sin necesidad de inscribirse en una sala.'],
          ['Inscripción', 'el acto por el cual el artista abona el valor publicado de la convocatoria por Passline y envía su perfil y su video a través de la plataforma.'],
          ['Premio', 'el monto fijo en dólares estadounidenses (USD) que la organización publica para cada sala y abona al único ganador.'],
          ['Créditos', 'saldo virtual que el usuario compra con dinero y que se utiliza para enviar regalos a artistas.'],
          ['Estrellas ⭐', 'unidad de un dólar estadounidense (1 ⭐ = 1 USD) que el artista recibe por los regalos de sus fans y que puede solicitar para cobro.'],
          ['Voto', 'la manifestación única e irreversible del público a favor de un participante dentro de una sala y de una ronda determinada.'],
          ['Ronda de finalistas', 'la instancia de desempate en la que solo compiten los artistas empatados en el primer lugar y en la que se cuentan únicamente los votos emitidos desde su inicio.']
        ]
      }
    ]
  },
  {
    n: '3',
    title: 'Aceptación de las bases y constancia de lectura',
    blocks: [
      {
        p: 'La participación en el concurso requiere la aceptación expresa de estas bases. Antes de enviar la inscripción, el artista debe leerlas y marcar la casilla de aceptación que se muestra en el último paso del formulario de inscripción; el botón de envío permanece deshabilitado hasta que esa casilla esté marcada.'
      },
      {
        p: 'La aceptación se registra electrónicamente junto con la inscripción: fecha y hora del envío, correo electrónico de la cuenta, identificador del usuario, dirección IP y la transacción asociada al pago de la inscripción. Ese registro constituye prueba suficiente de la lectura y aceptación de las bases vigentes en ese momento.'
      },
      {
        ul: [
          'No se admite inscripción sin la aceptación marcada.',
          'La versión aplicable es la publicada al momento de la inscripción, identificada en el encabezado de este documento.',
          'El artista declara haber leído la totalidad de las bases y no puede alegar desconocimiento de su contenido.'
        ]
      }
    ]
  },
  {
    n: '4',
    title: 'Carácter online y autogestionado del concurso',
    blocks: [
      {
        p: 'El concurso es 100% online y se desarrolla íntegramente a través de la plataforma: la postulación, la audición, la inscripción, el pago, la publicación del video, la votación, el desempate, la proclamación del ganador y la comunicación del resultado se realizan por canales digitales. No existen sedes físicas, presentaciones presenciales ni instancias de votación fuera de la plataforma.'
      },
      {
        p: 'El artista gestiona su propia participación: crea su perfil artístico, carga sus redes sociales, sube su video y difunde su participación. La organización no garantiza difusión, publicidad, reproducciones, votos ni posición alguna en la sala.'
      }
    ]
  },
  {
    n: '5',
    title: 'Estructura del concurso: salas por género',
    blocks: [
      {
        p: 'Las convocatorias se organizan en salas separadas por género musical: Pop, Rock, Urbano y Balada. Cada sala es una convocatoria independiente y autónoma.'
      },
      {
        ul: [
          'Cada sala tiene su propio premio publicado, su propio cupo, sus propias fechas y su propia votación.',
          'Cada sala tiene un único ganador, que recibe el premio completo de esa sala.',
          'Los premios de distintas salas no se acumulan, no se suman ni se reparten entre salas o géneros.',
          'La verificación de pagos, el cierre, la proclamación del ganador y la publicación en el Salón de la Fama se realizan sala por sala.'
        ]
      }
    ]
  },
  {
    n: '6',
    title: 'Requisitos para participar como artista',
    blocks: [
      { p: 'Para inscribirse en una sala, el postulante debe reunir y mantener al momento de la inscripción los siguientes requisitos:' },
      {
        ul: [
          'Ser persona humana, mayor de 18 años, con capacidad legal para contratar.',
          'Tener una cuenta propia en la plataforma con rol de artista seleccionado.',
          'Tener el perfil artístico completo: nombre artístico, biografía, foto de perfil, país, teléfono, Instagram, Facebook y TikTok.',
          'No registrar una inscripción activa o pendiente en la misma sala: solo se admite una inscripción por artista y por convocatoria.',
          'Contar con una cuenta de PayPal o Binance válida y activa a su nombre para poder recibir el premio.',
          'Aceptar estas bases y las pautas de contenido de la cláusula 11.'
        ]
      },
      {
        note: {
          tone: 'amber',
          title: 'Una inscripción por sala',
          text: 'El sistema rechaza una segunda inscripción del mismo artista en la misma sala. Tampoco se admite inscribirse con datos de identidad o perfiles falsos, suplantar a otra persona ni utilizar cuentas de terceros.'
        }
      }
    ]
  },
  {
    n: '7',
    title: 'Audición y selección previa de talento',
    blocks: [
      {
        p: 'El acceso a la inscripción formal está precedido por una instancia de audición y selección de talento a cargo de un coach vocal capacitado. Las audiciones se difunden por los canales de la plataforma y la postulación se realiza por el formulario que habilita el coach que las implementa.'
      },
      {
        ul: [
          'La evaluación es artística, discrecional y propia del coach vocal; no es revisable por la organización ni genera derecho a inscribirse, a participar ni a reclamar.',
          'Solo los artistas seleccionados o invitados quedan habilitados para realizar la inscripción formal y abonar el valor de la convocatoria.',
          'La organización no garantiza que todos los postulantes sean seleccionados.',
          'La organización puede suspender, reprogramar o cancelar una audición o una convocatoria antes de la inscripción formal, sin que ello genere derecho a compensación.'
        ]
      },
      {
        note: {
          tone: 'gray',
          title: 'Etapa previa y gratuita para el postulante',
          text: 'La audición no otorga derecho sobre el premio ni obliga a la organización a admitir al postulante en una sala. El pago de la inscripción se realiza únicamente después de la selección y antes de enviar la inscripción formal.'
        }
      }
    ]
  },
  {
    n: '8',
    title: 'Inscripción: valor, medio de pago y contraprestación',
    blocks: [
      {
        p: 'El valor de la inscripción en cada convocatoria es el publicado en la ficha de la sala y en el proceso de pago, y asciende a 10 USD por defecto. Se abona en dólares estadounidenses mediante Passline, plataforma de pagos de terceros, a través del enlace de pago publicado para esa convocatoria.'
      },
      {
        sub: 'Naturaleza del importe',
        ul: [
          'Es la contraprestación por el mantenimiento, la operación y la gestión de la plataforma online: infraestructura y servidores, almacenamiento de videos, desarrollo y soporte técnico, moderación de contenido, sistema antifraude y auditoría de votos, administración y gestión del pago de premios.',
          'No es una apuesta, no es un juego de azar, no es el precio del premio y no se devuelve por no obtener votos ni por el resultado de la sala.',
          'No financia el premio: el premio lo abona la organización con fondos propios, con independencia de la cantidad de inscriptos.'
        ]
      },
      {
        sub: 'Forma de pago y correo',
        ul: [
          'El pago se realiza fuera de la plataforma, en Passline. TuVozTuPremio no procesa ni almacena datos de tarjetas y la transacción se rige además por los términos de Passline.',
          'El artista debe pagar en Passline con el mismo correo electrónico con el que se registró en la plataforma; de lo contrario la organización no puede identificar el pago.',
          'El comprobante queda guardado como ticket en Passline: no se solicitan capturas ni comprobantes manuales.',
          'Los cargos por conversión de moneda, impuestos o comisiones de la entidad emisora corren por cuenta del artista.'
        ]
      },
      {
        sub: 'Actualización del valor',
        ul: [
          'La organización puede modificar el valor de la inscripción en cualquier momento y a su exclusivo criterio, por razones económicas, operativas, impositivas o de tipo de cambio.',
          'El nuevo valor rige desde su publicación en la ficha de la convocatoria y solo alcanza a inscripciones posteriores.',
          'Las inscripciones ya abonadas quedan firmes y no generan derecho a reintegro, compensación ni devolución de diferencias.'
        ]
      }
    ]
  },
  {
    n: '9',
    title: 'Cupos y cierre de inscripciones',
    blocks: [
      {
        p: 'Cada sala publica un cupo máximo de participantes (por defecto, 40). Cuando el cupo de artistas con pago verificado se completa, o cuando vence la fecha de cierre publicada, la sala deja de aceptar inscripciones y pasa a la etapa de votación.'
      },
      {
        ul: [
          'El cupo se computa únicamente con las inscripciones cuyo pago fue verificado por la organización.',
          'Una inscripción pendiente de verificación no reserva cupo de forma definitiva.',
          'La organización informa en la ficha de cada sala la cantidad de participantes y el estado de la convocatoria.'
        ]
      }
    ]
  },
  {
    n: '10',
    title: 'Verificación del pago y estado de la participación',
    blocks: [
      {
        p: 'Al enviar la inscripción, la participación queda en estado pendiente de pago y el artista recibe una notificación en la plataforma. Un administrador verifica el ticket de Passline y, si el pago coincide con el correo registrado y con el importe publicado, activa la participación y publica el video en la sala de votación.'
      },
      {
        ul: [
          'Participación pendiente: pago no verificado. El video no es visible ni votable.',
          'Participación activa: pago verificado. El video aparece en la sala y puede recibir votos.',
          'Participación rechazada: el pago no pudo verificarse o incumplió estas bases, con notificación al artista.',
          'Participación descalificada: el artista fue excluido por incumplimiento de estas bases.'
        ]
      },
      {
        note: {
          tone: 'amber',
          title: 'Pago no verificable',
          text: 'Si el pago no puede verificarse (por ejemplo, por haberse realizado con otro correo o por un importe distinto al publicado), la organización no activa la participación y comunica el motivo por los canales de soporte. En ese caso se aplica la cláusula 24 sobre reembolsos.'
        }
      }
    ]
  },
  {
    n: '11',
    title: 'Video y canción: requisitos técnicos y pautas de contenido',
    blocks: [
      {
        sub: 'Formato y carga',
        ul: [
          'El video se envía mediante enlace de YouTube (opción recomendada, sin límite de tamaño) o subiéndolo como archivo a la plataforma.',
          'Formatos de archivo admitidos: MP4, MOV, AVI, WEBM y OGG. Tamaño máximo: 500 MB. Duración máxima: 10 minutos.',
          'Se debe indicar el título de la canción interpretada.',
          'Un mismo video no puede utilizarse para inscribirse en dos salas distintas.'
        ]
      },
      {
        sub: 'Contenido obligatorio',
        ul: [
          'Debe ser una interpretación musical vocal, en vivo. No se admite playback ni sincronización de labios.',
          'No debe contener lenguaje ofensivo, vulgar o inapropiado.',
          'No debe incluir contenido discriminatorio por raza, religión, género, orientación sexual o cualquier otra condición.',
          'No debe mostrar contenido sexual explícito o sugerente.',
          'No debe promover violencia, odio o actividades ilegales.'
        ]
      },
      {
        note: {
          tone: 'red',
          title: 'Incumplimiento de las pautas',
          text: 'El video que incumpla estas pautas se descalifica sin reembolso de la inscripción y, si ya estaba publicado, se retira de la sala. La organización puede solicitar la corrección del contenido antes de activar la participación.'
        }
      }
    ]
  },
  {
    n: '12',
    title: 'Derechos de autor: canciones originales y covers',
    blocks: [
      {
        p: 'El artista garantiza que el video y la interpretación que envía no infringen derechos de autor, marcas ni derechos de imagen de terceros.'
      },
      {
        sub: 'Canción original',
        ul: [
          'El artista declara ser titular de los derechos de la composición y de la interpretación.',
          'Se recomienda registrarla ante la DNDA o SADAIC e indicar en el título "Canción Original".'
        ]
      },
      {
        sub: 'Cover',
        ul: [
          'Los covers están permitidos conforme el artículo 36 de la Ley 11.723.',
          'El artista es titular de los derechos sobre su interpretación específica, no sobre la obra original.',
          'Debe dar crédito al autor original en el título, con el formato "Cover de [Canción] - [Autor Original]".'
        ]
      },
      {
        p: 'Cualquier reclamo de terceros por derechos de autor es responsabilidad exclusiva del artista, que mantendrá indemne a la organización. La organización puede retirar un video y descalificar al participante ante una denuncia verosímil, conforme al procedimiento de la política de derechos de autor publicada en el sitio.'
      }
    ]
  },
  {
    n: '13',
    title: 'Declaraciones y garantías del artista',
    blocks: [
      { p: 'Al inscribirse, el artista declara y garantiza que:' },
      {
        ul: [
          'Los datos de su perfil son verdaderos, actuales y propios, y se compromete a mantenerlos actualizados.',
          'Es mayor de 18 años y tiene capacidad legal para aceptar estas bases.',
          'El video es de su autoría interpretativa y no infringe derechos de terceros.',
          'No utilizará bots, scripts, automatizaciones, cuentas falsas ni servicios externos para obtener votos, seguidores o reproducciones.',
          'Los datos de cobro de PayPal o Binance que informa son correctos y corresponden a una cuenta válida y activa a su nombre.',
          'Cumplirá las reglas de conducta y comunidad de la cláusula 25, dentro y fuera de la plataforma.',
          'Asumirá las obligaciones fiscales que correspondan por el premio y por las estrellas ⭐ recibidas en su jurisdicción.'
        ]
      }
    ]
  },
  {
    n: '14',
    title: 'Etapas de cada sala y fechas',
    blocks: [
      { p: 'Cada sala atraviesa las siguientes etapas, informadas en la ficha de la convocatoria y en la sala de votación:' },
      {
        subl: [
          ['Inscripciones abiertas', 'se reciben inscripciones, se verifican pagos y se activan participantes hasta completar el cupo o vencer la fecha de cierre.'],
          ['En votación', 'el público vota por los participantes activos. Es la única etapa, junto con la ronda de finalistas, en la que se computan votos.'],
          ['Ronda de finalistas', 'se abre solo si hay empate en el primer lugar al cierre. Compiten únicamente los artistas empatados y se cuentan los votos emitidos desde el inicio de la ronda.'],
          ['Finalizado', 'la sala tiene un ganador proclamado, el premio fue registrado y el resultado se publica en el Salón de la Fama.']
        ]
      },
      {
        p: 'Las fechas de inicio, cierre y votación se publican en cada ficha. La organización puede ajustar la fecha de cierre de una sala por cupo completo, por fuerza mayor o por razones operativas, comunicándolo en la plataforma. La votación se cierra únicamente por decisión de la organización, cuando existen votos registrados y el resultado puede determinarse conforme a la cláusula 17.'
      }
    ]
  },
  {
    n: '15',
    title: 'Votación del público: reglas',
    blocks: [
      { p: 'El ganador de cada sala se define por votación abierta del público. No hay jurado ni valoración de la organización en el resultado.' },
      {
        ul: [
          'Votar es gratuito: los votos no se compran, no se venden y no se canjean por dinero.',
          'Puede votar cualquier persona, con cuenta registrada o como invitado, desde la sala de votación.',
          'Cada usuario registrado puede votar una sola vez por participante y por ronda. El voto es único e irreversible.',
          'Los invitados sin cuenta se identifican por la huella digital de su dispositivo: un mismo dispositivo no puede votar dos veces por el mismo participante en la misma ronda.',
          'Las cuentas con rol de artista no pueden votar, ni por sí mismas ni por otros participantes.',
          'Solo se computan los votos emitidos mientras la sala está en estado "En votación" o "Ronda de finalistas".',
          'Los votos no se reasignan, no se transfieren y no se devuelven.'
        ]
      },
      {
        p: 'La cantidad de votos obtenidos depende exclusivamente de la difusión que cada artista haga de su participación y del apoyo de su público. La organización no garantiza votos, posición ni visibilidad.'
      }
    ]
  },
  {
    n: '16',
    title: 'Sistema antifraude, auditoría y anulación de votos',
    blocks: [
      { p: 'Para proteger la legitimidad de la votación, la plataforma aplica controles técnicos automáticos y auditorías posteriores.' },
      {
        ul: [
          'Registro de la dirección IP y de la huella digital del dispositivo desde el que se vota.',
          'Bloqueo de votos duplicados por usuario, por dispositivo, por participante y por ronda.',
          'Detección de patrones anómalos, automatizaciones, bots, scripts, granjas de dispositivos y cuentas falsas.',
          'Verificación de que el votante no es una cuenta de artista.',
          'Auditoría de la votación por la organización en cualquier momento del concurso o al cierre de la sala.'
        ]
      },
      {
        p: 'La organización puede anular los votos que provengan de manipulación, automatización, suplantación o de cualquier mecanismo que altere la voluntad real del público, sin obligación de notificar previamente al participante afectado. Los votos anulados no se reasignan ni se reembolsan, y su anulación puede modificar posiciones y porcentajes.'
      },
      {
        note: {
          tone: 'purple',
          title: 'Decisión sobre validez',
          text: 'La determinación sobre la validez de los votos y la proclamación del ganador corresponde a la organización conforme a estas bases. La disconformidad con el sistema de votación pública o con la cantidad de votos obtenidos no habilita reclamo, reintegro ni acción alguna.'
        }
      }
    ]
  },
  {
    n: '17',
    title: 'Determinación del resultado y premio único',
    blocks: [
      {
        p: 'Al cierre de la votación de la sala, la organización computa los votos válidos de la ronda vigente y ordena a los participantes de mayor a menor cantidad de votos, con su porcentaje sobre el total de la sala.'
      },
      {
        ul: [
          'Si un artista obtiene la mayor cantidad de votos y no hay empate en el primer lugar, es el ganador y recibe el 100% del premio publicado de esa sala.',
          'El artista con el segundo porcentaje más alto de la sala queda registrado como finalista destacado, sin premio en efectivo.',
          'Los demás participantes quedan registrados como participantes destacados.',
          'El premio no se divide entre participantes ni se distribuye por porcentajes: se entrega íntegro a un único ganador.',
          'Para cerrar una sala debe existir al menos un voto registrado en la ronda vigente; sin votos no hay ganador ni premio.'
        ]
      }
    ]
  },
  {
    n: '18',
    title: 'Empates y ronda de finalistas',
    blocks: [
      {
        p: 'Si al cierre de la votación dos o más artistas tienen exactamente la misma cantidad de votos y encabezan la sala, no se declara ganador y no se reparte el premio: se abre una ronda de finalistas.'
      },
      {
        sub: 'Cómo funciona la ronda',
        ul: [
          'Solo compiten los artistas empatados en el primer lugar; los demás quedan descartados de esa ronda y registrados como participantes destacados.',
          'Los votos de la ronda de finalistas se cuentan desde cero: solo valen los emitidos desde el momento en que la ronda se abre, informado en la sala.',
          'Durante la ronda se muestran la cantidad de votos y el porcentaje de cada finalista.',
          'Cada usuario o dispositivo puede votar una vez por cada finalista en esta nueva ronda.',
          'El finalista que obtiene más votos que los demás gana la sala y recibe el 100% del premio.',
          'Si el empate se mantiene al cierre de la ronda, se abre una nueva ronda de desempate entre los finalistas empatados, cuantas veces sea necesario para obtener un único ganador.'
        ]
      },
      {
        note: {
          tone: 'purple',
          title: 'Ejemplo',
          text: 'Dos artistas empatan con 40 votos cada uno (28,6% de 140 votos totales). Ambos pasan a la ronda de finalistas, se reinicia el conteo solo para ellos y quien obtenga más votos en esa ronda se lleva el premio completo.'
        }
      }
    ]
  },
  {
    n: '19',
    title: 'Cancelación, suspensión y salas sin resultado',
    blocks: [
      {
        p: 'La organización puede suspender, reprogramar o cancelar una sala por razones operativas, técnicas, de fuerza mayor, por falta de participantes suficientes o por irregularidades que afecten la transparencia del concurso. La decisión se comunica en la plataforma.'
      },
      {
        ul: [
          'Si la sala se cancela antes de la verificación del pago, se reintegra el valor de la inscripción por el mismo medio de pago.',
          'Si la sala se cancela después de activada la participación, la organización puede ofrecer la reubicación en otra sala del mismo género o el reintegro, a su elección y comunicándolo por soporte.',
          'Si una sala no alcanza votos suficientes para determinar un resultado, no se proclama ganador y se resuelve conforme a la cláusula anterior.',
          'La cancelación no genera derecho a compensación distinta del reintegro del valor de la inscripción ni al pago del premio.'
        ]
      }
    ]
  },
  {
    n: '20',
    title: 'Premio: monto, pago y plazo',
    blocks: [
      {
        p: 'Cada sala publica un premio fijo en USD antes de la inscripción, visible en la ficha de la convocatoria y en la sala de votación. El monto no se calcula con la cantidad de inscriptos, con los créditos comprados ni con los regalos enviados.'
      },
      {
        sub: 'Pago',
        ul: [
          'El premio es abonado por la organización al único ganador, por transferencia directa a su cuenta de PayPal o Binance, dentro de los 10 días hábiles posteriores al cierre de la convocatoria.',
          'Los datos de cobro se cargan en la sección "Editar Perfil" de la plataforma (correo de PayPal, o correo/ID de Binance) junto con el nombre completo del titular. PayPal y Binance son los únicos medios oficiales de pago de premios.',
          'El premio no se acredita en el saldo de estrellas ⭐ del wallet, no se cobra por canje y no se paga en créditos.',
          'Las comisiones, costos de transferencia, conversión de moneda e impuestos del pago corren por cuenta del ganador.',
          'El ganador es el único responsable de la exactitud de sus datos de cobro. La organización no responde por datos erróneos, cuentas cerradas, inactivas o bloqueadas, ni por demoras, retenciones o rechazos de PayPal o Binance.',
          'El plazo de 10 días hábiles se cuenta desde la fecha de cierre publicada de la sala y puede extenderse si el ganador no cargó sus datos de cobro o si debe verificarse su identidad.'
        ]
      },
      {
        sub: 'Variaciones del premio',
        ul: [
          'El premio aplicable es el publicado al momento de la inscripción y no se reduce una vez cerrada la inscripción de esa sala.',
          'La organización puede aumentar, reducir, suspender o modificar el premio de convocatorias futuras, y también organizar salas sin premio en efectivo o con premios en especie, informándolo en cada ficha.',
          'Los cambios en convocatorias futuras no generan derecho a reclamo, compensación ni equiparación respecto de salas anteriores.'
        ]
      }
    ]
  },
  {
    n: '21',
    title: 'Beneficios adicionales del ganador',
    blocks: [
      { p: 'Además del premio en USD, el ganador de cada sala obtiene:' },
      {
        ul: [
          'La insignia de "Artista Destacado" en su perfil.',
          'La publicación permanente en el Salón de la Fama de la plataforma, con su nombre, país, género y resultado.',
          'La incorporación a la comunidad de artistas destacados y mayor visibilidad en el directorio de artistas.',
          'El registro de su logro en su panel de artista como antecedente verificable de su carrera.',
          'Una notificación oficial del resultado en la plataforma.'
        ]
      },
      {
        p: 'Estos beneficios son promocionales, no tienen valor económico en dinero y la organización puede modificarlos o discontinuarlos para convocatorias futuras.'
      }
    ]
  },
  {
    n: '22',
    title: 'Estrellas ⭐ y regalos de los fans',
    blocks: [
      {
        p: 'De forma independiente del premio del concurso, un artista puede recibir estrellas ⭐ de sus fans mediante el envío de regalos del catálogo.'
      },
      {
        ul: [
          'El fan compra créditos con dinero y los usa para enviar un regalo; el artista recibe las estrellas ⭐ indicadas para ese regalo.',
          '1 Estrella ⭐ equivale a 1 USD y se acumula en el saldo canjeable del artista.',
          'El canje se solicita desde la sección "Canjear Estrellas", con un mínimo de 1 ⭐, y se abona por PayPal o Binance a los datos del perfil.',
          'Las solicitudes de canje se procesan dentro de las 24 a 48 horas hábiles posteriores a la solicitud.',
          'Los regalos son voluntarios y no influyen en la votación, en la posición de la sala ni en el monto del premio.',
          'Las estrellas ⭐ no provienen del premio del concurso y no lo reemplazan ni lo adelantan.',
          'Los créditos usados en regalos no se reembolsan ni se convierten en estrellas ⭐ para el fan que los envía.',
          'El fan puede ver los regalos enviados y el artista los recibidos en su historial de transacciones.'
        ]
      }
    ]
  },
  {
    n: '23',
    title: 'Créditos de la plataforma',
    blocks: [
      {
        ul: [
          'Los créditos se compran con dinero, a razón de 1 crédito = 1 USD como referencia de valor.',
          'Su único destino actual es enviar regalos a artistas: la inscripción en convocatorias se abona por Passline y no se paga con créditos.',
          'No son reembolsables una vez utilizados, no se canjean por dinero y no son transferibles entre usuarios.',
          'Solo son canjeables las estrellas ⭐ recibidas por regalos.',
          'La plataforma puede anular créditos obtenidos fraudulentamente o mediante contracargos.'
        ]
      }
    ]
  },
  {
    n: '24',
    title: 'Reembolsos y derecho de arrepentimiento',
    blocks: [
      {
        p: 'La solicitud se presenta por los canales oficiales de soporte, incluido el Botón de Arrepentimiento del sitio, indicando el correo electrónico de compra y el número de orden o ticket.'
      },
      {
        sub: 'Inscripción al concurso (Passline)',
        ul: [
          'El valor de la inscripción es reembolsable únicamente si el artista solicita la baja antes de subir su video, o antes de que comience la etapa de votación pública, lo que ocurra primero.',
          'Una vez publicado el video en la sala de votación, no se admiten devoluciones.',
          'Si el pago no pudo verificarse por causas ajenas al artista, se reintegra el valor abonado.',
          'El reintegro se gestiona por Passline y se acredita por el mismo medio de pago utilizado.'
        ]
      },
      {
        sub: 'Créditos',
        ul: [
          'Solo se admite el reembolso total si el 100% de los créditos comprados permanece sin usar en la cuenta.',
          'Una vez enviado un regalo, la operación es definitiva, irreversible y no admite reembolso.',
          'El reintegro se realiza por el mismo medio de pago original y los plazos de acreditación dependen del procesador y de la entidad emisora.'
        ]
      },
      {
        note: {
          tone: 'gray',
          title: 'Límites',
          text: 'No se reembolsan inscripciones de artistas descalificados por incumplimiento de estas bases, ni importes ya devengados por el servicio prestado (publicación del video, gestión de la sala, votación y administración).'
        }
      }
    ]
  },
  {
    n: '25',
    title: 'Conducta, comunidad y exclusión del concurso',
    blocks: [
      {
        p: 'Artistas, fans y postulantes deben conducirse con respeto hacia la organización, sus responsables y colaboradores, los coaches vocales, los medios, los patrocinadores, los demás artistas y los fans, tanto dentro de la plataforma como en redes sociales y canales externos.'
      },
      {
        sub: 'Está prohibido',
        ul: [
          'Insultar, amenazar, hostigar, discriminar, difamar o acosar a cualquier persona vinculada al concurso.',
          'Realizar campañas públicas de descrédito, boicot o presión contra la organización, sus responsables, los coaches vocales, los medios o los demás participantes.',
          'Promover o participar de conductas agresivas o inapropiadas entre artistas o hacia los fans.',
          'Difundir información falsa o maliciosa sobre la plataforma o el concurso.'
        ]
      },
      {
        sub: 'Consecuencias',
        ul: [
          'El incumplimiento faculta a la organización a excluir al usuario del concurso de forma inmediata y sin previo aviso.',
          'La exclusión implica, según corresponda, la descalificación de la sala, la pérdida del premio y de los beneficios de ganador, y no da derecho a reembolso de la inscripción, de los créditos, de las estrellas ⭐ ni de ningún otro importe abonado.',
          'La organización puede retirar contenido, quitar insignias y suspender o cerrar la cuenta, sin perjuicio de las acciones legales que correspondan.',
          'La medida se aplica con independencia de que el hecho ocurra dentro o fuera de la plataforma.'
        ]
      },
      {
        p: 'Lo anterior se aplica sin perjuicio de los derechos irrenunciables que correspondan al usuario conforme la legislación de protección al consumidor aplicable, que se ejercen por los canales oficiales de soporte.'
      }
    ]
  },
  {
    n: '26',
    title: 'Prohibiciones específicas del concurso',
    blocks: [
      {
        ul: [
          'Manipular votos mediante automatización, bots, scripts, granjas de dispositivos o cuentas falsas.',
          'Crear múltiples cuentas o dispositivos artificiales para votar más de una vez.',
          'Comprar votos, seguidores o reproducciones a servicios externos.',
          'Ofrecer dinero, regalos o beneficios a cambio de votos.',
          'Suplantar la identidad de otra persona o inscribirse con datos falsos.',
          'Presentar un video que no sea de interpretación vocal propia o que infrinja derechos de autor.',
          'Intentar vulnerar la seguridad o la integridad de la plataforma, del sistema de votación o del proceso de inscripción.',
          'Comercializar, transferir o vender créditos, estrellas ⭐, cuentas o participaciones fuera de la plataforma.'
        ]
      }
    ]
  },
  {
    n: '27',
    title: 'Datos personales y confidencialidad',
    blocks: [
      {
        p: 'Los datos personales que el artista y los fans informan se tratan conforme la Ley 25.326 de Protección de Datos Personales de la República Argentina y la política de privacidad publicada en el sitio. Se utilizan para gestionar la inscripción, verificar el pago, administrar la votación, acreditar premios y estrellas ⭐, prevenir el fraude y comunicar novedades del concurso.'
      },
      {
        ul: [
          'Los datos de pago de PayPal o Binance se usan exclusivamente para abonar el premio o las estrellas ⭐ solicitadas.',
          'Los datos de tarjetas no son procesados ni almacenados por la plataforma: el cobro de la inscripción lo realiza Passline.',
          'Se registran la dirección IP y la huella digital del dispositivo como medidas antifraude.',
          'El usuario puede ejercer sus derechos de acceso, rectificación y supresión por los canales de soporte o al correo infotuvoz25@gmail.com.'
        ]
      }
    ]
  },
  {
    n: '28',
    title: 'Propiedad intelectual de la plataforma y licencia del artista',
    blocks: [
      {
        p: 'La marca TuVozTuPremio, su identidad visual, el software, los textos y el diseño de la plataforma son de titularidad de LatamBucks y no pueden utilizarse sin autorización previa y escrita.'
      },
      {
        p: 'El artista conserva la titularidad de su video y de su interpretación, y autoriza a la organización a publicarlo, reproducirlo, comunicarlo y difundirlo en la plataforma y en sus canales oficiales con el fin de desarrollar el concurso, exhibir la sala y promocionar el certamen, sin contraprestación adicional y mientras el contenido permanezca en la plataforma. Esta autorización no otorga a la organización derechos sobre la obra musical original de terceros.'
      }
    ]
  },
  {
    n: '29',
    title: 'Limitación de responsabilidad y fuerza mayor',
    blocks: [
      { p: 'La organización no responde por:' },
      {
        ul: [
          'El contenido publicado por los participantes ni por las declaraciones que realicen.',
          'Las disputas entre usuarios, ni entre artistas y fans.',
          'Las interrupciones, demoras o errores técnicos del servicio, de los proveedores de internet o de las plataformas externas (Passline, PayPal, Binance, YouTube).',
          'Los resultados de votaciones públicas legítimas ni por la cantidad de votos obtenidos.',
          'Los datos de cobro erróneos informados por el usuario ni por demoras, retenciones o bloqueos de PayPal o Binance.',
          'Las consecuencias fiscales de los premios o estrellas ⭐ percibidos.',
          'Los casos de fuerza mayor, caso fortuito, ciberataques, caídas de servicios de terceros o restricciones legales sobrevinientes.'
        ]
      }
    ]
  },
  {
    n: '30',
    title: 'Modificaciones de las bases',
    blocks: [
      {
        p: 'La organización puede modificar estas bases para convocatorias futuras o por cambios en el servicio, informándolo a través de la plataforma y por correo electrónico. La versión vigente es la publicada en esta página e identificada con su fecha.'
      },
      {
        ul: [
          'Las modificaciones rigen desde su publicación y no alcanzan a inscripciones ya abonadas, cuyas condiciones publicadas al momento del pago se mantienen.',
          'El artista debe leer la versión vigente antes de aceptar en cada inscripción.',
          'Quien no esté de acuerdo con la versión vigente puede abstenerse de inscribirse sin cargo.'
        ]
      }
    ]
  },
  {
    n: '31',
    title: 'Ley aplicable, jurisdicción y resolución de disputas',
    blocks: [
      {
        p: 'Estas bases se rigen por la legislación de la República Argentina. Las controversias se someten a los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, sin perjuicio de las normas imperativas de protección al consumidor del domicilio del usuario que resulten de aplicación.'
      },
      {
        ul: [
          'Las partes intentarán resolver cualquier disputa de buena fe mediante el sistema de soporte de la plataforma antes de iniciar acciones judiciales.',
          'El usuario puede recurrir a los organismos de Defensa del Consumidor de su jurisdicción si no obtiene respuesta por los canales internos.',
          'Las bases rigen para usuarios de la República Argentina, del resto de Latinoamérica y de cualquier otro país desde el que se acceda a la plataforma.',
          'Cada usuario es responsable de verificar que su participación sea legal en su país y de cumplir sus obligaciones fiscales, cambiarias y de consumo locales.'
        ]
      },
      {
        p: 'Si alguna cláusula resultara nula o inaplicable en alguna jurisdicción, las restantes conservarán plena vigencia y la cláusula observada se interpretará en la máxima medida permitida por la ley aplicable. Estas bases, junto con los Términos y Condiciones del sitio y la política de privacidad, constituyen el acuerdo completo entre el artista y la organización respecto del concurso.'
      }
    ]
  },
  {
    n: '32',
    title: 'Contacto y soporte',
    blocks: [
      {
        ul: [
          'Preguntas frecuentes: sección "Preguntas Frecuentes" del sitio.',
          'Tickets: sección "Soporte", con número de seguimiento y respuesta del equipo.',
          'Correo electrónico: infotuvoz25@gmail.com.',
          'Plazo máximo de respuesta a consultas legales: 5 días hábiles.'
        ]
      }
    ]
  }
];