import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';

const EMPTY = {
  edition: '',
  edition_date: '',
  name: '',
  country: '',
  country_code: '',
  image: '',
  votes: '',
  percentage: 0,
  badge: 'PARTICIPANTE DESTACADO',
  order: 0,
  is_active: true,
};

export default function EditionWinnerForm({ open, onOpenChange, record, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) setForm(record ? { ...EMPTY, ...record } : EMPTY);
  }, [open, record]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setField('image', file_url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        edition: form.edition.trim(),
        edition_date: form.edition_date || '',
        name: form.name.trim(),
        country: form.country.trim(),
        country_code: form.country_code.trim().toLowerCase(),
        image: form.image,
        votes: form.votes,
        percentage: Number(form.percentage) || 0,
        badge: form.badge,
        order: Number(form.order) || 0,
        is_active: form.is_active,
      };

      if (record) {
        await base44.entities.EditionWinner.update(record.id, payload);
      } else {
        await base44.entities.EditionWinner.create(payload);
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving edition winner:', error);
      alert('❌ No se pudo guardar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{record ? 'Editar ganador del historial' : 'Agregar ganador al historial'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Edición *</Label>
            <Input
              value={form.edition}
              onChange={(e) => setField('edition', e.target.value)}
              placeholder="Ej: Edición Tu Voz Tu Premio Latinoamérica"
              required
            />
          </div>

          <div>
            <Label>Fecha de la convocatoria</Label>
            <Input
              type="date"
              value={form.edition_date || ''}
              onChange={(e) => setField('edition_date', e.target.value)}
            />
          </div>

          <div>
            <Label>Nombre del artista *</Label>
            <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>País</Label>
              <Input value={form.country} onChange={(e) => setField('country', e.target.value)} placeholder="Ej: Colombia" />
            </div>
            <div>
              <Label>Código de bandera</Label>
              <Input
                value={form.country_code}
                onChange={(e) => setField('country_code', e.target.value)}
                placeholder="co"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <Label>Foto</Label>
            <div className="flex items-center gap-3 mt-1">
              {form.image && (
                <img src={form.image} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100" />
              )}
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Subiendo...' : 'Subir foto'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
            <Input
              value={form.image}
              onChange={(e) => setField('image', e.target.value)}
              placeholder="o pega una URL de imagen"
              className="mt-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Votos (texto)</Label>
              <Input value={form.votes} onChange={(e) => setField('votes', e.target.value)} placeholder="27.5K" />
            </div>
            <div>
              <Label>Porcentaje del total</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.percentage}
                onChange={(e) => setField('percentage', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Distinción</Label>
              <Select value={form.badge} onValueChange={(v) => setField('badge', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GANADOR/A">Ganador/a</SelectItem>
                  <SelectItem value="PARTICIPANTE DESTACADO">Participante destacado</SelectItem>
                  <SelectItem value="FINALISTA">Finalista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Orden</Label>
              <Input type="number" value={form.order} onChange={(e) => setField('order', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="text-sm font-medium">Visible en el historial público</p>
              <p className="text-xs text-gray-500">Si lo desactivas, no se muestra en Ganadores.</p>
            </div>
            <Switch checked={form.is_active} onCheckedChange={(v) => setField('is_active', v)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || isUploading} className="bg-gradient-to-r from-purple-600 to-pink-600">
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}