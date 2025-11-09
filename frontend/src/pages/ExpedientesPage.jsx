// Contenido DE DEPURACIÓN para: frontend/src/pages/ExpedientesPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { getExpedientes, createExpediente } from '../api/mockApi';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nro_expediente', headerName: 'Nro. Expediente', width: 200 },
  { field: 'caratula', headerName: 'Carátula', flex: 1 },
  { field: 'fecha_ingreso', headerName: 'Fecha Ingreso', width: 150 },
];

function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const fetchExpedientes = async () => {
    try {
      setLoading(true);
      const data = await getExpedientes();
      setExpedientes(data);
    } catch (error) {
      console.error("Error al obtener los expedientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpedientes();
  }, []);
  
  const handleOpenModal = () => {
    console.log('Botón "Crear Expediente" clickeado, abriendo modal...');
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleCreateSubmit = async (event) => {
    console.log('Formulario enviado, ejecutando handleCreateSubmit...');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newExpedienteData = {
      nro_expediente: formData.get('nro_expediente'),
      caratula: formData.get('caratula'),
      fecha_ingreso: formData.get('fecha_ingreso'),
      juzgado: 'Juzgado a asignar', 
      abogado: 'Abogado actual', 
      cliente: 'Cliente a asignar'
    };

    console.log('Datos a enviar a la API falsa:', newExpedienteData);

    try {
      await createExpediente(newExpedienteData);
      console.log('Llamada a createExpediente fue exitosa.');
      handleCloseModal();
      fetchExpedientes();
      alert('¡Expediente creado con éxito!');
    } catch (error) {
      // ESTE ES EL LUGAR MÁS IMPORTANTE A MIRAR
      console.error("¡ERROR DENTRO DE handleCreateSubmit!:", error);
      alert('Error al crear el expediente. Revisa la consola para más detalles.');
    }
  };

  const handleRowClick = (params) => navigate(`/expedientes/${params.id}`);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestión de Expedientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear Expediente
        </Button>
      </Box>
      
      <Box sx={{ height: '70vh', width: '100%' }}>
        <DataGrid rows={expedientes} columns={columns} loading={loading} onRowClick={handleRowClick} sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }} />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogTitle>Crear Nuevo Expediente</DialogTitle>
          <DialogContent>
            <TextField autoFocus required margin="dense" id="nro_expediente" name="nro_expediente" label="Número de Expediente" type="text" fullWidth variant="standard" />
            <TextField required margin="dense" id="caratula" name="caratula" label="Carátula" type="text" fullWidth variant="standard" />
            <TextField required margin="dense" id="fecha_ingreso" name="fecha_ingreso" label="Fecha de Ingreso" type="date" fullWidth variant="standard" InputLabelProps={{ shrink: true }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">Crear</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
const handleRowClick = (params) => {
    // Chivato #1: ¿Se está ejecutando esta función?
    console.log("Se hizo clic en una fila.");
    
    // Chivato #2: ¿Qué información estamos recibiendo del clic?
    console.log("Datos de la fila (params):", params);
    
    // Chivato #3: ¿Tenemos un ID válido?
    console.log("ID del expediente a navegar:", params.id);
    
    // Chivato #4: ¿A qué URL estamos intentando ir?
    const targetUrl = `/expedientes/${params.id}`;
    console.log("Intentando navegar a:", targetUrl);
    
    navigate(targetUrl);
    
    // Chivato #5: ¿Se ejecutó el comando de navegación?
    console.log("Comando de navegación ejecutado.");
  };


export default ExpedientesPage;