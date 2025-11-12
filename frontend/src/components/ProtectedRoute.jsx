import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import App from '../App'; 

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <App />;
};

export default ProtectedRoute;