import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Image as ImageIcon, Globe, Instagram, Facebook, Music, DollarSign, Clock, Save, Users, AlertCircle, CheckCircle, Youtube, Plus, Trash2, Album, Trophy } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    artist_name: '',
    bio: '',
    profile_image: '',
    cover_image: '',
    country: '',
    phone: '',
    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    social_youtube: '',
    social_spotify: '',
    profile_visible_in_community: false,
    musical_genre: '',
    influences: '',
    profile_videos: [],
    discography: [],
    achievements: [],
    withdrawal_method: '',
    withdrawal_account_type: '',
    withdrawal_alias_cbu: '',
    withdrawal_full_name: '',
    withdrawal_additional_info: ''
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      setFormData({
        artist_name: userData.artist_name || '',
        bio: userData.bio || '',
        profile_image: userData.profile_image || '',
        cover_image: userData.cover_image || '',
        country: userData.country || '',
        phone: userData.phone || '',
        social_instagram: userData.social_instagram || '',
        social_facebook: userData.social_facebook || '',
        social_tiktok: userData.social_tiktok || '',
        social_youtube: userData.social_youtube || '',
        social_spotify: userData.social_spotify || '',
        profile_visible_in_community: userData.profile_visible_in_community || false,
        musical_genre: userData.musical_genre || '',
        influences: userData.influences || '',
        profile_videos: userData.profile_videos || [],
        discography: userData.discography || [],
        achievements: userData.achievements || [],
        withdrawal_method: userData.withdrawal_method || '',
        withdrawal_account_type: userData.withdrawal_account_type || '',
        withdrawal_alias_cbu: userData.withdrawal_alias_cbu || '',
        withdrawal_full_name: userData.withdrawal_full_name || '',
        withdrawal_additional_info: userData.withdrawal_additional_info || ''
      });
    } catch (error) {
      console.error('Error loading user:', error);
      base44.auth.redirectToLogin(window.location.href);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor sube solo imágenes');
      return;
    }

    setIsUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, profile_image: file_url }));
      alert('✅ Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor sube solo imágenes');
      return;
    }

    setIsUploadingCover(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, cover_image: file_url }));
      alert('✅ Portada subida exitosamente');
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Error al subir portada');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const addVideo = () => {
    if (formData.profile_videos.length >= 5) {
      alert('Máximo 5 videos permitidos');
      return;
    }
    setFormData(prev => ({
      ...prev,
      profile_videos: [...prev.profile_videos, { title: '', youtube_url: '', description: '', is_featured: false }]
    }));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      profile_videos: prev.profile_videos.filter((_, i) => i !== index)
    }));
  };

  const updateVideo = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      profile_videos: prev.profile_videos.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const addAlbum = () => {
    setFormData(prev => ({
      ...prev,
      discography: [...prev.discography, { album_name: '', release_year: '', cover_image: '', spotify_link: '', youtube_link: '', description: '' }]
    }));
  };

  const removeAlbum = (index) => {
    setFormData(prev => ({
      ...prev,
      discography: prev.discography.filter((_, i) => i !== index)
    }));
  };

  const updateAlbum = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      discography: prev.discography.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: '', description: '', date: '', image_url: '' }]
    }));
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const updateAchievement = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Basic required field validations
      if (!formData.artist_name || formData.artist_name.trim().length < 2) {
        setError('❌ El Nombre Artístico es obligatorio y debe tener al menos 2 caracteres.');
        setIsSubmitting(false);
        return;
      }
      if (!formData.bio || formData.bio.trim() === '') {
        setError('❌ La Biografía es obligatoria.');
        setIsSubmitting(false);
        return;
      }
      if (!formData.profile_image || formData.profile_image.trim() === '') {
        setError('❌ La Foto de Perfil es obligatoria.');
        setIsSubmitting(false);
        return;
      }

      // Validate social media if user is an artist
      if (user?.user_type === 'artist') {
        if (formData.social_instagram && !formData.social_instagram.includes('instagram.com/')) {
          setError('❌ La URL de Instagram debe ser válida (ej: https://instagram.com/tuusuario)');
          setIsSubmitting(false);
          return;
        }

        if (formData.social_facebook && !formData.social_facebook.includes('facebook.com/')) {
          setError('❌ La URL de Facebook debe ser válida (ej: https://facebook.com/tuusuario)');
          setIsSubmitting(false);
          return;
        }

        if (formData.social_tiktok && !formData.social_tiktok.includes('tiktok.com/@')) {
          setError('❌ La URL de TikTok debe ser válida (ej: https://tiktok.com/@tuusuario)');
          setIsSubmitting(false);
          return;
        }

        // For artists, at least one social network is mandatory
        const hasSocial = formData.social_instagram || formData.social_facebook || formData.social_tiktok || formData.social_youtube || formData.social_spotify;
        if (!hasSocial) {
          setError('❌ Como artista, debes proporcionar al menos una red social (Instagram, Facebook, TikTok, YouTube o Spotify) para completar tu perfil.');
          setIsSubmitting(false);
          return;
        }
      }

      // Validations for withdrawal method if selected
      if (formData.withdrawal_method && formData.withdrawal_method !== '') {
        if (!formData.withdrawal_alias_cbu || formData.withdrawal_alias_cbu.trim() === '') {
          setError('❌ Si seleccionas un método de retiro, debes proporcionar un Alias o CBU en USD.');
          setIsSubmitting(false);
          return;
        }
        if (!formData.withdrawal_full_name || formData.withdrawal_full_name.trim() === '') {
          setError('❌ Si seleccionas un método de retiro, debes proporcionar tu Nombre Completo (titular de la cuenta).');
          setIsSubmitting(false);
          return;
        }
        if (formData.withdrawal_alias_cbu.trim().length < 3) {
          setError('❌ Por favor ingresa tu email de PayPal o tu ID de Binance (mínimo 3 caracteres).');
          setIsSubmitting(false);
          return;
        }
      }

      // Process YouTube videos to extract video ID
      const processedVideos = formData.profile_videos.map(v => {
        if (v.youtube_url) {
          // Regular expression to extract YouTube video ID from various URL formats
          const match = v.youtube_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|)([a-zA-Z0-9_-]{11})|(?:youtu\.be\/|)([a-zA-Z0-9_-]{11}))/);
          return {
            ...v,
            youtube_video_id: match ? (match[1] || match[2]) : '' // take first or second group
          };
        }
        return v;
      });

      await base44.auth.updateMe({
        ...formData,
        profile_videos: processedVideos // Send processed videos
      });

      setSuccess(true);

      setTimeout(() => {
        navigate(createPageUrl(user?.user_type === 'artist' ? 'ArtistDashboard' : 'FanDashboard'));
      }, 2000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSocialLinks = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="social_instagram" className="flex items-center gap-2">
          <Instagram className="w-5 h-5 text-gray-500" /> Instagram
        </Label>
        <Input
          id="social_instagram"
          value={formData.social_instagram}
          onChange={handleChange}
          placeholder="https://instagram.com/tuusuario"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_facebook" className="flex items-center gap-2">
          <Facebook className="w-5 h-5 text-gray-500" /> Facebook
        </Label>
        <Input
          id="social_facebook"
          value={formData.social_facebook}
          onChange={handleChange}
          placeholder="https://facebook.com/tuusuario"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_tiktok" className="flex items-center gap-2">
          <Music className="w-5 h-5 text-gray-500" /> TikTok
        </Label>
        <Input
          id="social_tiktok"
          value={formData.social_tiktok}
          onChange={handleChange}
          placeholder="https://tiktok.com/@tuusuario"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_youtube" className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-gray-500" />
          Canal de YouTube
        </Label>
        <Input
          id="social_youtube"
          placeholder="https://youtube.com/channel/..."
          value={formData.social_youtube}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_spotify" className="flex items-center gap-2">
          <Music className="w-5 h-5 text-gray-500" />
          Perfil de Spotify
        </Label>
        <Input
          id="social_spotify"
          placeholder="https://open.spotify.com/artist/..."
          value={formData.social_spotify}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Perfil</h1>
          <p className="text-gray-600">Completa tu información para destacar en la plataforma</p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>✅ Perfil actualizado exitosamente.</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="artist_name">Nombre Artístico *</Label>
                    <Input
                      id="artist_name"
                      value={formData.artist_name}
                      onChange={handleChange}
                      placeholder="Tu nombre artístico"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Este es tu nombre público en la plataforma</p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografía *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre ti y tu música..."
                      rows={4}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Describe tu estilo musical y trayectoria</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="musical_genre">Género Musical</Label>
                      <Input
                        id="musical_genre"
                        value={formData.musical_genre}
                        onChange={handleChange}
                        placeholder="Pop, Rock, Urbano, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Tu país"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="influences">Influencias Musicales</Label>
                    <Input
                      id="influences"
                      value={formData.influences}
                      onChange={handleChange}
                      placeholder="Artistas que te inspiran..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono (Opcional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+54 11 1234 5678"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo para contacto administrativo, no se mostrará públicamente</p>
                  </div>
                </div>
              </div>

              {/* Foto de Perfil y Portada */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Imágenes del Perfil *
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Foto de Perfil *</Label>
                    {formData.profile_image && (
                      <div className="mb-4">
                        <img
                          src={formData.profile_image}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-200"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage && <p className="text-sm text-gray-500 mt-2">Subiendo imagen...</p>}
                    <p className="text-xs text-gray-500 mt-1">Tu foto será tu carta de presentación</p>
                  </div>

                  <div>
                    <Label>Imagen de Portada</Label>
                    {formData.cover_image && (
                      <div className="mb-4">
                        <img
                          src={formData.cover_image}
                          alt="Portada"
                          className="w-full h-32 rounded-lg object-cover border-2 border-purple-200"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                    />
                    {isUploadingCover && <p className="text-sm text-gray-500 mt-2">Subiendo portada...</p>}
                    <p className="text-xs text-gray-500 mt-1">Imagen grande que aparecerá en la parte superior de tu perfil</p>
                  </div>
                </div>
              </div>

              {/* Videos del Perfil */}
              {user?.user_type === 'artist' && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Youtube className="w-5 h-5" />
                      Videos del Perfil (Máximo 5)
                    </h3>
                    <Button
                      type="button"
                      onClick={addVideo}
                      variant="outline"
                      size="sm"
                      disabled={formData.profile_videos.length >= 5}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Video
                    </Button>
                  </div>

                  {formData.profile_videos.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <Youtube className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-4">No has agregado videos a tu perfil</p>
                      <Button type="button" onClick={addVideo} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Primer Video
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.profile_videos.map((video, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold">Video {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVideo(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <Input
                                placeholder="Título del video"
                                value={video.title}
                                onChange={(e) => updateVideo(index, 'title', e.target.value)}
                              />
                              <Input
                                placeholder="URL de YouTube (ej: https://youtube.com/watch?v=...)"
                                value={video.youtube_url}
                                onChange={(e) => updateVideo(index, 'youtube_url', e.target.value)}
                              />
                              <Textarea
                                placeholder="Descripción del video (opcional)"
                                value={video.description}
                                onChange={(e) => updateVideo(index, 'description', e.target.value)}
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Los videos de tu perfil se mostrarán en tu página de artista para que los fans conozcan más de tu música
                  </p>
                </div>
              )}

              {/* Discografía */}
              {user?.user_type === 'artist' && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Album className="w-5 h-5" />
                      Discografía
                    </h3>
                    <Button
                      type="button"
                      onClick={addAlbum}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Álbum/Single
                    </Button>
                  </div>

                  {formData.discography.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <Album className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-4">No has agregado discografía</p>
                      <Button type="button" onClick={addAlbum} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Primer Álbum
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.discography.map((album, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold">Álbum/Single {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAlbum(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <Input
                                placeholder="Nombre del álbum"
                                value={album.album_name}
                                onChange={(e) => updateAlbum(index, 'album_name', e.target.value)}
                              />
                              <Input
                                placeholder="Año de lanzamiento"
                                value={album.release_year}
                                onChange={(e) => updateAlbum(index, 'release_year', e.target.value)}
                              />
                              <Input
                                placeholder="URL portada (opcional)"
                                value={album.cover_image}
                                onChange={(e) => updateAlbum(index, 'cover_image', e.target.value)}
                              />
                              <Input
                                placeholder="Link de Spotify (opcional)"
                                value={album.spotify_link}
                                onChange={(e) => updateAlbum(index, 'spotify_link', e.target.value)}
                              />
                            </div>
                            <Textarea
                              className="mt-3"
                              placeholder="Descripción del álbum (opcional)"
                              value={album.description}
                              onChange={(e) => updateAlbum(index, 'description', e.target.value)}
                              rows={2}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Logros */}
              {user?.user_type === 'artist' && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Logros y Reconocimientos
                    </h3>
                    <Button
                      type="button"
                      onClick={addAchievement}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Logro
                    </Button>
                  </div>

                  {formData.achievements.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-4">No has agregado logros</p>
                      <Button type="button" onClick={addAchievement} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Primer Logro
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.achievements.map((achievement, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold">Logro {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAchievement(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <Input
                                placeholder="Título del logro"
                                value={achievement.title}
                                onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                              />
                              <Textarea
                                placeholder="Descripción del logro"
                                value={achievement.description}
                                onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                                rows={2}
                              />
                              <div className="grid md:grid-cols-2 gap-3">
                                <Input
                                  type="date"
                                  value={achievement.date}
                                  onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                                />
                                <Input
                                  placeholder="URL imagen (opcional)"
                                  value={achievement.image_url}
                                  onChange={(e) => updateAchievement(index, 'image_url', e.target.value)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Redes Sociales */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Redes Sociales {user?.user_type === 'artist' ? '(Obligatorio)' : '(Opcional)'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  💡 <strong>Recomendado:</strong> Agregar tus redes sociales aumenta tu credibilidad y ayuda a los fans a conectar contigo.
                  {user?.user_type === 'artist' && <span className="font-bold text-red-600"> Como artista, al menos una red social es obligatoria.</span>}
                </p>
                {renderSocialLinks()}
              </div>

              {/* Visibilidad en Comunidad (Solo Artistas) */}
              {user?.user_type === 'artist' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Visibilidad en Comunidad
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-900 mb-3">
                      <strong>💡 Perfil Público:</strong> Si activas esta opción, tu perfil aparecerá en la sección "Comunidad" para que todos te conozcan, te sigan y compartan tu música.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="profile_visible_in_community"
                        checked={formData.profile_visible_in_community}
                        onChange={(e) => setFormData({...formData, profile_visible_in_community: e.target.checked})}
                        className="w-5 h-5 text-purple-600"
                      />
                      <Label htmlFor="profile_visible_in_community" className="font-semibold text-gray-900 cursor-pointer">
                        Hacer mi perfil visible en la Comunidad
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-8">
                      {formData.profile_visible_in_community
                        ? '✅ Tu perfil será visible para todos en la sección Comunidad'
                        : '🔒 Tu perfil solo será visible cuando participes en convocatorias'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Métodos de Retiro */}
              <Card className="border-t pt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Datos de Pago para Cobrar mi Premio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>💰 Cómo cobrás:</strong> con estos datos la organización te transfiere el premio. Se paga dentro de los 10 días hábiles posteriores al cierre del concurso.
                    </p>
                    <ul className="text-xs text-blue-800 ml-4 list-disc space-y-1">
                      <li><strong>Medios:</strong> solo PayPal o Binance, con una cuenta activa a tu nombre</li>
                      <li><strong>Comisiones:</strong> las paga quien recibe el dinero</li>
                      <li><strong>Revisá bien:</strong> no nos hacemos cargo de cuentas mal informadas ni de demoras de PayPal/Binance</li>
                      <li><strong>Cambios:</strong> los medios de pago disponibles pueden variar</li>
                    </ul>
                  </div>

                  <div>
                    <Label htmlFor="withdrawal_method">Método de Pago</Label>
                    <select
                      id="withdrawal_method"
                      value={formData.withdrawal_method || ''}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          withdrawal_method: newValue,
                          withdrawal_account_type: newValue,
                          withdrawal_alias_cbu: newValue === '' ? '' : prev.withdrawal_alias_cbu,
                          withdrawal_full_name: newValue === '' ? '' : prev.withdrawal_full_name,
                          withdrawal_additional_info: newValue === '' ? '' : prev.withdrawal_additional_info
                        }));
                      }}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">-- Sin configurar --</option>
                      <option value="paypal">PayPal</option>
                      <option value="binance">Binance</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona cómo quieres recibir tus premios
                    </p>
                  </div>

                  {formData.withdrawal_method && formData.withdrawal_method !== '' && (
                    <>
                      <div>
                        <Label htmlFor="withdrawal_full_name">
                          Nombre Completo del Titular *
                        </Label>
                        <Input
                          id="withdrawal_full_name"
                          type="text"
                          value={formData.withdrawal_full_name || ''}
                          onChange={handleChange}
                          placeholder="Nombre completo como aparece en tu cuenta"
                          className="mt-1"
                          required={formData.withdrawal_method !== ''}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Debe coincidir con tu identificación oficial
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="withdrawal_alias_cbu">
                          {formData.withdrawal_method === 'binance' ? 'Email o ID de Binance (Pay ID) *' : 'Email de tu cuenta de PayPal *'}
                        </Label>
                        <Input
                          id="withdrawal_alias_cbu"
                          type="text"
                          value={formData.withdrawal_alias_cbu || ''}
                          onChange={handleChange}
                          placeholder={
                            formData.withdrawal_method === 'binance'
                              ? 'Tu email o ID de Binance (Pay ID)'
                              : 'Email de tu cuenta de PayPal'
                          }
                          className="mt-1"
                          required={formData.withdrawal_method !== ''}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.withdrawal_method === 'binance'
                            ? 'El premio se envía a esta cuenta de Binance'
                            : 'El premio se envía a esta cuenta de PayPal'
                          }
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="withdrawal_additional_info">
                          Información Adicional (Opcional)
                        </Label>
                        <Textarea
                          id="withdrawal_additional_info"
                          value={formData.withdrawal_additional_info || ''}
                          onChange={handleChange}
                          placeholder="Titular de la cuenta, red de Binance (TRC20/ERC20) u otra información (opcional)"
                          rows={2}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Cualquier información adicional que ayude a procesar el pago de tu premio
                        </p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-yellow-900">
                            <p className="font-semibold mb-1">⏱️ Pago de premios:</p>
                            <ul className="list-disc ml-4 space-y-0.5">
                              <li><strong>Plazo:</strong> dentro de los 10 días hábiles posteriores al cierre del concurso</li>
                              <li><strong>Costos de procesamiento:</strong> a cargo del usuario</li>
                              <li><strong>Datos:</strong> verificá que tu cuenta de PayPal o Binance sea correcta y esté activa</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl(user?.user_type === 'artist' ? 'ArtistDashboard' : 'FanDashboard'))}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}