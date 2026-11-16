import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Plus, Pencil, Trash2, History, EyeOff } from 'lucide-react';
import EditionWinnerForm from '@/components/admin/EditionWinnerForm';

export default function AdminEditionWinners() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.EditionWinner.list('order');
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading edition winners:', error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`¿Eliminar a "${record.name}" del historial?`)) return;
    await base44.entities.EditionWinner.delete(record.id);
    loadRecords();
  };

  const openNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-7 h-7 text-amber-500" />
            Historial de Convocatorias Pasadas
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Ganadores y participantes destacados que se muestran en la sección Ganadores.
          </p>
        </div>
        <Button onClick={openNew} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Agregar artista
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-14 h-14 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-4">Todavía no hay artistas en el historial.</p>
            <Button onClick={openNew}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar el primero
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.id} className={record.is_active === false ? 'opacity-60' : ''}>
              <CardContent className="p-4 flex items-center gap-4">
                {record.image ? (
                  <img
                    src={record.image}
                    alt={record.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold flex items-center justify-center shrink-0">
                    {record.name?.[0] || '?'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{record.name}</p>
                    <Badge className={record.badge === 'GANADOR/A' ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 text-gray-700'}>
                      {record.badge}
                    </Badge>
                    {record.is_active === false && (
                      <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Oculto
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {record.edition}
                    {record.edition_date ? ` (${record.edition_date.split('-').reverse().join('/')})` : ''} ·{' '}
                    {record.country || 'Sin país'} · {record.percentage || 0}%
                    {record.votes ? ` · ${record.votes} votos` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(record)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(record)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditionWinnerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        record={editing}
        onSaved={loadRecords}
      />
    </div>
  );
}