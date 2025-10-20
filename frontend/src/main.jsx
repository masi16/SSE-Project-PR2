// Contenido CORRECTO Y COMPLETO para: frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Imports de la lógica de autenticación
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Imports de las páginas (cada una importada UNA SOLA VEZ)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import HomePage from './pages/HomePage';
import ExpedientesPage from './pages/ExpedientesPage';

// Import de los estilos globales
import './index.css';

// Esta es la única parte que "ejecuta" la aplicación. Todo debe ir aquí dentro.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas: cualquiera puede acceder a ellas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas: solo usuarios logueados pueden acceder */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/expedientes" element={<ExpedientesPage />} />
            {/* Aquí añadirías más rutas protegidas en el futuro */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);