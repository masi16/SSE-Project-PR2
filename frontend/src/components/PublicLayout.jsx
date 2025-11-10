// Contenido COMPLETO para: frontend/src/components/PublicLayout.jsx

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  // Este Box actúa como un contenedor que ocupa toda la pantalla
  // y centra su contenido (el <Outlet />) tanto vertical como horizontalmente.
  return (
    <Box 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* El Outlet es donde React Router renderizará LoginPage o RegisterPage */}
      <Outlet />
    </Box>
  );
}

export default PublicLayout;