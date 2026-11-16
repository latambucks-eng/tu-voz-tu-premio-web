
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DMCANotice({ variant = 'full' }) {
  if (variant === 'compact') {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs">
          🔒 Contenido protegido por derechos de autor. Uso no autorizado está prohibido por ley.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
        <Scale className="h-5 w-5 text-blue-700" />
        <AlertTitle className="text-blue-900 font-bold text-base mb-3">
          ⚖️ Aviso Legal - Protección de Derechos de Autor
        </AlertTitle>
        <AlertDescription className="text-blue-800 space-y-3">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">
              Este contenido está protegido bajo las siguientes leyes argentinas e internacionales:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Ley 11.723 de Propiedad Intelectual</strong> - República Argentina</li>
              <li><strong>Código Penal Argentino (Art. 71 a 73)</strong> - Delitos contra la propiedad intelectual</li>
              <li><strong>Ley 25.036</strong> - Protección de obras audiovisuales</li>
              <li><strong>Convención de Berna</strong> - Tratado Internacional ratificado por Argentina</li>
              <li><strong>DNDA (Dirección Nacional del Derecho de Autor)</strong> - Organismo de aplicación</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300">
            <p className="font-semibold text-yellow-900 mb-2">📌 IMPORTANTE - Diferencia entre Obras Originales y Covers:</p>
            <div className="text-xs space-y-2 text-yellow-800">
              <div>
                <p className="font-semibold">🎵 OBRAS ORIGINALES (Composiciones propias):</p>
                <ul className="list-disc list-inside pl-4 mt-1">
                  <li>El artista es titular completo de los derechos de autor</li>
                  <li>Protección automática desde el momento de la creación</li>
                  <li>Control total sobre reproducción, distribución y uso</li>
                  <li>Se recomienda registro en DNDA o SADAIC</li>
                  <li>Cualquier uso no autorizado constituye violación de derechos de autor</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">🎤 COVERS (Versiones de canciones existentes):</p>
                <ul className="list-disc list-inside pl-4 mt-1">
                  <li>La canción original pertenece a su autor/compositor original</li>
                  <li>La INTERPRETACIÓN del cover tiene protección como obra derivada</li>
                  <li>Permitido bajo "derecho de interpretación pública" (Art. 36, Ley 11.723)</li>
                  <li>El artista del cover protege SU INTERPRETACIÓN, no la composición</li>
                  <li>Necesario dar crédito al autor original</li>
                  <li>No se puede impedir que otros hagan covers de la misma canción</li>
                  <li>La voz, estilo y arreglos del cover están protegidos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Consecuencias legales del uso no autorizado en Argentina:
            </p>
            <ul className="text-xs space-y-1 pl-6 list-disc">
              <li><strong>Sanciones penales:</strong> Prisión de 1 mes a 6 años (Art. 72, Ley 11.723)</li>
              <li><strong>Multas económicas:</strong> Indemnización por daños y perjuicios</li>
              <li><strong>Secuestro de material:</strong> Confiscación de copias no autorizadas</li>
              <li><strong>Responsabilidad civil:</strong> Pago de daños materiales y morales</li>
              <li><strong>Costas judiciales:</strong> Honorarios de abogados y gastos del proceso</li>
              <li><strong>Antecedentes penales:</strong> Registro permanente en caso de condena</li>
              <li><strong>Eliminación de contenido:</strong> Orden judicial de remoción inmediata</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-300">
            <p className="font-semibold text-green-900 mb-2">✅ QUÉ ESTÁ PROTEGIDO en TuVozTuPremio:</p>
            <ul className="text-xs space-y-1 pl-6 list-disc text-green-800">
              <li><strong>Para obras originales:</strong> Toda la composición, letra, melodía y grabación</li>
              <li><strong>Para covers:</strong> La interpretación vocal específica, arreglos únicos, estilo personal</li>
              <li><strong>Videos:</strong> La grabación audiovisual completa (interpretación + producción)</li>
              <li><strong>Imagen:</strong> Fotografías, arte visual, diseño del perfil</li>
              <li><strong>Contenido escrito:</strong> Biografía, descripciones, textos personales</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-300">
            <p className="font-semibold text-green-900 mb-2">✅ Uso Permitido (sin necesidad de autorización):</p>
            <ul className="text-xs space-y-1 pl-6 list-disc text-green-800">
              <li>Compartir enlaces oficiales de la plataforma TuVozTuPremio</li>
              <li>Votar y apoyar a los artistas dentro de la plataforma</li>
              <li>Comentar de forma respetuosa en la plataforma</li>
              <li>Uso personal y privado sin distribución pública</li>
              <li>Hacer tu propio cover de una canción (no copiar la interpretación de otro)</li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-3 border border-red-300">
            <p className="font-semibold text-red-900 mb-2">❌ Uso Prohibido (requiere autorización expresa del artista):</p>
            <ul className="text-xs space-y-1 pl-6 list-disc text-red-800">
              <li>Descargar, copiar o redistribuir videos/fotos/audios</li>
              <li>Republicar el video o audio en otras plataformas (YouTube, TikTok, Instagram, etc.)</li>
              <li>Usar la INTERPRETACIÓN específica del artista sin permiso</li>
              <li>Editar, modificar, recortar o transformar el contenido</li>
              <li>Usar para fines comerciales o publicitarios</li>
              <li>Crear compilaciones, remixes o trabajos derivados</li>
              <li>Usar para entrenar inteligencia artificial</li>
              <li>Suplantar identidad del artista</li>
              <li>Reproducción pública en locales, eventos o medios</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-300">
            <p className="font-semibold text-purple-900 mb-2">📋 Recomendaciones para Artistas:</p>
            <div className="text-xs space-y-2 text-purple-800">
              <p className="font-semibold">Si subes OBRAS ORIGINALES:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Considera registrarlas en DNDA: www.jus.gob.ar/dnda</li>
                <li>Puedes registrarlas en SADAIC si son musicales</li>
                <li>Guarda copias con fecha verificable (email a ti mismo, etc.)</li>
              </ul>
              <p className="font-semibold mt-2">Si subes COVERS:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Indica claramente "Cover de [Canción] - [Autor Original]"</li>
                <li>Tu interpretación está protegida, pero no la composición original</li>
                <li>Puedes reportar si alguien copia tu versión específica</li>
                <li>No necesitas permiso para hacer el cover en Argentina</li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-blue-700 font-medium bg-white/60 p-2 rounded">
            📧 Para denunciar infracciones o uso indebido: <strong>infotuvoz25@gmail.com</strong>
            <br/>
            Puedes usar el botón "Reportar Abuso" disponible en cada perfil de artista.
          </p>

          <p className="text-xs text-gray-600 italic">
            * Este aviso se basa en la legislación argentina vigente (Ley 11.723 y modificatorias). 
            Para consultas legales específicas, consulte con un abogado especializado en propiedad intelectual y derecho de autor.
          </p>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
