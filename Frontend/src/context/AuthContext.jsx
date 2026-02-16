import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, verificar si hay un token guardado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decodificar el JWT para obtener los datos del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificar si el token no ha expirado
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role || 'invitado'
          });
        } else {
          // Token expirado, limpiar
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('authToken', token);
      // Decodificar el token para obtener los datos del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role || 'invitado'
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getToken,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
