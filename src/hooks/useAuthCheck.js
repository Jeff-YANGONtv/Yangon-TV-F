import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthCheck = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const checkAuth = (callback) => {
    if (isAuthenticated) {
      if (callback) callback();
      return true;
    } else {
      setShowAuthModal(true);
      return false;
    }
  };

  return { checkAuth, showAuthModal, setShowAuthModal };
};
