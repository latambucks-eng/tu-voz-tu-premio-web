import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import OfficialChannelSection from '@/components/legal/OfficialChannelSection';
import LegalPlainSummary from '@/components/legal/LegalPlainSummary';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
          <p className="text-gray-600">Términos de uso del sitio, privacidad y políticas de TuVozTuPremio</p>
        </motion.div>

        <LegalPlainSummary />

        <div className="rounded-xl border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 p-5 mb-8">
          <h2 className="font-bold text-purple-900 mb-1">
            ¿Buscás las reglas del concurso?
          </h2>
          <p className="text-sm text-purple-900 mb-3">
            Las condiciones de participación —requisitos, audición, inscripción, votación, desempate, premio y pago—
            se rigen por las Bases y Condiciones del Concurso, un documento autónomo que prevalece sobre estos términos
            en todo lo relativo al concurso.
          </p>
          <Button asChild className="bg-purple-700 hover:bg-purple-800">
            <Link to={createPageUrl('Bases')}>Leer las Bases y Condiciones del Concurso</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-8 text-xs h-auto">
            <TabsTrigger value="terms">Uso del Sitio</TabsTrigger>
            <TabsTrigger value="privacy">Privacidad</TabsTrigger>
            <TabsTrigger value="dmca">DMCA</TabsTrigger>
            <TabsTrigger value="credits">Créditos</TabsTrigger>
            <TabsTrigger value="argentina">Legal AR</TabsTrigger>
            <TabsTrigger value="complete">Completo</TabsTrigger>
          </TabsList>

          {/* TÉRMINOS Y CONDICIONES DEL SITIO */}
          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Términos y Condiciones de Uso del Sitio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <p className="font-semibold text-purple-900 mb-2">
                    Estos términos rigen el sitio web. El concurso tiene reglas propias.
                  </p>
                  <p className="text-sm text-purple-900 mb-3">
                    Las condiciones de participación —requisitos, audición, inscripción, cupos, votación, sistema
                    antifraude, desempate, premio y pago— se rigen exclusivamente por las <strong>Bases y Condiciones
                    del Concurso</strong>. En caso de contradicción, las Bases prevalecen sobre estos términos en todo
                    lo relativo al concurso. Estos términos, en cambio, regulan el uso del sitio, las cuentas, los
                    créditos y estrellas ⭐, el contenido, la responsabilidad y el tratamiento de datos.
                  </p>
                  <Button asChild size="sm" className="bg-purple-700 hover:bg-purple-800">
                    <Link to={createPageUrl('Bases')}>Ver las Bases y Condiciones del Concurso</Link>
                  </Button>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">1. Titular del sitio y objeto</h3>
                  <p className="mb-2">
                    TuVozTuPremio es el nombre comercial de la plataforma digital de concursos de canto online operada
                    por <strong>LatamBucks</strong> (CUIL 27-31164952-9), con domicilio en San Fernando, Provincia de
                    Buenos Aires, República Argentina, y correo de contacto infotuvoz25@gmail.com. LatamBucks es
                    responsable de la gestión del sitio, de los cobros y del pago de los premios.
                  </p>
                  <p>
                    Estos términos regulan el acceso y uso del sitio, la creación y uso de cuentas, los servicios
                    gratuitos y pagos, el sistema de créditos y estrellas ⭐, el contenido publicado por los usuarios y
                    el tratamiento de datos personales.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">2. Aceptación y capacidad</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>El uso del sitio implica la aceptación plena de estos términos y de la política de privacidad.</li>
                    <li>Para inscribirse en una convocatoria, cobrar premios o canjear estrellas ⭐ se requiere ser mayor de 18 años y tener capacidad legal para contratar.</li>
                    <li>Los menores de 18 años pueden votar y compartir gratuitamente, pero no pueden inscribirse en convocatorias ni realizar transacciones monetarias.</li>
                    <li>La organización puede solicitar documentación de identidad para verificar edad, identidad o titularidad de la cuenta de cobro.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">3. Cuenta, roles y datos</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Cada persona debe usar una única cuenta. Está prohibido crear cuentas duplicadas, falsas o a nombre de terceros.</li>
                    <li>Los roles de <strong>artista</strong> y <strong>fan</strong> habilitan funciones distintas; el usuario es responsable de la veracidad de sus datos y de mantenerlos actualizados.</li>
                    <li>El usuario es responsable de la confidencialidad de su acceso y de toda actividad realizada desde su cuenta.</li>
                    <li>Los datos de perfil artístico (nombre, biografía, foto, país, redes) son públicos dentro de la plataforma.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">4. Servicios gratuitos y servicios pagos</h3>
                  <p className="mb-2">El sitio combina funciones gratuitas y servicios pagos claramente informados antes de cada pago:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Gratuitos:</strong> votar, compartir perfiles, ver salas, seguir artistas, consultar el Salón de la Fama y usar el sistema de soporte.</li>
                    <li><strong>Inscripción en convocatorias:</strong> se abona por Passline, plataforma de pagos de terceros, al valor publicado en cada ficha. Es la contraprestación por el mantenimiento y la gestión de la plataforma y no se paga con créditos.</li>
                    <li><strong>Créditos:</strong> se compran con dinero mediante los enlaces oficiales de PayPal publicados en la plataforma; el cobro aparece a nombre de LatamBucks.</li>
                    <li><strong>Premios:</strong> los abona la organización al ganador por PayPal o Binance, dentro de los 10 días hábiles posteriores al cierre de la sala.</li>
                    <li>Los precios se expresan en USD. Las diferencias por tipo de cambio, conversión de moneda, impuestos o cargos de la entidad emisora corren por cuenta del usuario.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">5. Créditos, estrellas ⭐ y wallet</h3>
                  <p className="mb-2">Son conceptos distintos y no equivalentes:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Créditos:</strong> saldo comprado con dinero (1 crédito = 1 USD como referencia). Se usan para enviar regalos a artistas. No son reembolsables una vez utilizados, no se canjean por dinero y no son transferibles.</li>
                    <li><strong>Estrellas ⭐:</strong> 1 ⭐ = 1 USD. Se acreditan al artista cuando un fan le envía un regalo y son el único saldo canjeable, con un mínimo de 1 ⭐ y procesamiento de 24 a 48 horas hábiles por PayPal o Binance.</li>
                    <li><strong>Premio del concurso:</strong> monto fijo en USD que la organización paga directamente al ganador. No se acredita en el wallet, no se cobra por canje y no forma parte del saldo de estrellas ⭐.</li>
                    <li>La plataforma puede anular créditos o estrellas ⭐ obtenidos fraudulentamente, mediante contracargos o en violación de estos términos.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">6. Contenido publicado por los usuarios</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>El usuario es el único responsable del contenido que publica y declara tener los derechos necesarios para hacerlo.</li>
                    <li>Al publicar, autoriza a la plataforma a mostrarlo, reproducirlo y difundirlo en el sitio y en sus canales oficiales para desarrollar el concurso y promocionar la plataforma, sin contraprestación adicional.</li>
                    <li>La plataforma puede retirar contenido que infrinja derechos de terceros, incumpla las pautas de contenido o vulnere estos términos, sin derecho a reembolso.</li>
                    <li>Los reclamos de derechos de autor se tramitan conforme a la política de derechos de autor publicada en la pestaña DMCA.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">7. Conducta y moderación</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Se exige un trato respetuoso hacia la organización, sus colaboradores, los artistas y los fans, dentro y fuera de la plataforma.</li>
                    <li>Está prohibido insultar, amenazar, hostigar, discriminar, difamar, suplantar identidades, publicar contenido ilegal o intentar vulnerar la seguridad del sitio.</li>
                    <li>El incumplimiento faculta a la organización a retirar contenido, quitar insignias, descalificar participaciones y suspender o cerrar la cuenta, sin perjuicio de las acciones legales que correspondan.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">8. Propiedad intelectual de la plataforma</h3>
                  <p>
                    La marca TuVozTuPremio, su identidad visual, el software, los textos, las bases, los diseños y las
                    bases de datos son de titularidad de LatamBucks. No se autoriza su reproducción, distribución,
                    modificación ni uso comercial sin consentimiento previo y escrito.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">9. Servicios de terceros</h3>
                  <p className="mb-2">
                    La plataforma se integra con servicios externos que tienen sus propios términos y políticas:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Passline:</strong> procesa el pago de la inscripción. No almacenamos datos de tarjetas.</li>
                    <li><strong>PayPal y Binance:</strong> procesan la compra de créditos y el pago de premios y estrellas ⭐.</li>
                    <li><strong>YouTube:</strong> aloja los videos cuando el artista elige esa opción.</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    La organización no controla ni responde por las políticas, demoras, retenciones, bloqueos o fallas
                    de esos servicios.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">10. Disponibilidad y cambios del servicio</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>El sitio se ofrece "tal como está disponible" y puede tener interrupciones por mantenimiento, fallas técnicas o causas ajenas.</li>
                    <li>La organización puede agregar, modificar o discontinuar funciones, secciones y beneficios promocionales.</li>
                    <li>La disponibilidad del sitio puede verse afectada en países alcanzados por sanciones o restricciones internacionales.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">11. Limitación de responsabilidad</h3>
                  <p className="mb-2">La organización no responde por:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>El contenido generado por los usuarios ni por sus declaraciones.</li>
                    <li>Disputas entre usuarios.</li>
                    <li>Interrupciones técnicas temporales del servicio o de servicios de terceros.</li>
                    <li>Los resultados de votaciones públicas legítimas y auditadas conforme a las Bases del Concurso.</li>
                    <li>Demoras, retenciones o bloqueos de PayPal y Binance, ni por datos de cobro erróneos informados por el usuario.</li>
                    <li>Consecuencias fiscales derivadas de premios, estrellas ⭐ o créditos.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">12. Datos personales</h3>
                  <p>
                    El tratamiento de datos se detalla en la pestaña <strong>Privacidad</strong> y se rige por la Ley
                    25.326 de Protección de Datos Personales de la República Argentina. Los datos se usan para operar la
                    plataforma, verificar pagos, administrar la votación, acreditar premios y estrellas ⭐, prevenir el
                    fraude y comunicar novedades. No se venden datos personales.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">13. Reembolsos y derecho de arrepentimiento</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>La solicitud se presenta en la sección Soporte, incluido el Botón de Arrepentimiento del pie de página, indicando el correo de compra y el número de orden o ticket.</li>
                    <li>La inscripción en convocatorias se rige por la cláusula 24 de las Bases y Condiciones del Concurso (reembolsable solo antes de subir el video o antes del inicio de la votación).</li>
                    <li>Los créditos solo se reembolsan si el 100% permanece sin usar; una vez enviado un regalo, la operación es definitiva e irreversible.</li>
                    <li>Todo reintegro aprobado se realiza por el mismo medio de pago original.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">14. Modificaciones de los términos</h3>
                  <p>
                    La organización puede modificar estos términos para reflejar cambios en el servicio, en la ley o en
                    los medios de pago. La versión vigente es la publicada en esta página. Los cambios significativos se
                    comunican a través de la plataforma y por correo electrónico. Quien no esté de acuerdo puede dejar de
                    usar el sitio; las compras ya realizadas se rigen por las condiciones publicadas al momento del pago.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">15. Ley aplicable, jurisdicción y divisibilidad</h3>
                  <p className="mb-2">
                    Estos términos se rigen por la legislación de la República Argentina y las controversias se someten
                    a los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, sin perjuicio de las normas
                    imperativas de protección al consumidor del domicilio del usuario. Previamente, las partes
                    intentarán resolver la disputa de buena fe mediante el sistema de soporte.
                  </p>
                  <p className="text-sm text-gray-600">
                    Si alguna cláusula resultara nula o inaplicable, las restantes conservarán plena vigencia.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">16. Contacto</h3>
                  <p>
                    Consultas sobre estos términos: sección <strong>Soporte</strong> (tickets con seguimiento), sección
                    <strong> Preguntas Frecuentes</strong> o correo infotuvoz25@gmail.com. Plazo máximo de respuesta a
                    consultas legales: 5 días hábiles.
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                  <p className="text-sm text-gray-600">
                    <strong>Última actualización:</strong> Noviembre 2026
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    El concurso se rige además por las Bases y Condiciones del Concurso, documento autónomo publicado en
                    esta plataforma.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POLÍTICA DE PRIVACIDAD */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Política de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Información que Recopilamos</h3>
                  <p className="mb-2">Recopilamos la siguiente información:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Datos de registro:</strong> Nombre, email, país, teléfono</li>
                    <li><strong>Perfil artístico:</strong> Nombre artístico, biografía, foto, redes sociales</li>
                    <li><strong>Contenido:</strong> Videos, audios, imágenes subidos voluntariamente</li>
                    <li><strong>Actividad:</strong> Votos, compartidos, participaciones</li>
                    <li><strong>Datos técnicos:</strong> IP, dispositivo, navegador (para seguridad anti-fraude)</li>
                    <li><strong>Datos de canje:</strong> Información necesaria para procesar canjes de Estrellas ⭐</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">2. Uso de la Información</h3>
                  <p className="mb-2">Utilizamos su información para:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Operar y mejorar la plataforma de engagement musical</li>
                    <li>Procesar participaciones en convocatorias</li>
                    <li>Distribuir Estrellas ⭐ y procesar canjes de premios</li>
                    <li>Promover perfiles de artistas en la comunidad</li>
                    <li>Enviar notificaciones relevantes sobre la plataforma</li>
                    <li>Prevenir fraude y proteger la integridad de las votaciones</li>
                    <li>Cumplir con obligaciones legales aplicables</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">3. Protección de Datos</h3>
                  <p className="mb-2">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Encriptación de datos sensibles</li>
                    <li>Acceso restringido a información personal</li>
                    <li>Servidores seguros con respaldos periódicos</li>
                    <li>Auditorías de seguridad regulares</li>
                    <li>Sistemas anti-fraude para proteger votaciones</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">4. Sus Derechos</h3>
                  <p className="mb-2">Usted tiene derecho a:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Acceder a sus datos personales</li>
                    <li>Rectificar información incorrecta</li>
                    <li>Solicitar la eliminación de su cuenta y datos</li>
                    <li>Oponerse al procesamiento de ciertos datos</li>
                    <li>Exportar sus datos en formato legible</li>
                    <li>Conocer el estado de sus Estrellas ⭐ y canjes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">5. Compartir Información</h3>
                  <p className="mb-2">
                    NO vendemos sus datos personales. Solo compartimos información con:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Procesadores y plataformas de pago (PayPal para la compra de créditos y para el pago de premios; Binance para el pago de premios)</li>
                    <li>Servicios de hosting y almacenamiento en la nube</li>
                    <li>Autoridades legales cuando sea requerido por ley</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Contacto para Privacidad:</strong> Para ejercer sus derechos o consultas sobre privacidad,
                    contacte a través de la sección de Soporte o escriba a: infotuvoz25@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POLÍTICA DMCA */}
          <TabsContent value="dmca">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Política de Derechos de Autor (DMCA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2">Protección de Propiedad Intelectual</h3>
                  <p>
                    TuVozTuPremio respeta los derechos de propiedad intelectual y espera que nuestros usuarios hagan lo mismo.
                    Cumplimos con la Digital Millennium Copyright Act (DMCA) y leyes similares de propiedad intelectual.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Responsabilidad del Usuario</h3>
                  <p className="mb-2">Al subir contenido, el usuario garantiza que:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Posee todos los derechos sobre el contenido</li>
                    <li>Ha obtenido los permisos necesarios para usar música, imágenes o videos de terceros</li>
                    <li>El contenido no infringe derechos de autor, marcas registradas u otros derechos de propiedad intelectual</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Reportar Infracción</h3>
                  <p className="mb-2">
                    Si cree que su contenido protegido por derechos de autor ha sido usado sin autorización,
                    puede presentar una notificación DMCA que debe incluir:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Identificación del material protegido por derechos de autor</li>
                    <li>Identificación del material que se alega infractor (URL específica)</li>
                    <li>Información de contacto (nombre, dirección, teléfono, email)</li>
                    <li>Declaración de buena fe</li>
                    <li>Declaración bajo pena de perjurio de que la información es precisa</li>
                    <li>Firma física o electrónica del titular de los derechos</li>
                  </ul>
                  <p className="mt-2 text-sm text-gray-600">
                    Envíe su notificación a través del sistema de reportes en la plataforma o a nuestro email de soporte: infotuvoz25@gmail.com
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Proceso de Respuesta</h3>
                  <p className="mb-2">Al recibir una notificación DMCA válida:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Revisaremos el reporte en un plazo de 48-72 horas</li>
                    <li>Eliminaremos el contenido infractor si corresponde</li>
                    <li>Notificaremos al usuario que subió el contenido</li>
                    <li>Tomaremos medidas contra cuentas reincidentes (suspensión o eliminación)</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-900">
                    <strong>Advertencia:</strong> Presentar notificaciones falsas puede resultar en responsabilidad legal.
                    Solo presente reportes si genuinamente cree que hay una infracción.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POLÍTICA DE CRÉDITOS */}
          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Política de Créditos y Estrellas ⭐
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Créditos, Premio y Estrellas ⭐</h3>
                  <p className="mb-3">
                    Son tres conceptos distintos, con origen y destino diferente:
                  </p>

                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-3">
                    <h4 className="font-bold text-purple-900 mb-2">💎 Créditos</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Se compran con dinero</li>
                      <li>1 crédito = $1 USD (referencia de valor)</li>
                      <li>Se usan para <strong>enviar regalos</strong> a un artista (la inscripción se abona aparte, por Passline)</li>
                      <li>NO se reembolsan ni se canjean por dinero</li>
                      <li>Paquetes desde $5 USD</li>
                      <li>Se visualizan como "Créditos Disponibles" en tu wallet</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-3">
                    <h4 className="font-bold text-amber-900 mb-2">🏆 Premio del Concurso (USD)</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Monto fijo en USD publicado por la organización para cada sala</li>
                      <li>Lo entrega la plataforma; no se compra ni se paga con créditos</li>
                      <li>Artista ganador: el premio completo de esa sala</li>
                      <li>Lo abona la organización por PayPal o Binance dentro de los 10 días hábiles posteriores al cierre: no pasa por el wallet ni por el canje</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-900 mb-2">
                      Estrellas Canjeables (Regalos de Fans)
                    </h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Se acreditan cuando un fan envía un regalo al artista con sus créditos</li>
                      <li>1 Estrella ⭐ = $1 USD canjeable</li>
                      <li>SÍ son canjeables por dinero</li>
                      <li>No provienen del premio del concurso: las aportan los fans</li>
                      <li>Mínimo de canje: 1 Estrella ⭐</li>
                      <li>Se visualizan en tu wallet, con su origen en el historial de transacciones</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">2. Cómo Comprar Créditos</h3>
                  <p className="mb-2">Para adquirir créditos:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Método de pago: PayPal</li>
                    <li>Realiza el pago a través del enlace oficial de PayPal del paquete elegido</li>
                    <li>Informa en la plataforma el correo electrónico o el ID de la transacción con el que pagaste (no se solicitan comprobantes ni capturas)</li>
                    <li>El cobro aparece en PayPal a nombre de LatamBucks, empresa que procesa los pagos de la plataforma</li>
                    <li>La plataforma aprueba tu pago en 24-48 horas</li>
                    <li>Los créditos se acreditan automáticamente a tu wallet</li>
                    <li>Los créditos se usan para enviar regalos a artistas (la inscripción se paga aparte, 10 USD por Passline)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">3. Cómo Ganar el Premio y las Estrellas ⭐</h3>
                  <p className="mb-2 font-semibold">Artistas - premio del concurso:</p>
                  <ul className="list-disc ml-6 space-y-1 text-sm mb-3">
                    <li>Inscríbete en una convocatoria abonando la inscripción de 10 USD por Passline</li>
                    <li>Sube tu mejor interpretación en video</li>
                    <li>Comparte tu participación en redes sociales</li>
                    <li>Recibe votos de la comunidad</li>
                    <li>Si ganas (más votado), recibes el premio fijo en USD de esa sala</li>
                    <li>Si empatas en el primer lugar, el premio no se reparte: pasas a una ronda de finalistas y quien obtenga más votos se lleva el premio completo</li>
                  </ul>

                  <p className="mb-2 font-semibold">Artistas - estrellas ⭐ por regalos:</p>
                  <ul className="list-disc ml-6 space-y-1 text-sm mb-3">
                    <li>Tus fans compran créditos y te envían regalos desde tu perfil</li>
                    <li>Cada regalo acredita las estrellas ⭐ indicadas en el catálogo</li>
                    <li>Ese aporte es independiente del premio del concurso</li>
                  </ul>

                  <p className="mb-2 font-semibold">Fans:</p>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Comparte perfiles de artistas en redes sociales</li>
                    <li>Cada compartido se registra automáticamente</li>
                    <li>Compartir es gratis y ayuda a que tu artista reciba más votos</li>
                    <li>Es completamente GRATIS - solo requiere compartir y apoyar artistas</li>
                    <li>Si además quieres apoyar con un regalo, puedes comprar créditos y enviárselo al artista</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">4. Cómo Canjear tus Estrellas ⭐</h3>
                  <p className="mb-2">Para cobrar tus estrellas ⭐ (saldo canjeable en USD):</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Mínimo: 1 Estrella ⭐ (1 USD).</strong> Puedes canjear cualquier monto a partir de ahí, hasta tu saldo disponible</li>
                    <li>Configura tu método de pago de premios en "Editar Perfil": una cuenta de <strong>PayPal</strong> (email) o de <strong>Binance</strong> (email/ID). Para cobrar necesitás una cuenta válida y activa en alguna de las dos</li>
                    <li>Ve a la sección "Canjear Estrellas"</li>
                    <li>Ingresa el monto que deseas canjear</li>
                    <li><strong>La plataforma procesa tu solicitud en 24-48 horas hábiles máximo</strong></li>
                    <li>El pago se envía a la cuenta de PayPal o Binance que configuraste</li>
                    <li>Recibes notificación cuando el canje está completado</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Conversión:</strong> 1 Estrella ⭐ = $1 USD al momento del canje
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">5. Distribución del Premio al Finalizar</h3>
                  <p className="mb-2">Cuando una convocatoria finaliza:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Se determina un único ganador por votos; si hay empate, se define en ronda de finalistas y el premio no se divide</li>
                    <li>El premio total publicado por la organización no depende de las inscripciones</li>
                    <li>El premio completo se paga por transferencia directa al ganador, a los datos de PayPal o Binance que informó en su perfil</li>
                    <li>El premio no pasa por el canje ni se acredita en el saldo canjeable del wallet</li>
                    <li>El premio se abona al ganador dentro de los 10 días hábiles posteriores al cierre de la convocatoria</li>
                    <li>Se envían notificaciones automáticas a los ganadores</li>
                    <li>Los ganadores aparecen en el Salón de la Fama</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">6. Restricciones Importantes</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Los créditos NO son reembolsables ni canjeables</li>
                    <li>Solo son canjeables las estrellas ⭐ recibidas por regalos; el premio del concurso se paga directo al ganador</li>
                    <li>Los créditos y estrellas NO son transferibles entre usuarios</li>
                    <li>NO se pueden vender fuera de la plataforma</li>
                    <li>La plataforma puede anular créditos obtenidos fraudulentamente</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">7. Responsabilidades Fiscales</h3>
                  <p>
                    Los usuarios son responsables de cumplir con las obligaciones fiscales de su jurisdicción
                    respecto a los premios recibidos. TuVozTuPremio no retiene impuestos ni emite documentación
                    fiscal, ya que operamos como plataforma de entretenimiento y engagement musical.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-sm text-green-900">
                    <strong>Transparencia Total:</strong> Todos los movimientos de créditos y Estrellas ⭐ quedan
                    registrados en tu historial de transacciones, disponible en tu panel de usuario en todo momento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LEGAL ARGENTINA */}
          <TabsContent value="argentina">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Cumplimiento Legal en Argentina
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-700">

                {/* DECLARACIÓN PRINCIPAL */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-3 text-blue-900">📋 Declaración Legal Principal</h3>
                  <p className="text-blue-900 mb-3">
                    <strong>TuVozTuPremio NO ES UN JUEGO DE AZAR ni está sujeto a regulación por la Ley 25.738 de Argentina.</strong>
                  </p>
                  <p className="text-blue-800">
                    Somos una <strong>plataforma de competencia artística basada en mérito</strong>, donde los ganadores
                    se determinan exclusivamente por votación pública legítima de usuarios reales. No hay elementos de
                    azar, sorteo aleatorio ni lotería en ningún aspecto de nuestro funcionamiento.
                  </p>
                </div>

                {/* 1. NATURALEZA DEL SERVICIO */}
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Naturaleza del Servicio</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-3"><strong>TuVozTuPremio opera como:</strong></p>
                    <ul className="list-disc ml-6 space-y-2 text-sm">
                      <li><strong>Plataforma de Engagement Musical:</strong> Servicio digital que conecta artistas con audiencias</li>
                      <li><strong>Competencia por Mérito:</strong> Los ganadores se determinan por votación pública, no por azar</li>
                      <li><strong>Sistema de Créditos:</strong> Los usuarios compran créditos (unidad virtual interna) para enviar regalos a artistas. La inscripción en convocatorias se abona aparte, por Passline</li>
                      <li><strong>Premios por Logro:</strong> Los artistas ganan un premio fijo en USD por destacarse en competencias legítimas, y la organización se lo abona de forma directa</li>
                    </ul>
                  </div>
                </div>

                {/* 2. DIFERENCIACIÓN DE JUEGOS DE AZAR */}
                <div>
                  <h3 className="font-bold text-lg mb-2">2. ¿Por Qué NO Somos Juego de Azar?</h3>
                  <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                    <p className="mb-2 font-semibold text-green-900">Según la Ley 25.738, un juego de azar requiere:</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <span className="text-xl">❌</span>
                        <div>
                          <p className="font-semibold text-gray-900">AZAR en el resultado</p>
                          <p className="text-gray-700"><strong>Nosotros:</strong> El resultado se determina 100% por votos de usuarios reales. No hay sorteos ni elementos aleatorios.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-xl">❌</span>
                        <div>
                          <p className="font-semibold text-gray-900">APUESTA de dinero</p>
                          <p className="text-gray-700"><strong>Nosotros:</strong> Los créditos se compran para enviar regalos dentro de la plataforma y la inscripción se abona por Passline. No se paga por apostar ni por un resultado: es similar a comprar entradas para un evento.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-xl">❌</span>
                        <div>
                          <p className="font-semibold text-gray-900">GANANCIA inmediata aleatoria</p>
                          <p className="text-gray-700"><strong>Nosotros:</strong> Los premios se ganan por mérito artístico demostrado públicamente y verificable.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. COMPARACIÓN CON SERVICIOS SIMILARES */}
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Comparación con Servicios Similares Legales</h3>
                  <p className="mb-3 text-sm">TuVozTuPremio es similar a servicios legalmente operantes en Argentina:</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold mb-1">🎭 Concursos de Talento (ej: La Voz Argentina, Got Talent)</p>
                      <p className="text-gray-600">Participantes pagan inscripción, el público vota, hay premios para ganadores</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold mb-1">🏆 Torneos Deportivos (ej: torneos de fútbol, tenis)</p>
                      <p className="text-gray-600">Se paga entrada, se compite por mérito, hay premios monetarios</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold mb-1">🎮 E-Sports (ej: torneos de videojuegos)</p>
                      <p className="text-gray-600">Jugadores pagan inscripción, compiten por habilidad, ganan premios</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold mb-1">📸 Concursos de Fotografía/Arte</p>
                      <p className="text-gray-600">Artistas pagan para participar, el público/jurado elige ganador, hay premios</p>
                    </div>
                  </div>
                </div>

                {/* 4. TRANSPARENCIA Y TRAZABILIDAD */}
                <div>
                  <h3 className="font-bold text-lg mb-2">4. Transparencia y Trazabilidad</h3>
                  <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
                    <p className="mb-2 font-semibold text-purple-900">Medidas de Transparencia Implementadas:</p>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-purple-800">
                      <li><strong>Votación Pública Visible:</strong> Todos pueden ver los votos de cada participante en tiempo real</li>
                      <li><strong>Sistema Anti-Fraude:</strong> Validación de votos mediante fingerprinting y IP para evitar manipulación</li>
                      <li><strong>Premio Publicado:</strong> El premio de cada convocatoria se publica antes de participar y se entrega completo al ganador de la sala. Se abona dentro de los 10 días hábiles posteriores al cierre del concurso</li>
                      <li><strong>Historial de Transacciones:</strong> Cada usuario puede ver su historial completo de créditos y premios</li>
                      <li><strong>Salón de la Fama Público:</strong> Los ganadores se publican permanentemente con fechas y montos</li>
                      <li><strong>Bases y Condiciones Claras:</strong> Todas las reglas están publicadas y disponibles antes de participar</li>
                    </ul>
                  </div>
                </div>

                {/* 5. DERECHOS DE LOS USUARIOS */}
                <div>
                  <h3 className="font-bold text-lg mb-2">5. Derechos de los Usuarios (Ley de Defensa del Consumidor 24.240)</h3>
                  <ul className="list-disc ml-6 space-y-2 text-sm">
                    <li><strong>Información Clara:</strong> Todas las condiciones están publicadas en términos sencillos antes de cualquier transacción</li>
                    <li><strong>Trato Digno:</strong> Sistema de soporte para resolver consultas y reclamos</li>
                    <li><strong>Seguridad de Datos:</strong> Cumplimos con Ley 25.326 de Protección de Datos Personales</li>
                    <li><strong>No Discriminación:</strong> Todos los usuarios tienen igualdad de oportunidades para participar y ganar</li>
                    <li><strong>Derecho a Rectificación:</strong> Los usuarios pueden corregir sus datos personales en cualquier momento</li>
                  </ul>
                </div>

                {/* 6. MODELO DE NEGOCIO */}
                <div>
                  <h3 className="font-bold text-lg mb-2">6. Modelo de Negocio y Sostenibilidad</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-3 text-sm"><strong>Ingresos de la Plataforma:</strong></p>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                      <li>Mantenimiento de servidores y infraestructura técnica</li>
                      <li>Desarrollo y mejoras continuas de la plataforma</li>
                      <li>Costos de procesamiento de pagos (PayPal, etc.)</li>
                      <li>Soporte técnico y atención al cliente</li>
                      <li>Medidas de seguridad y anti-fraude</li>
                      <li>Marketing y promoción de artistas</li>
                      <li>Cumplimiento legal y administrativo</li>
                    </ul>
                    <p className="mt-3 text-sm text-gray-600">
                      <strong>Nota:</strong> El premio de cada convocatoria es un monto fijo publicado por la organización y
                      se financia con los ingresos generales de la plataforma. No se calcula con la cantidad de inscripciones.
                      El premio publicado de cada sala se paga completo a su ganador mediante transferencia directa por
                      PayPal o Binance dentro de los 10 días hábiles posteriores al cierre, sin pasar por el saldo canjeable
                      del wallet. Las estrellas ⭐ que un artista recibe por regalos de fans son independientes de ese premio
                      y no salen del monto publicado.
                    </p>
                  </div>
                </div>

                {/* 7. ASPECTOS FISCALES */}
                <div>
                  <h3 className="font-bold text-lg mb-2">7. Responsabilidades Fiscales</h3>
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <p className="mb-2 text-sm text-yellow-900">
                      <strong>Importante:</strong> Los premios ganados por usuarios argentinos pueden estar sujetos a impuestos
                      según la legislación vigente (Ganancias, Bienes Personales, etc.).
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-yellow-800">
                      <li><strong>Responsabilidad del Usuario:</strong> Cada usuario es responsable de declarar sus ganancias ante AFIP si corresponde</li>
                      <li><strong>No Retenemos Impuestos:</strong> TuVozTuPremio NO retiene impuestos al momento del canje (similar a PayPal, Binance u otras plataformas de pago)</li>
                      <li><strong>Historial Disponible:</strong> Cada usuario tiene acceso a su historial completo para facilitar declaraciones fiscales</li>
                      <li><strong>Recomendación:</strong> Consulte con un contador para determinar obligaciones fiscales según su situación particular</li>
                    </ul>
                  </div>
                </div>

                {/* 8. RESTRICCIONES DE EDAD */}
                <div>
                  <h3 className="font-bold text-lg mb-2">8. Restricciones de Edad y Participación</h3>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li><strong>Edad Mínima:</strong> Los usuarios deben tener 18 años o más para participar en convocatorias con premios</li>
                    <li><strong>Menores de Edad:</strong> Los menores de 18 pueden votar gratuitamente, pero NO pueden inscribirse en convocatorias ni canjear premios</li>
                    <li><strong>Verificación:</strong> Nos reservamos el derecho de solicitar documentación de identidad para verificar edad</li>
                    <li><strong>Autorización Parental:</strong> Menores con autorización parental pueden participar en la comunidad, pero sin transacciones monetarias</li>
                  </ul>
                </div>

                {/* 9. RESOLUCIÓN DE DISPUTAS */}
                <div>
                  <h3 className="font-bold text-lg mb-2">9. Resolución de Disputas y Jurisdicción</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc ml-6 space-y-2 text-sm">
                      <li><strong>Mediación Interna:</strong> Primero intentamos resolver cualquier disputa mediante nuestro sistema de soporte</li>
                      <li><strong>Jurisdicción:</strong> Para usuarios argentinos, aplica la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires</li>
                      <li><strong>Usuarios de Latinoamérica y el Resto del Mundo:</strong> rigen las mismas bases y la legislación argentina, sin perjuicio de las normas imperativas de protección al consumidor de su país de residencia (ver sección 18)</li>
                      <li><strong>Ley Aplicable:</strong> Se aplica la legislación argentina vigente (Ley de Defensa del Consumidor 24.240, Código Civil y Comercial)</li>
                      <li><strong>Defensa del Consumidor:</strong> Los usuarios pueden recurrir a organismos de Defensa del Consumidor locales si no se resuelve internamente</li>
                      <li><strong>Arbitraje:</strong> Las partes pueden acordar arbitraje voluntario antes de iniciar acciones judiciales</li>
                    </ul>
                  </div>
                </div>

                {/* 10. DECLARACIÓN DE NO NECESIDAD DE LICENCIAS ESPECIALES */}
                <div>
                  <h3 className="font-bold text-lg mb-2">10. Declaración de Licencias y Permisos</h3>
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                    <p className="mb-2 text-sm text-blue-900 font-semibold">
                      TuVozTuPremio NO requiere licencias especiales de juego porque:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm text-blue-800">
                      <li>NO operamos juegos de azar (sin elementos aleatorios)</li>
                      <li>NO organizamos loterías ni sorteos</li>
                      <li>NO aceptamos apuestas</li>
                      <li>SÍ organizamos competencias legítimas basadas en mérito artístico</li>
                      <li>Operamos como plataforma de servicios digitales y engagement musical</li>
                    </ul>
                    <p className="mt-3 text-xs text-blue-700">
                      Esta plataforma opera de manera similar a otros servicios de competencia por mérito legal en Argentina,
                      como concursos de talentos, torneos deportivos, y plataformas de e-sports.
                    </p>
                  </div>
                </div>

                {/* 11. AUDITORÍA Y TRANSPARENCIA */}
                <div>
                  <h3 className="font-bold text-lg mb-2">11. Auditoría y Rendición de Cuentas</h3>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li><strong>Registros Completos:</strong> Mantenemos registros detallados de todas las transacciones y votaciones</li>
                    <li><strong>Disponibilidad para Autoridades:</strong> Colaboramos plenamente con autoridades competentes si lo requieren</li>
                    <li><strong>Transparencia de Resultados:</strong> Todos los resultados de convocatorias son públicos y verificables</li>
                    <li><strong>Sistema de Reportes:</strong> Los usuarios pueden reportar comportamientos sospechosos o irregularidades</li>
                  </ul>
                </div>

                {/* CONTACTO LEGAL */}
                <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300 mt-6">
                  <h3 className="font-bold text-lg mb-3">📧 Contacto Legal y Consultas</h3>
                  <p className="text-sm mb-2">
                    Para consultas legales, solicitudes de información o reclamos:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li><strong>Email de Soporte:</strong> infotuvoz25@gmail.com</li>
                    <li><strong>Sistema de Soporte:</strong> Disponible en la sección "Soporte" de la plataforma</li>
                    <li><strong>Tiempo de Respuesta:</strong> Respondemos consultas legales en un plazo máximo de 5 días hábiles</li>
                  </ul>
                </div>

                {/* ÚLTIMA ACTUALIZACIÓN */}
                <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                  <p className="text-sm text-gray-600">
                    <strong>Última actualización:</strong> Enero 2025
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    TuVozTuPremio se reserva el derecho de modificar estas bases legales. Los usuarios serán
                    notificados de cambios significativos con 30 días de anticipación.
                  </p>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

                    <TabsContent value="complete">
            <div className="space-y-6">

              {/* 1. INFORMACIÓN DEL TITULAR */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    1. Información del Responsable Legal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700">
                  
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-3">👤 INFORMACIÓN DEL RESPONSABLE</h4>
                    
                    <div className="bg-white rounded-lg p-4 border-2 border-blue-400">
                      <p className="font-semibold mb-3 text-blue-900">Datos del Responsable de TuVozTuPremio:</p>
                      <div className="text-sm space-y-2 font-mono bg-gray-50 p-4 rounded">
                        <p><strong>Empresa:</strong> LatamBucks</p>
                        <p><strong>Nombre comercial:</strong> TuVozTuPremio</p>
                        <p><strong>CUIL:</strong> 27-31164952-9</p>
                        <p><strong>Localidad:</strong> San Fernando, Buenos Aires, Argentina</p>
                        <p><strong>Email de Contacto:</strong> infotuvoz25@gmail.com</p>
                        <p><strong>Actividad Principal:</strong> Servicios de plataforma digital de entretenimiento musical</p>
                      </div>
                    </div>

                  </div>

                </CardContent>
              </Card>

              {/* RESTO DE SECCIONES */}
              <Card>
                <CardHeader>
                  <CardTitle>2-11. Demás Aspectos Legales y Sistema de Votación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <strong>Integridad del sistema de votación:</strong> Cada usuario o visitante puede emitir un único voto por participante y por dispositivo en cada ronda, sujeto a controles automáticos de validación técnica (huella de dispositivo, restricción de voto a artistas competidores y límite máximo de hasta tres votos por conexión IP/Wi-Fi). El detalle completo de estas reglas y las sanciones aplicables se rige por lo dispuesto en las Bases y Condiciones del Concurso (Cláusula 26).
                  </p>
                  <p className="text-sm text-gray-600">
                    Los demás aspectos legales (Derecho de Arrepentimiento, Contenido, Cancelación, Fuerza Mayor, Cookies, etc.) 
                    se mantienen según lo establecido en las pestañas &quot;Bases&quot;, &quot;Privacidad&quot;, &quot;DMCA&quot;, &quot;Créditos&quot; y &quot;Legal AR&quot;.
                  </p>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
                  </Tabs>
      </div>
    </div>
  );
}
