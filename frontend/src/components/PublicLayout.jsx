import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
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