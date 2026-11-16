import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Users, Trophy, Star, Heart, Zap, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            ¿Quiénes Somos?
          </h1>
          <p className="text-xl text-gray-600">
            La plataforma de engagement musical para artistas emergentes
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Music className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
                  <p className="text-lg text-purple-100">
                    TuVozTuPremio es una <strong className="text-white">plataforma digital de engagement musical</strong> dedicada 
                    a impulsar la carrera de artistas emergentes y cantantes talentosos. Conectamos artistas con audiencias 
                    globales mediante competencias de talento basadas en votación pública, ayudándoles a ganar visibilidad, 
                    construir su base de fans y obtener reconocimiento por su talento musical.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            ¿Qué Hacemos?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Aumentamos tu Visibilidad</h3>
                  <p className="text-gray-600">
                    Ayudamos a artistas a expandir su alcance en redes sociales y construir una audiencia real. 
                    Nuestra plataforma está diseñada para maximizar la exposición de tu talento ante miles de 
                    usuarios interesados en música.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Conectamos Artistas y Fans</h3>
                  <p className="text-gray-600">
                    Creamos un espacio donde artistas emergentes pueden conectar directamente con fans que aprecian 
                    su música. Los fans votan, comparten y apoyan a sus artistas favoritos, creando una comunidad 
                    musical vibrante.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Trophy className="w-12 h-12 text-yellow-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Reconocemos el Talento</h3>
                  <p className="text-gray-600">
                    Organizamos convocatorias de canto online donde el público vota por sus artistas favoritos. 
                    Los ganadores reciben el premio fijo en USD de su sala, las estrellas ⭐ que les envían sus fans
                    con regalos y el status de "Artista Destacado" en nuestra comunidad.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Heart className="w-12 h-12 text-pink-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Impulsamos Carreras Musicales</h3>
                  <p className="text-gray-600">
                    No solo ofrecemos una plataforma de competencia, sino que ayudamos a artistas a desarrollar 
                    su marca personal, aumentar seguidores reales y ganar credibilidad en la industria musical.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Cómo Funciona
          </h2>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Inscripción con Passline</h4>
                    <p className="text-gray-600">
                      La inscripción a cada convocatoria tiene un valor fijo de 10 USD y se abona con el link de
                      Passline publicado para ese evento. Passline es una plataforma de pagos de terceros: el cobro
                      se hace fuera de TuVozTuPremio y no almacenamos datos de tarjetas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Convocatorias de Talento</h4>
                    <p className="text-gray-600">
                      Organizamos competencias de canto online por género musical (Pop, Rock, Urbano, Balada). 
                      Los artistas suben sus videos y el público vota por sus favoritos. NO es un sorteo aleatorio: 
                      los ganadores se determinan por mérito y votos reales.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Reconocimiento y Premios</h4>
                    <p className="text-gray-600">
                      El artista más votado recibe el premio fijo completo de esa sala; la
                      plataforma abona ese premio dentro de los 10 días hábiles posteriores al cierre del concurso, como en
                      cualquier concurso legal. Además, el ganador se convierte en "Artista Destacado".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Comunidad y Engagement</h4>
                    <p className="text-gray-600">
                      Los fans también participan: votan gratis y, si quieren, apoyan a sus artistas con regalos.
                      Creamos un ecosistema donde todos se benefician: artistas ganan visibilidad, fans descubren talento.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Clarity */}
        <div className="mb-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-900">
                    Declaración Legal Importante
                  </h3>
                  <div className="space-y-3 text-blue-800">
                    <p>
                      <strong>TuVozTuPremio NO es un sitio de apuestas, juegos de azar ni sorteos aleatorios.</strong>
                    </p>
                    <p>
                      Somos una plataforma de entretenimiento y promoción artística donde:
                    </p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Los resultados se basan en <strong>talento artístico y votación pública legítima</strong>, no en azar</li>
                      <li>Los artistas se inscriben en las <strong>convocatorias abiertas</strong> y abonan el valor de la inscripción por <strong>Passline</strong></li>
                      <li>Los créditos son <strong>unidades virtuales internas</strong> que se usan solo para enviar regalos a artistas</li>
                      <li>El <strong>premio del concurso</strong> se paga directo al ganador por PayPal o Binance; las <strong>estrellas ⭐ de regalos</strong> se canjean desde la plataforma; los créditos no se canjean</li>
                      <li>Cumplimos con todas las regulaciones aplicables de entretenimiento digital</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Transparencia</h3>
                <p className="text-gray-600 text-sm">
                  Operamos con total transparencia. Todas las reglas, distribuciones y procesos son claros y públicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Innovación</h3>
                <p className="text-gray-600 text-sm">
                  Usamos tecnología para democratizar la industria musical y dar oportunidades a artistas emergentes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Comunidad</h3>
                <p className="text-gray-600 text-sm">
                  Creemos en el poder de la comunidad para impulsar carreras musicales y descubrir nuevos talentos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">¿Listo para Impulsar tu Carrera Musical?</h2>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Únete a cientos de artistas que ya están ganando visibilidad y construyendo su audiencia en TuVozTuPremio
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to={createPageUrl('Contests')}>
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
                    Ver Convocatorias Activas
                  </Button>
                </Link>
                <Link to={createPageUrl('Legal')}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Leer Términos Legales
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}