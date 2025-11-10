// en frontend/src/theme.js
import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale'; // Para traducciones, si las necesitas en el futuro

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Un azul más claro, mejor para fondos oscuros
    },
    secondary: {
      main: '#f48fb1', // Un rosa más claro
    },
    background: {
      default: '#121212', // Un negro más profundo y estándar para modo oscuro
      paper: '#1e1e1e',   // Un gris oscuro para las tarjetas y formularios
    },
    text: {
      primary: '#ffffff', // Texto principal blanco
      secondary: '#b0b0b0', // Texto secundario un poco más gris
    },
  },
  components: {
    // Sobrescribimos estilos para componentes específicos
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
        },
        cell: {
          borderBottom: '1px solid #333',
        },
        columnHeaders: {
          backgroundColor: '#333',
          borderBottom: '1px solid #555',
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: '#1e1e1e', // Hacemos la barra superior consistente con el fondo de papel
            }
        }
    }
  },
}, esES); // esES traduce textos por defecto de MUI (ej. en la paginación de tablas)

export default theme;