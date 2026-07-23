import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Interceptor de REQUEST: agrega el token si existe
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Interceptor de RESPONSE: si el token expiro, limpiar sesion
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      // Solo limpiar si NO es la ruta de login (para no entrar en loop)
      if (!url.includes('/auth/login') && !url.includes('/auth/registro')) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        // No redirigir automaticamente, el CartContext manejara el estado
      }
    }
    return Promise.reject(err);
  }
);

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usr   = localStorage.getItem('usuario');
    if (token && usr) {
      try { setUsuario(JSON.parse(usr)); }
      catch { localStorage.removeItem('usuario'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  };

  const registro = async (form) => {
    await API.post('/auth/registro', form);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthCtx.Provider value={{ usuario, login, registro, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
export { API };
