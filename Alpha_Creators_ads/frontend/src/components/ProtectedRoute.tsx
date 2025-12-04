import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Store the intended destination
        const currentPath = window.location.pathname;
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        
        // Redirect to login
        navigate('/auth/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // Only render children if authenticated
  if (!authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
