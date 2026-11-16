
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Flag, AlertTriangle } from 'lucide-react';
import { executeRecaptcha } from '../utils/recaptcha';
import { validateText, sanitizeText } from '../utils/validation';

export default function ReportButton({ 
  contentType, 
  contentId, 
  reportedUserId = null,
  variant = 'button',
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para reportar contenido');
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    const descValidation = validateText(description, 10, 1000, 'Descripción');
    if (!descValidation.valid) {
      alert(descValidation.error);
      return;
    }

    if (!reason) {
      alert('Por favor selecciona un motivo para el reporte');
      return;
    }

    setIsSubmitting(true);

    try {
      let recaptchaToken = null;
      
      try {
        recaptchaToken = await executeRecaptcha('report_content');
      } catch (recaptchaError) {
        console.warn('⚠️ reCAPTCHA no disponible:', recaptchaError);
      }
      
      if (!recaptchaToken) {
        console.warn('⚠️ Reportando sin verificación reCAPTCHA');
      }

      let uploadedEvidenceUrl = evidenceUrl;

      if (evidenceFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: evidenceFile });
        uploadedEvidenceUrl = file_url;
      }

      await base44.entities.ContentReport.create({
        reporter_id: user.id,
        reporter_name: user.full_name || user.email,
        reported_content_type: contentType,
        reported_content_id: contentId,
        reported_user_id: reportedUserId,
        reason: reason,
        description: sanitizeText(description),
        evidence_url: uploadedEvidenceUrl || '',
        status: 'pending'
      });

      alert('✅ Reporte enviado exitosamente. Nuestro equipo lo revisará en 24-48 horas.');
      setIsOpen(false);
      setReason('');
      setDescription('');
      setEvidenceFile(null);
      setEvidenceUrl('');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error al enviar el reporte. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerButton = variant === 'icon' ? (
    <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className={className}>
      <Flag className="w-4 h-4 text-red-600" />
    </Button>
  ) : (
    <Button variant="outline" onClick={() => setIsOpen(true)} className={`text-red-600 border-red-300 hover:bg-red-50 ${className}`}>
      <Flag className="w-4 h-4 mr-2" />
      Reportar Abuso
    </Button>
  );

  return (
    <>
      {triggerButton}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Reportar Contenido
            </DialogTitle>
            <DialogDescription>
              Usa este formulario para reportar contenido inapropiado o que infrinja derechos de autor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="reason">Motivo del Reporte *</Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copyright_infringement">Infracción de Derechos de Autor</SelectItem>
                  <SelectItem value="inappropriate_content">Contenido Inapropiado</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Acoso</SelectItem>
                  <SelectItem value="fake_profile">Perfil Falso</SelectItem>
                  <SelectItem value="external_theft">Robo de Contenido Externo</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Descripción Detallada * (mínimo 10 caracteres)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe detalladamente el problema..."
                rows={4}
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/1000 caracteres
              </p>
            </div>

            <div>
              <Label htmlFor="evidence">Evidencia (opcional)</Label>
              <div className="space-y-2">
                <Input
                  id="evidence"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEvidenceFile(e.target.files[0])}
                />
                <p className="text-xs text-gray-500">O proporciona un enlace:</p>
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/evidencia"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                ⚠️ <strong>Importante:</strong> Los reportes falsos o malintencionados pueden resultar en la suspensión de tu cuenta.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
