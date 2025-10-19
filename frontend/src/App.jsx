// Contenido CORRECTO para: frontend/src/App.jsx

import { Link, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        {/* Estos <Link> ahora funcionarán porque App.jsx está envuelto
            por BrowserRouter en el archivo main.jsx */}
        <Link to="/">Inicio</Link>
        <Link to="/expedientes">Expedientes</Link>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2025 Sistema de Seguimiento de Expedientes</p>
      </footer>
    </div>
  );
}

export default App;