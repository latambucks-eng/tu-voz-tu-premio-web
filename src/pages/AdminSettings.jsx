import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Percent, Clock } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-600" />
            Configuración
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajustes Generales</CardTitle>
          <CardDescription>
            Esta sección está en desarrollo. Aquí podrás configurar parámetros clave de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                <Settings className="w-16 h-16 mx-auto text-gray-300 mb-4 animate-spin" style={{ animationDuration: '5s' }} />
                <h3 className="text-xl font-semibold text-gray-700">Próximamente...</h3>
                <p className="text-gray-500 mt-2">Podrás ajustar variables importantes de la plataforma.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Percent className="w-6 h-6 text-indigo-500"/>
                            <p className="font-semibold text-gray-800">Comisiones de la Plataforma</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-orange-500"/>
                            <p className="font-semibold text-gray-800">Tiempos de Votación</p>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}