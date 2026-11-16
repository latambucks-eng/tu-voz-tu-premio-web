import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DMCANotice from '@/components/legal/DMCANotice';

/**
 * Ícono de atención que abre el aviso completo de derechos de autor en una ventana.
 */
export default function CopyrightNoticeButton({ className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Aviso de derechos de autor"
          aria-label="Aviso de derechos de autor"
          className={`h-8 w-8 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 ${className}`}
        >
          <AlertTriangle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aviso de contenido protegido</DialogTitle>
        </DialogHeader>
        <DMCANotice variant="full" />
      </DialogContent>
    </Dialog>
  );
}