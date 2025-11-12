import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nombre', headerName: 'Nombre', width: 120 },
  { field: 'apellido', headerName: 'Apellido', width: 120 },
  { field: 'matricula', headerName: 'Matrícula', width: 120 },
  { field: 'telefono', headerName: 'Teléfono', width: 150 },
];

function AbogadosPage() {
  const [abogados, setAbogados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    telefono: ''
  });
  const { api } = useAuth();

  // Cargar abogados
  const fetchAbogados = async () => {
    try {
      setLoading(true);
      const response = await api.get('/abogados/');
      setAbogados(response.data);
    } catch (error) {
      console.error("Error al obtener abogados:", error);
      setError('Error al cargar los abogados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbogados();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ nombre: '', apellido: '', matricula: '', telefono: '' });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAbogado = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.matricula) {
      setError('Nombre, apellido y matrícula son obligatorios');
      return;
    }

    try {
      setError('');
      const response = await api.post('/abogados/', formData);
      
      setSuccess('Abogado creado exitosamente');
      console.log('Abogado creado:', response.data);
      
      // Actualizar la lista
      await fetchAbogados();
      
      // Cerrar el modal después de 1 segundo
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error('Error al crear abogado:', error);
      setError(error.response?.data?.detail || 'Error al crear el abogado');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestión de Abogados</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear Abogado
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box sx={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={abogados}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
        />
      </Box>

      {/* Modal para crear abogado */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Abogado</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Matrícula"
              name="matricula"
              value={formData.matricula}
              onChange={handleInputChange}
              required
              placeholder="Ej: 12345"
            />
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Ej: +54 911 2345678"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleCreateAbogado} variant="contained">
            Crear Abogado
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AbogadosPage;