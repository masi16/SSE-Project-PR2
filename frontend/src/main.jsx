// Contenido CORRECTO para: frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ExpedientesPage from './pages/ExpedientesPage.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 Asegúrate de que <BrowserRouter> está aquí, envolviendo todo 👇 */}
    <BrowserRouter>
      <Routes>
        {/* App.jsx está DENTRO de BrowserRouter, por lo tanto sus Links funcionarán */}
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="expedientes" element={<ExpedientesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);