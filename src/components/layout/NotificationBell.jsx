import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, X, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell({ user }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // ✅ VALIDACIÓN: Solo cargar si hay usuario autenticado
    if (user && user.id) {
      loadNotifications();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        console.log('🔔 Auto-refresh notificaciones');
        loadNotifications();
      }, 30000);
      
      return () => {
        if (intervalRef.current) {
          console.log('🧹 Limpiando interval de notificaciones');
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // ✅ Si no hay usuario, limpiar notificaciones
      setNotifications([]);
      setUnreadCount(0);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [user]);

  const loadNotifications = async () => {
    // ✅ VALIDACIÓN: Verificar que el usuario esté definido y tenga ID
    if (!user || !user.id) {
      console.log('🔔 No se cargan notificaciones: usuario no autenticado');
      return;
    }
    
    try {
      const data = await base44.entities.Notification.filter(
        { user_id: user.id },
        '-created_date',
        20
      );
      
      const notifList = Array.isArray(data) ? data : [];
      setNotifications(notifList);
      
      const unread = notifList.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
      console.log('🔔 Notificaciones cargadas:', {
        total: notifList.length,
        unread: unread,
        user: user.email
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
      // ✅ No mostrar el error al usuario, solo en consola
      // Si es error de autenticación, limpiar notificaciones
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!user || !user.id) return;
    
    try {
      await base44.entities.Notification.update(notificationId, {
        is_read: true
      });
      await loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user || !user.id) return;
    
    setIsLoading(true);
    try {
      const unreadNotifs = notifications.filter(n => !n.is_read);
      for (const notif of unreadNotifs) {
        await base44.entities.Notification.update(notif.id, {
          is_read: true
        });
      }
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    await handleMarkAsRead(notification.id);
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    if (!user || !user.id) return;
    
    try {
      await base44.entities.Notification.delete(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      vote: '⭐',
      winner: '🏆',
      withdrawal_requested: '⏳',
      withdrawal_processing: '⏳',
      withdrawal_completed: '✅',
      profile_incomplete: '📝',
      contest_reminder: '🎤',
      credit_purchase: '💳'
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // ✅ Si no hay usuario autenticado, no renderizar el componente
  if (!user || !user.id) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 md:w-96 z-50"
            >
              <Card className="shadow-2xl border-2">
                <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notificaciones
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Marcar todas
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No tienes notificaciones</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="divide-y">
                        {notifications.map((notif) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notif.is_read ? 'bg-purple-50/50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl flex-shrink-0">
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className={`text-sm font-semibold ${
                                    !notif.is_read ? 'text-purple-900' : 'text-gray-900'
                                  }`}>
                                    {notif.title}
                                  </h4>
                                  {!notif.is_read && (
                                    <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {notif.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">
                                    {formatDate(notif.created_date)}
                                  </span>
                                  <div className="flex gap-1">
                                    {!notif.is_read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notif.id);
                                        }}
                                        className="h-6 px-2 text-xs"
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Marcar leída
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => handleDelete(notif.id, e)}
                                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}