import { createContext, useContext, useEffect, useState } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    api
      .getCurrentUser()
      .then((data) => {
        if (data && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          clearAuthToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch(() => {
        clearAuthToken();
        setIsAuthenticated(false);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token) {
      setAuthToken(res.token);
      setIsAuthenticated(true);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
