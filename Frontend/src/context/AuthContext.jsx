import { createContext, useContext, useEffect, useState } from 'react';
import { registrarLogout } from '../api/axiosInstance.js';

export const AuthContext = createContext(null);

function decodePayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [inicializando, setInicializando] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado) {
      const payload = decodePayload(tokenGuardado);
      if (payload) {
        setToken(tokenGuardado);
        setUser({ id: payload.id, username: payload.username });
      }
    }
    setInicializando(false);
  }, []);

  function loginCtx(data) {
    if (!data?.token || !data?.id || !data?.username) return;
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({ id: data.id, username: data.username, email: data.email });
  }

  function logoutCtx() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    registrarLogout(logoutCtx);
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login: loginCtx,
      logout: logoutCtx,
      isAuthenticated: token !== null,
      inicializando,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
