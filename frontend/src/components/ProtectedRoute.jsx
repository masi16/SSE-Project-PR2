// Contenido CORRECTO para: frontend/src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import App from '../App'; // Importamos nuestro layout principal

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // Si el usuario NO está autenticado, lo redirigimos a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, mostramos el layout principal (App.jsx) que a su vez
  // mostrará la página anidada correspondiente (Dashboard, Expedientes, etc.)
  return <App />;
};

// 👇 ¡ESTA ES LA LÍNEA QUE PROBABLEMENTE FALTA! 👇
export default ProtectedRoute;