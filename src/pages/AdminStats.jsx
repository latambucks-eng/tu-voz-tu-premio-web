import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Users, DollarSign, Trophy } from 'lucide-react';

export default function AdminStats() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart className="w-8 h-8 text-purple-600" />
            Estadísticas
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de la Plataforma</CardTitle>
          <CardDescription>
            Esta sección está en desarrollo. Próximamente aquí podrás ver gráficos y KPIs sobre el crecimiento y uso de TuVozTuPremio.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                <BarChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">Próximamente...</h3>
                <p className="text-gray-500 mt-2">Estamos trabajando en un panel de estadísticas completo para ti.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-500"/>
                            <p className="font-semibold text-gray-800">Usuarios Registrados</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-green-500"/>
                            <p className="font-semibold text-gray-800">Ingresos Totales</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-yellow-500"/>
                            <p className="font-semibold text-gray-800">Concursos Finalizados</p>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}