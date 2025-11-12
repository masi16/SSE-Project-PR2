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
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'fecha_movimiento', headerName: 'Fecha', width: 130 },
  { field: 'descripcion', headerName: 'Descripción', flex: 1 },
  { field: 'fk_expediente_id', headerName: 'Expediente ID', width: 130 },
];

function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fecha_movimiento: '',
    descripcion: '',
    fk_expediente_id: ''
  });
  const { api } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const movResponse = await api.get('/movimientos/');
      setMovimientos(movResponse.data || []);
      
      const expResponse = await api.get('/expedientes/');
      setExpedientes(expResponse.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ fecha_movimiento: '', descripcion: '', fk_expediente_id: '' });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateMovimiento = async (e) => {
    e.preventDefault();
    
    if (!formData.fecha_movimiento || !formData.fk_expediente_id) {
      setError('Fecha y expediente son obligatorios');
      return;
    }

    try {
      setError('');
      const response = await api.post('/movimientos/', {
        fecha_movimiento: formData.fecha_movimiento,
        descripcion: formData.descripcion,
        fk_expediente_id: parseInt(formData.fk_expediente_id)
      });
      
      setSuccess('Movimiento creado exitosamente');
      await fetchAllData();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || 'Error al crear el movimiento');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestión de Movimientos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear Movimiento
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: '70vh', width: '100%' }}>
          <DataGrid
            rows={movimientos}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </Box>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Movimiento</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Fecha del Movimiento"
              name="fecha_movimiento"
              type="date"
              value={formData.fecha_movimiento}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              multiline
              rows={3}
              placeholder="Ej: Presentación de demanda, Primera audiencia, etc."
            />
            
            <TextField
              fullWidth
              label="Expediente"
              name="fk_expediente_id"
              select
              value={formData.fk_expediente_id}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">Seleccionar expediente</MenuItem>
              {expedientes.map(exp => (
                <MenuItem key={exp.id} value={exp.id}>
                  {exp.nro_expediente} - {exp.caratula}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleCreateMovimiento} variant="contained">
            Crear Movimiento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MovimientosPage;