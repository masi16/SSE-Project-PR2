// Contenido COMPLETO Y CORRECTO para: frontend/src/App.jsx

import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, AppBar, Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Icono para el Dashboard
import GavelIcon from '@mui/icons-material/Gavel'; // Icono para Expedientes

const drawerWidth = 240;

function App() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* ======================================================= */}
      {/* BARRA SUPERIOR (HEADER) - Esto ya lo ves */}
      {/* ======================================================= */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Sistema de Expedientes
          </Typography>
          <Box>
            <Typography component="span" sx={{ mr: 2 }}>
              Hola, {user?.email}
            </Typography>
            <Button color="inherit" onClick={logout}>Cerrar Sesión</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ======================================================= */}
      {/* BARRA LATERAL (SIDEBAR) - Esto es lo que falta */}
      {/* ======================================================= */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Espacio para que no quede debajo del AppBar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton component={Link} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} to="/expedientes">
              <ListItemIcon><GavelIcon /></ListItemIcon>
              <ListItemText primary="Expedientes" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* ======================================================= */}
      {/* CONTENIDO PRINCIPAL - ¡Esto es lo más importante que falta! */}
      {/* ======================================================= */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Otro espacio para el contenido */}
        
        {/* El <Outlet/> es el espacio mágico donde React Router
            renderizará tu Dashboard (HomePage) o tu lista de expedientes.
            Sin esto, el área de contenido se queda vacía. */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;