// Contenido COMPLETO Y CORRECTO para: frontend/src/pages/ClientesPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { getClientes } from '../api/mockApi';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre', width: 150 },
  { field: 'apellido', headerName: 'Apellido', width: 150 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'telefono', headerName: 'Teléfono', width: 200 },
];

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const data = await getClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);
  
  const handleRowClick = (params) => {
    alert(`Has hecho clic en el cliente con ID: ${params.id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestión de Clientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Crear Cliente
        </Button>
      </Box>
      
      <Box sx={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={clientes}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
        />
      </Box>
    </Box>
  );
}

// 👇 ¡ESTA ES LA LÍNEA QUE FALTA! 👇
export default ClientesPage;