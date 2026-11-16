
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Instagram, Facebook, Loader2 } from 'lucide-react';

export default function ArtistProfileForm({ onComplete }) {
  const [formData, setFormData] = useState({
    artist_name: '',
    bio: '',
    profile_image: '',
    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    phone: '',
    country: ''
  });
  // errors state is removed as per the outline's validation approach using alerts
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading
  const [uploadingImage, setUploadingImage] = useState(false);
  const [user, setUser] = useState(null); // Keep user state if needed elsewhere, though not used in the outline

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData); // Keep setting user data
        if (userData.artist_name || userData.bio || userData.profile_image) { // Check if there's existing data indicating a profile
          setFormData({
            artist_name: userData.artist_name || '',
            bio: userData.bio || '',
            profile_image: userData.profile_image || '',
            country: userData.country || '',
            phone: userData.phone || '', // Puede ser vacío
            social_instagram: userData.social_instagram || '',
            social_facebook: userData.social_facebook || '',
            social_tiktok: userData.social_tiktok || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor sube solo imágenes');
      e.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen no puede pesar más de 5MB');
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, profile_image: file_url }));
      // Removed setErrors call
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Por favor, intenta de nuevo.');
    }
    setUploadingImage(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Removed setErrors call
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validaciones
    if (!formData.artist_name || formData.artist_name.trim().length < 2) {
      alert('Por favor ingresa tu nombre artístico (mínimo 2 caracteres)');
      setIsSubmitting(false);
      return;
    }

    if (!formData.bio || formData.bio.trim().length < 20) {
      alert('Por favor escribe una biografía más detallada (mínimo 20 caracteres)');
      setIsSubmitting(false);
      return;
    }

    if (!formData.profile_image) {
      alert('Por favor sube una foto de perfil');
      setIsSubmitting(false);
      return;
    }

    if (!formData.country) {
      alert('Por favor selecciona tu país');
      setIsSubmitting(false);
      return;
    }

    // Validar redes sociales - al menos una
    const hasSocial = formData.social_instagram || formData.social_facebook || formData.social_tiktok;
    if (!hasSocial) {
      alert('Por favor agrega al menos una red social (Instagram, Facebook o TikTok)');
      setIsSubmitting(false);
      return;
    }

    // Validar formato de URLs de redes sociales
    if (formData.social_instagram && !formData.social_instagram.includes('instagram.com')) {
      alert('La URL de Instagram debe ser válida (ej: https://instagram.com/tuusuario)');
      setIsSubmitting(false);
      return;
    }

    if (formData.social_facebook && !formData.social_facebook.includes('facebook.com')) {
      alert('La URL de Facebook debe ser válida');
      setIsSubmitting(false);
      return;
    }

    if (formData.social_tiktok && !formData.social_tiktok.includes('tiktok.com')) {
      alert('La URL de TikTok debe ser válida');
      setIsSubmitting(false);
      return;
    }

    try {
      await base44.auth.updateMe({
        artist_name: formData.artist_name.trim(),
        bio: formData.bio.trim(),
        profile_image: formData.profile_image,
        country: formData.country,
        phone: formData.phone || '', // Permitir vacío
        social_instagram: formData.social_instagram,
        social_facebook: formData.social_facebook,
        social_tiktok: formData.social_tiktok,
        user_type: 'artist' // Ensure user_type is set
      });

      console.log('✅ Perfil actualizado exitosamente');
      onComplete(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al guardar el perfil. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Perfil de Artista</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Completa todos los campos para finalizar tu perfil de artista.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                {formData.profile_image ? (
                  <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-white" />
                )}
              </div>
              <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100">
                <Camera className="w-5 h-5 text-gray-700" />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              {uploadingImage && <p className="text-sm text-center text-gray-500 mt-2">Subiendo...</p>}
            </div>
          </div>
          {/* errors.profile_image section removed */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="artist_name">Nombre Artístico</Label>
              <Input
                id="artist_name"
                value={formData.artist_name}
                onChange={(e) => handleInputChange('artist_name', e.target.value)}
                maxLength={50}
                required
                // className={errors.artist_name ? 'border-red-500' : ''} // Removed error class
              />
              {/* errors.artist_name section removed */}
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                maxLength={56}
                placeholder="Ej: España" // Changed placeholder as country is now required
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Cuéntanos sobre ti, tu música, tu estilo..."
              rows={4}
              maxLength={500}
              // className={errors.bio ? 'border-red-500' : ''} // Removed error class
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 caracteres</p>
            {/* errors.bio section removed */}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono (Opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              maxLength={20}
              placeholder="Opcional"
            />
            <p className="text-xs text-gray-500 mt-1">Solo para contacto administrativo</p>
          </div>

          <div className="space-y-3">
            <Label>Redes Sociales (Al menos una requerida)</Label> {/* Updated label */}
            <p className="text-xs text-gray-600 mb-2">
              💡 Agrega tus redes para mayor credibilidad y conexión con tus fans
            </p>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-600 flex-shrink-0" />
              <Input
                placeholder="https://instagram.com/tuusuario" // Updated placeholder for clarity
                value={formData.social_instagram}
                onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                maxLength={100}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <Input
                placeholder="https://facebook.com/tupagina" // Updated placeholder for clarity
                value={formData.social_facebook}
                onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                maxLength={200}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.10-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.40-.67.41-1.06.10-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <Input
                placeholder="https://tiktok.com/@tuusuario" // Updated placeholder for clarity
                value={formData.social_tiktok}
                onChange={(e) => handleInputChange('social_tiktok', e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isSubmitting || uploadingImage}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
