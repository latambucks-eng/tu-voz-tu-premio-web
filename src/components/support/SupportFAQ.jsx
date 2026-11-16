import React from 'react';
import { faqs } from '@/pages/FAQ';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { HelpCircle, Ticket } from 'lucide-react';

export default function SupportFAQ({ onOpenTicket }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Preguntas Frecuentes</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Respuestas cortas sobre convocatorias, votación, premios, créditos y Estrellas ⭐.
        </p>

        <div className="space-y-6">
          {faqs.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold text-purple-900 mb-1">{category.category}</h3>
              <Accordion type="multiple" className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`${category.category}-${index}`}>
                    <AccordionTrigger className="text-left text-gray-900">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {onOpenTicket && (
          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-5 text-center">
            <p className="font-semibold text-purple-900 mb-1">¿No encontrás tu respuesta?</p>
            <p className="text-sm text-gray-600 mb-4">Abrí un ticket de consulta y el equipo te responde desde la plataforma.</p>
            <Button onClick={onOpenTicket} className="bg-purple-600 hover:bg-purple-700">
              <Ticket className="w-4 h-4 mr-2" />
              Abrir ticket de consulta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}