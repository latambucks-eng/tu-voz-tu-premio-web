import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44, supabase } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadUser = async (silent = false) => {
    try {
      if (!silent) setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      if (!silent) setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    loadUser(false);
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        loadUser(true);
      }
    });
    const openModalHandler = () => {
      setAuthMsg('');
      setShowAuthModal(true);
    };
    window.addEventListener('open-supabase-auth-modal', openModalHandler);
    return () => {
      listener?.subscription?.unsubscribe();
      window.removeEventListener('open-supabase-auth-modal', openModalHandler);
    };
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAuthMsg('');
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setShowAuthModal(false);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setShowAuthModal(false);
      }
    } catch (err) {
      setAuthMsg(err.message || 'Error de autenticación');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async (shouldRedirect = true) => {
    await base44.auth.logout(shouldRedirect ? '/' : undefined);
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    setAuthMsg('');
    setShowAuthModal(true);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError: null,
        appPublicSettings: {},
        logout,
        navigateToLogin,
        checkAppState: loadUser,
      }}
    >
      {children}

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <button onClick={() => setShowAuthModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                    placeholder="Tu nombre"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              {authMsg && <p className="text-sm text-red-400">{authMsg}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 transition"
              >
                {submitting ? 'Procesando...' : authMode === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-zinc-400">
              {authMode === 'login' ? (
                <>
                  ¿No tienes cuenta?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-amber-400 underline">
                    Regístrate aquí
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-amber-400 underline">
                    Inicia sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
