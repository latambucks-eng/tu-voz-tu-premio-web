import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Trophy, Upload, Crown, Home as HomeIcon, Coins, Star, Flag, Users, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import AppFooter from '@/components/layout/AppFooter';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import NotificationBell from '@/components/layout/NotificationBell';
import WelcomeTour from '@/components/onboarding/WelcomeTour';
import Logo from '@/components/brand/Logo';
import Icon3D from '@/components/brand/Icon3D';

export default function Layout({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const scrollContainerRef = React.useRef(null);

  React.useEffect(() => {
    loadUser();
    loadRecaptcha();
  }, [location]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const loadUser = async () => {
    setIsLoadingUser(true);
    
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      try {
        const hasSeenTour = localStorage.getItem(`tour_completed_${userData.id}`);
        if (!hasSeenTour && !location.pathname.includes('select-role') && !location.pathname.includes('edit-profile')) {
          setShowWelcomeTour(true);
        }
      } catch (storageError) {
        console.warn('⚠️ No se pudo verificar tour (storage bloqueado):', storageError);
        setShowWelcomeTour(false);
      }
    } catch (error) {
      console.log('ℹ️ Usuario no autenticado');
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const loadRecaptcha = async () => {
    try {
      const { loadRecaptchaScript, hideRecaptchaBadge } = await import('@/components/utils/recaptcha');
      await loadRecaptchaScript();
      hideRecaptchaBadge();
    } catch (error) {
      console.warn('⚠️ No se pudo cargar reCAPTCHA:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      setUser(null);
      
      if (user?.id) {
        try {
          localStorage.removeItem(`tour_completed_${user.id}`);
        } catch (storageError) {
          console.warn('⚠️ No se pudo limpiar tour (storage bloqueado):', storageError);
        }
      }
      
      window.location.href = createPageUrl('Home');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      
      try {
        localStorage.clear();
      } catch (storageError) {
        console.warn('⚠️ No se pudo limpiar storage (bloqueado):', storageError);
      }
      
      window.location.href = createPageUrl('Home');
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  let navigationItems = [
    { title: 'Inicio', url: createPageUrl('Home'), icon: HomeIcon },
    { title: 'Convocatorias', url: createPageUrl('Contests'), icon: Trophy },
    { title: 'Sala de Votación', url: createPageUrl('VotingRoom'), icon: Star },
    { title: 'Comunidad', url: createPageUrl('Community'), icon: Users },
    { title: 'Ganadores', url: createPageUrl('Winners'), icon: Crown },
    { title: 'Soporte', url: createPageUrl('Support'), icon: MessageCircle },
  ];

  if (user) {
    if (user.role === 'admin') {
      navigationItems.push(
        { title: 'Participa', url: createPageUrl('Participate'), icon: Upload },
        { title: 'Comprar Créditos', url: createPageUrl('BuyCredits'), icon: Coins },
        { title: 'Canjear Estrellas', url: createPageUrl('Withdraw'), icon: Star },
        { title: 'Moderación', url: createPageUrl('ModerationDashboard'), icon: Flag }
      );
    } else if (user.user_type === 'artist') {
      navigationItems.push(
        { title: 'Participa', url: createPageUrl('Participate'), icon: Upload },
        { title: 'Canjear Estrellas', url: createPageUrl('Withdraw'), icon: Star }
      );
    } else if (user.user_type === 'fan') {
      navigationItems.push(
        { title: 'Comprar Créditos', url: createPageUrl('BuyCredits'), icon: Coins }
      );
    }
  }

  const getUserRoleDisplay = (user) => {
    if (!user) return '';
    if (user.role === 'admin') return 'Administrador';
    if (user.user_type === 'artist') return 'Artista';
    if (user.user_type === 'fan') return 'Fan';
    return '';
  };

  const isHome = location.pathname === createPageUrl('Home') || location.pathname === '/';

  if (isHome) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider>
      {showWelcomeTour && user && (
        <WelcomeTour 
          user={user} 
          onComplete={() => {
            setShowWelcomeTour(false);
            try {
              localStorage.setItem(`tour_completed_${user.id}`, 'true');
            } catch (storageError) {
              console.warn('⚠️ No se pudo guardar tour completado (storage bloqueado):', storageError);
            }
          }}
        />
      )}
      
      <div className="min-h-screen flex w-full">
        {/* SIDEBAR DESKTOP */}
        <Sidebar className="border-r border-gray-200 hidden md:flex">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <Logo className="w-11 h-11 shadow-md" />
              <div className="flex flex-col">
                <h2 className="font-bold text-base text-gray-800 leading-tight">
                  Tu Voz, Tu Premio
                </h2>
                <p className="text-xs text-gray-500 leading-tight">Convocatorias de Canto</p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Navegación
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-purple-50 text-purple-700' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <Icon3D
                            icon={item.icon}
                            size="xs"
                            gradient={location.pathname === item.url
                              ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600'
                              : 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500'}
                          />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            {isLoadingUser ? (
              <div className="h-16 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center justify-between gap-2">
                <NotificationBell user={user} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex-grow justify-start text-left h-auto px-2 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                          {user.profile_image ? (
                            <img src={user.profile_image} alt={user.full_name} className="w-full h-full object-cover" />
                          ) : (
                            user.full_name?.[0] || 'U'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{user.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {getUserRoleDisplay(user)}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2">
                    {user.role === 'admin' && (
                      <>
                        <Link to={createPageUrl('AdminDashboard')}>
                          <DropdownMenuItem>
                            Panel de Administración
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
Usa el código con precaución.
</>
)}
{user.user_type === 'artist' && user.role !== 'admin' && (
)}
{user.user_type === 'fan' && user.role !== 'admin' && (
)}
{(user.role === 'admin' || user.user_type === 'fan') && (
)}
{(user.role === 'admin' || user.user_type === 'artist') && (
)}
Cerrar Sesión




) : (

Iniciar Sesión

)}

{/* HEADER MOBILE */}
{user && }
{isLoadingUser ? (

) : user ? (




{user.profile_image ? (

) : (
user.full_name?.[0] || 'U'
)}






{user.full_name}
{getUserRoleDisplay(user)}



{user.role === 'admin' && (
<>
</>
)}
{user.user_type === 'artist' && user.role !== 'admin' && (
)}
{user.user_type === 'fan' && user.role !== 'admin' && (
)}
{(user.role === 'admin' || user.user_type === 'fan') && (
)}
{(user.role === 'admin' || user.user_type === 'artist') && (
)}


Cerrar Sesión



) : (

Iniciar Sesión

)}


{children}

);
}
