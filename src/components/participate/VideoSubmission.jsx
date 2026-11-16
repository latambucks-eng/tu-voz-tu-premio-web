
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Youtube, Upload, Video, Info, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VideoSubmission({ onSubmit, isSubmitting }) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Renamed from 'uploading'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('youtube'); // New state for active tab

  // Helper to extract YouTube video ID
  const extractVideoId = (url) => {
    if (!url) return '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  // New helper function to get video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = function() {
        reject(new Error('Error al cargar video'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Handler for YouTube URL input changes
  const handleYouTubeUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(''); // Clear uploaded video URL if user switches to YouTube
    setYoutubeUrl(url);

    if (url && url.trim() !== '') {
      const id = extractVideoId(url);
      setYoutubeVideoId(id);
      // Detailed YouTube URL validation and alert moved to handleYouTubeSubmit
    } else {
      setYoutubeVideoId('');
    }
  };

  // New function for submitting YouTube video data
  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl) {
      alert('Por favor ingresa la URL de YouTube');
      return;
    }

    // Validar formato YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = youtubeUrl.match(youtubeRegex);

    if (!match) {
      alert('❌ URL de YouTube inválida\n\nFormatos válidos:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID');
      return;
    }

    const videoId = match[1];

    if (!songTitle || songTitle.trim().length < 2) {
      alert('Por favor ingresa el título de la canción');
      return;
    }

    console.log('✅ Video de YouTube validado:', {
      videoId,
      url: youtubeUrl,
      songTitle
    });

    onSubmit({
      youtube_url: youtubeUrl,
      youtube_video_id: videoId,
      video_url: '', // Ensure video_url is empty for YouTube submissions
      song_title: songTitle.trim()
    });
  };

  // Handler for file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('❌ Formato de video no válido\n\nFormatos permitidos:\n• MP4\n• MOV\n• AVI\n• WEBM\n• OGG');
      e.target.value = ''; // Clear file input
      return;
    }

    // Validar tamaño (máximo 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      alert('❌ El video es demasiado grande\n\nTamaño máximo: 500MB\nTu archivo: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
      e.target.value = ''; // Clear file input
      return;
    }

    // Validar duración (máximo 10 minutos)
    try {
      const videoDuration = await getVideoDuration(file);
      const maxDuration = 10 * 60; // 10 minutos en segundos

      if (videoDuration > maxDuration) {
        alert(`❌ El video es demasiado largo\n\nDuración máxima: 10 minutos\nTu video: ${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}`);
        e.target.value = ''; // Clear file input
        return;
      }

      console.log('✅ Duración validada:', Math.floor(videoDuration / 60) + ':' + Math.floor(videoDuration % 60).toString().padStart(2, '0'));
    } catch (durationError) {
      console.warn('⚠️ No se pudo validar duración:', durationError);
      // Continuar sin validación de duración si hay un error en el navegador
    }

    // Reset potential YouTube input if file upload is initiated
    setYoutubeUrl('');
    setYoutubeVideoId('');

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      console.log('📤 Subiendo video:', {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        type: file.type
      });

      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setVideoUrl(file_url); // Set the videoUrl state here

      console.log('✅ Video subido exitosamente:', file_url);

      // Submit immediately if song title is already provided
      if (!songTitle || songTitle.trim().length < 2) {
        alert('Por favor ingresa el título de la canción antes de continuar');
        setIsUploading(false); // Reset upload state if title is missing for immediate submit
        // Don't clear videoUrl here, it's uploaded, just not fully submitted.
        return;
      }

      // If songTitle is present, proceed with submission
      setTimeout(() => {
        onSubmit({
          youtube_url: '',
          youtube_video_id: '',
          video_url: file_url,
          song_title: songTitle.trim()
        });
      }, 500);

    } catch (error) {
      console.error('❌ Error uploading video:', error);
      alert('Error al subir el video. Por favor, intenta con un archivo más pequeño o usa YouTube.');
      // Clear file input on error
      e.target.value = '';
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Determine if the main submit button should be enabled
  const canSubmit = (
    (activeTab === 'youtube' && youtubeVideoId && songTitle.trim().length >= 2 && !isUploading) ||
    (activeTab === 'upload' && videoUrl && songTitle.trim().length >= 2 && !isUploading)
  ) && !isSubmitting;


  // The form's onSubmit handler is now replaced by conditional logic on the button's onClick
  // This allows direct calls to handleYouTubeSubmit or a final submission for uploaded files.

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-6 h-6 text-purple-600" />
          Sube tu Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* The form tag's onSubmit is removed, as the button handles submission logic now */}
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold mb-2">
              Pautas de Contenido
            </AlertTitle>
            <AlertDescription className="text-blue-800 text-sm space-y-2">
              <p className="font-medium">
                Para mantener un ambiente respetuoso y profesional, tu video debe cumplir con las siguientes normas:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Debe ser una interpretación musical vocal (en vivo, no playback)</li>
                <li>No debe contener lenguaje ofensivo, vulgar o inapropiado</li>
                <li>No debe incluir contenido discriminatorio (racial, religioso, de género, orientación sexual, etc.)</li>
                <li>No debe mostrar contenido sexual explícito o sugerente</li>
                <li>No debe promover violencia, odio o actividades ilegales</li>
                <li>Debe respetar los derechos de autor (covers permitidos)</li>
              </ul>
              <p className="text-xs mt-3 font-medium text-blue-900">
                ⚠️ Los videos que incumplan estas normas serán descalificados sin reembolso. Gracias por contribuir a una comunidad positiva.
              </p>
            </AlertDescription>
          </Alert>

          <Alert className="bg-purple-50 border-purple-200">
            <Info className="h-5 w-5 text-purple-600" />
            <AlertTitle className="text-purple-900 font-semibold mb-2">
              🎵 ¿Subes una canción original o un cover?
            </AlertTitle>
            <AlertDescription className="text-purple-800 text-sm space-y-2">
              <div>
                <p className="font-semibold">📝 Si es una CANCIÓN ORIGINAL (tuya):</p>
                <ul className="list-disc list-inside pl-4 text-xs mt-1">
                  <li>Tienes derechos completos de autor sobre la composición y la interpretación</li>
                  <li>Tu contenido está protegido automáticamente por ley</li>
                  <li>Se recomienda registrarla en DNDA o SADAIC para mayor protección</li>
                  <li>Indica en el título: "Canción Original"</li>
                </ul>
              </div>
              <div className="mt-2">
                <p className="font-semibold">🎤 Si es un COVER (versión de canción existente):</p>
                <ul className="list-disc list-inside pl-4 text-xs mt-1">
                  <li>Los covers están permitidos bajo la ley argentina (Art. 36, Ley 11.723)</li>
                  <li>Tienes derechos sobre TU INTERPRETACIÓN específica</li>
                  <li>Debes dar crédito al autor original</li>
                  <li>Indica en el título: "Cover de [Canción] - [Autor Original]"</li>
                  <li>Ejemplo: "Cover de Bohemian Rhapsody - Queen"</li>
                </ul>
              </div>
              <p className="text-xs mt-2 text-purple-700 font-medium">
                💡 En ambos casos, tu grabación y video están protegidos contra copia o uso no autorizado.
              </p>
            </AlertDescription>
          </Alert>

          {/* Error Alert removed as per outline's use of browser 'alert' */}

          <Tabs defaultValue="youtube" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="youtube"><Youtube className="w-4 h-4 mr-2" /> YouTube (Recomendado)</TabsTrigger>
              <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2" /> Subir Archivo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="youtube" className="pt-4">
              <Label htmlFor="youtube_url">URL del Video de YouTube * (Recomendado)</Label>
              <Input
                id="youtube_url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={handleYouTubeUrlChange}
                disabled={isSubmitting || isUploading || (videoUrl && videoUrl !== '')}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 YouTube es la opción recomendada - sin límite de tamaño
              </p>
              {youtubeVideoId && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Video de YouTube detectado correctamente
                </p>
              )}
              {videoUrl && (
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Ya subiste un archivo. Borra el archivo primero para usar YouTube.
                </p>
              )}
            </TabsContent>

            <TabsContent value="upload" className="pt-4">
              <Label htmlFor="video_upload">Archivo de Video * (Máx. 500MB)</Label>
              <Input
                id="video_upload"
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                onChange={handleFileUpload}
                disabled={isUploading || isSubmitting || (youtubeUrl && youtubeUrl !== '')}
                className="mt-2"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-blue-800">
                  💡 <strong>Consejos:</strong><br/>
                  • Tamaño máximo: 500MB<br/>
                  • Duración máxima: 10 minutos<br/>
                  • Si tu video es muy grande, puedes usar YouTube<br/>
                  • Asegúrate de tener buena conexión WiFi
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formatos: MP4, WebM, OGG, MOV, AVI
              </p>
              {isUploading && (
                <div className="mt-3">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-600 mt-1">Subiendo... {uploadProgress}%</p>
                </div>
              )}
              {videoUrl && !isUploading && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  Video subido con éxito
                </p>
              )}
              {youtubeUrl && (
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Ya pegaste un enlace de YouTube. Borra el enlace primero para subir archivo.
                </p>
              )}
            </TabsContent>
          </Tabs>

          <div>
            <Label htmlFor="song_title">Título de la Canción *</Label>
            <Input
              id="song_title"
              type="text"
              placeholder="Nombre de la canción que interpretaste"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              disabled={isSubmitting || isUploading}
              required
              maxLength={100}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Indica si es original o cover (ej: "Mi Canción Original" o "Cover de Bohemian Rhapsody - Queen")
            </p>
          </div>

          {(youtubeVideoId || videoUrl) && (
            <div className="space-y-2">
              <Label>Vista Previa del Video</Label>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                {youtubeVideoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : null}
              </div>
            </div>
          )}

          <Alert className="bg-green-50 border-green-200">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              Al continuar, confirmas que has leído y aceptas nuestras pautas de contenido, y que tu video cumple con todas las normas establecidas. 
              {' '}<strong>Si es un cover, asegúrate de dar crédito al autor original en el título.</strong>
            </AlertDescription>
          </Alert>

          <Button
            type="button" // Changed to type="button" to handle submission logic via onClick
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={!canSubmit}
            onClick={() => {
              if (activeTab === 'youtube') {
                handleYouTubeSubmit();
              } else if (activeTab === 'upload') {
                // This branch is mainly for when a file was uploaded successfully but
                // the songTitle was missing at the time, preventing immediate submission.
                // Now that songTitle is hopefully filled, we can proceed.
                if (videoUrl && songTitle.trim().length >= 2) {
                  onSubmit({
                    youtube_url: '',
                    youtube_video_id: '',
                    video_url: videoUrl,
                    song_title: songTitle.trim()
                  });
                } else {
                  alert('Por favor, asegúrate de haber subido un video y de haber ingresado el título de la canción.');
                }
              }
            }}
          >
            {isSubmitting ? 'Procesando inscripción...' : isUploading ? 'Subiendo video...' : 'Continuar al Paso 3 - Pago'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
