import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, AppBar, Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; 
import GavelIcon from '@mui/icons-material/Gavel'; 
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EventIcon from '@mui/icons-material/Event';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

const drawerWidth = 240;

function App() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar (Barra superior) */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Sistema de Expedientes
          </Typography>
          <Box>
            <Typography component="span" sx={{ mr: 2 }}>
              Hola, {user?.email}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Menú lateral) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Espaciado para que no se superponga con AppBar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton component={Link} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton component={Link} to="/abogados">
              <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
              <ListItemText primary="Abogados" />
            </ListItemButton>

            <ListItemButton component={Link} to="/clientes">
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItemButton>

            <ListItemButton component={Link} to="/expedientes">
              <ListItemIcon><GavelIcon /></ListItemIcon>
              <ListItemText primary="Expedientes" />
            </ListItemButton>

            <ListItemButton component={Link} to="/movimientos">
              <ListItemIcon><EventIcon /></ListItemIcon>
              <ListItemText primary="Movimientos" />
            </ListItemButton>

            <ListItemButton component={Link} to="/resoluciones">
              <ListItemIcon><GavelOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Resoluciones" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Espaciado para que no se superponga con AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;