import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuthEvents = () => {
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth expiration events
    const handleAuthExpired = () => {
      logout();
      // Only navigate to /auth if we are on a protected page
      // But since ProtectedRoute already handles this, we don't need to force it here.
      // navigate('/auth', { replace: true });
    };

    // Listen for user update events
    const handleUserUpdated = (event) => {
      if (event.detail) {
        updateUser(event.detail);
      }
    };

    // Listen for access denied events
    const handleAccessDenied = () => {
      // navigate('/auth', { replace: true });
    };

    window.addEventListener('authExpired', handleAuthExpired);
    window.addEventListener('userUpdated', handleUserUpdated);
    window.addEventListener('accessDenied', handleAccessDenied);

    return () => {
      window.removeEventListener('authExpired', handleAuthExpired);
      window.removeEventListener('userUpdated', handleUserUpdated);
      window.removeEventListener('accessDenied', handleAccessDenied);
    };
  }, [logout, updateUser, navigate]);
};
