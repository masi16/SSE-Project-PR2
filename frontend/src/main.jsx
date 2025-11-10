// Contenido COMPLETO Y ACTUALIZADO para: frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Herramientas para el tema y estilos
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // Nuestro tema oscuro personalizado

// 2. Lógica de autenticación
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 3. Layouts de la aplicación
import PublicLayout from './components/PublicLayout'; // Layout para centrar las páginas públicas

// 4. Todas nuestras páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ExpedientesPage from './pages/ExpedientesPage';
import ExpedienteDetailPage from './pages/ExpedienteDetailPage';
import ClientesPage from './pages/ClientesPage';

// 5. Estilos globales simplificados
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvemos todo en el proveedor de tema */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline resetea estilos y aplica el fondo oscuro */}
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas Públicas: usan el PublicLayout para centrarse */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Rutas Protegidas: usan el ProtectedRoute, que a su vez renderiza el App.jsx (layout principal) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/expedientes" element={<ExpedientesPage />} />
              <Route path="/expedientes/:expedienteId" element={<ExpedienteDetailPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              {/* Aquí irían más rutas protegidas en el futuro */}
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);