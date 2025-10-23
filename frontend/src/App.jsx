import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, AppBar, Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; 
import GavelIcon from '@mui/icons-material/Gavel'; 

const drawerWidth = 240;

function App() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      {}
      {}
      {}
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

      {}
      {}
      {}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {}
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

      {}
      {}
      {}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {}
        
        {}
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
