import React from 'react';

export default function OfficialChannelSection() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">17. Canal Oficial, Comunicaciones y Aceptación de las Bases</h3>
      <p className="mb-3">
        El concurso y todos sus contenidos <strong>comienzan y terminan en esta plataforma</strong>. Esta
        sección define el único medio oficial de comunicación y gestión, y la obligación de leer las bases
        antes de participar.
      </p>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
        <p className="font-semibold text-purple-900 mb-2">Canal oficial único</p>
        <ul className="list-disc ml-6 space-y-1 text-sm">
          <li>El <strong>único medio oficial</strong> es esta plataforma y sus canales de contacto publicados: la sección <strong>Soporte</strong> dentro de la plataforma y el correo oficial <strong>infotuvoz25@gmail.com</strong>.</li>
          <li><strong>No existen otros canales privados ni otros sitios</strong> para participar, inscribirse, votar, difundir el concurso, enviar regalos, canjear premios o consultar: ninguna persona, grupo de mensajería, cuenta de redes sociales, gestor, representante, sponsor o sitio de terceros está autorizado a hacerlo en nombre de TuVozTuPremio.</li>
          <li>Cualquier gestión, cobro, promesa de cupo, de votos o de premios realizada por fuera de los canales oficiales es <strong>por cuenta y riesgo del usuario</strong>, no compromete a la organización y no genera derecho a reclamo, reintegro ni compensación.</li>
          <li>Toda comunicación que ofrezca bases, cupos, premios, votos, descuentos o cobros por canales distintos de los oficiales debe considerarse <strong>no oficial</strong> y denunciarse por Soporte. La organización nunca solicita pagos, claves ni datos de tarjeta por mensaje privado.</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
        <p className="font-semibold text-blue-900 mb-2">Comunicaciones de la organización</p>
        <ul className="list-disc ml-6 space-y-1 text-sm text-blue-900">
          <li>Las <strong>bases y condiciones</strong>, la información de audiciones y convocatorias, los resultados, los canjes y el pago de premios se envían y se gestionan <strong>exclusivamente a través de la plataforma y de los datos de contacto que el usuario proporcionó al registrarse</strong> (correo electrónico y teléfono).</li>
          <li>La organización puede contactar al usuario por correo electrónico o por los datos proporcionados para enviarle las bases, información del concurso o novedades sobre premios. Esa comunicación <strong>siempre se completa y se gestiona dentro de la plataforma</strong>.</li>
          <li>Es responsabilidad del usuario mantener sus datos de contacto actualizados en su perfil: las notificaciones enviadas a los datos registrados se consideran válidas y eficaces.</li>
          <li>Todas las consultas, dudas, reclamos y solicitudes —incluidos reembolsos y canjes— se atienden <strong>online y por escrito</strong>, únicamente por la sección Soporte o por el correo oficial. <strong>No se brinda atención personalizada por canales privados, fuera de la plataforma ni de forma presencial</strong>, y la respuesta se ajusta a lo publicado en estas bases.</li>
        </ul>
      </div>

      <div className="bg-red-50 border border-red-300 rounded-lg p-4">
        <p className="font-semibold text-red-900 mb-2">Lectura y aceptación previa de las bases</p>
        <ul className="list-disc ml-6 space-y-1 text-sm text-red-900">
          <li>Es <strong>obligatorio leer las Bases y Condiciones antes de participar</strong>. La participación (inscripción, audición, voto, compra de créditos o envío de regalos) implica la <strong>aceptación plena</strong> de las bases vigentes publicadas en la plataforma.</li>
          <li>Al participar, el usuario declara haber leído y aceptado las bases, el valor de la inscripción y su forma de pago, la instancia previa de audición y selección, el sistema de votación pública, la distribución del premio y la política de reembolsos.</li>
          <li><strong>No se admiten reclamos, pedidos de excepción ni consultas basados en el desconocimiento de las bases</strong> ni en condiciones informadas por canales no oficiales.</li>
          <li>La versión aplicable es la publicada en la plataforma al momento de participar; el registro electrónico de la aceptación (fecha, correo, IP y comprobante de pago) constituye prueba de esa aceptación.</li>
        </ul>
      </div>
    </div>
  );
}