import React, { createContext, useState, useEffect } from 'react';
import * as api from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rumi_jwt_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Hydrate user profile on load if token exists in local storage
  useEffect(() => {
    async function hydrateSession() {
      if (token) {
        try {
          setLoading(true);
          const response = await api.getCurrentUser();
          setUser(response.user);
        } catch (err) {
          console.error('Session hydration failed:', err);
          // Token expired or invalid, clear session states
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    hydrateSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError('');
      const data = await api.login(email, password);
      
      localStorage.setItem('rumi_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Incorrect email or password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setAuthError('');
      const data = await api.register(userData);
      
      localStorage.setItem('rumi_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rumi_jwt_token');
    setToken(null);
    setUser(null);
    setAuthError('');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      authError,
      setAuthError,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
