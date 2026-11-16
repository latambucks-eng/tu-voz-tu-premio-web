import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BASES_VERSION, basesHighlights, basesSections } from '@/data/basesConcurso';

const tones = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-900',
  amber: 'bg-amber-50 border-amber-300 text-amber-900',
  red: 'bg-red-50 border-red-300 text-red-900',
  gray: 'bg-gray-50 border-gray-200 text-gray-700'
};

function Block({ block }) {
  if (block.p) {
    return <p className="text-sm text-gray-700 leading-relaxed mb-3">{block.p}</p>;
  }

  if (block.subl) {
    return (
      <dl className="space-y-2 mb-3">
        {block.subl.map(([term, text]) => (
          <div key={term} className="text-sm leading-relaxed">
            <dt className="inline font-semibold text-gray-900">{term}: </dt>
            <dd className="inline text-gray-700">{text}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (block.sub) {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-900 mb-2">{block.sub}</h4>
        {block.ul && (
          <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700 leading-relaxed">
            {block.ul.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        )}
      </div>
    );
  }

  if (block.ul) {
    return (
      <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700 leading-relaxed mb-3">
        {block.ul.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  }

  if (block.note) {
    return (
      <div className={`rounded-lg border p-3 mb-3 ${tones[block.note.tone] || tones.gray}`}>
        <p className="text-xs font-bold mb-1">{block.note.title}</p>
        <p className="text-xs leading-relaxed">{block.note.text}</p>
      </div>
    );
  }

  return null;
}

export default function Bases() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to={createPageUrl('Contests')}>Volver a Convocatorias</Link>
          </Button>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bases y Condiciones del Concurso</h1>
            <p className="text-purple-100 text-sm">
              Reglas que rigen la participación en las convocatorias de canto online de TuVozTuPremio.
            </p>
            <p className="text-purple-200 text-xs mt-3">
              {BASES_VERSION} · Organiza LatamBucks · Última actualización: Noviembre 2026
            </p>
          </div>
          <CardContent className="p-6">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 mb-5">
              <p className="text-sm font-bold text-purple-900 mb-2">
                Lectura y aceptación obligatorias en la inscripción
              </p>
              <p className="text-sm text-purple-900 leading-relaxed">
                Estas bases deben leerse antes de enviar la inscripción. En el último paso del formulario el artista
                debe marcar la casilla de aceptación: hasta que no la marque, el botón de envío permanece
                deshabilitado. La aceptación queda registrada con fecha, correo, usuario, IP y el pago de Passline
                asociado.
              </p>
            </div>

            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Puntos esenciales</h2>
            <ul className="space-y-2">
              {basesHighlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-5 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to={createPageUrl('Legal')}>Términos y Condiciones del sitio</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to={createPageUrl('Support')}>Consultar por soporte</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {basesSections.map((section) => (
            <Card key={section.n} id={`clausula-${section.n}`}>
              <CardContent className="p-6">
                <h3 className="flex items-baseline gap-2 text-base sm:text-lg font-bold text-gray-900 mb-3">
                  <span className="text-purple-600">{section.n}.</span>
                  {section.title}
                </h3>
                {section.blocks.map((block, i) => <Block key={i} block={block} />)}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-700 mb-4">
              Al inscribirte aceptás estas Bases y Condiciones del Concurso, los Términos y Condiciones del sitio y
              la política de privacidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Link to={createPageUrl('Contests')}>Ver convocatorias abiertas</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={createPageUrl('FAQ')}>Preguntas frecuentes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          TuVozTuPremio es el nombre comercial de la plataforma operada por LatamBucks · infotuvoz25@gmail.com
        </p>
      </div>
    </div>
  );
}