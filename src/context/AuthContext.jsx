import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, client } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          try {
            client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Call verify endpoint to check if token is still valid on backend
            const response = await authApi.verify();
            const userData = response.data.user || JSON.parse(savedUser);
            setUser(userData);
            setSessionValid(true);
          } catch (err) {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
            setSessionValid(false);
            delete client.defaults.headers.common['Authorization'];
          }
        } else {
          setUser(null);
          setSessionValid(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
        setSessionValid(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Setup token refresh interval for real-time session management
  useEffect(() => {
    if (!sessionValid || !user) return;

    const refreshInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Optional: Refresh token from backend if your API supports it
          // This keeps the session alive
          client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Token refresh error:', err);
        logout();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [sessionValid, user]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set authorization header for all future requests
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(user);
      setSessionValid(true);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message: errorMessage };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data;
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set authorization header for all future requests
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(user);
      setSessionValid(true);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if available
      await authApi.logout().catch(() => {
        // Ignore errors from logout endpoint
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Clear authorization header
      delete client.defaults.headers.common['Authorization'];
      
      // Update state
      setUser(null);
      setSessionValid(false);
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && sessionValid,
    sessionValid,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
