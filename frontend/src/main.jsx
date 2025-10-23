

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import HomePage from './pages/HomePage';
import ExpedientesPage from './pages/ExpedientesPage';


import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/expedientes" element={<ExpedientesPage />} />
            {}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);