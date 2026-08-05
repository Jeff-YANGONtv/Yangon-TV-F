import { useAuth } from '../context/AuthContext';

export const useAuthCheck = () => {
  const { isAuthenticated, openAuthModal, isAuthModalOpen, closeAuthModal } = useAuth();

  const checkAuth = (callback) => {
    if (isAuthenticated) {
      if (callback) callback();
      return true;
    } else {
      openAuthModal();
      return false;
    }
  };

  return { 
    checkAuth, 
    showAuthModal: isAuthModalOpen, 
    setShowAuthModal: (val) => val ? openAuthModal() : closeAuthModal() 
  };
};
