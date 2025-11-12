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
  { field: 'fecha_resolucion', headerName: 'Fecha', width: 130 },
  { field: 'texto_resolucion', headerName: 'Resolución', flex: 1 },
  { field: 'fk_expediente_id', headerName: 'Expediente ID', width: 130 },
];

function ResolucionesPage() {
  const [resoluciones, setResoluciones] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    texto_resolucion: '',
    fecha_resolucion: '',
    fk_expediente_id: ''
  });
  const { api } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const resResponse = await api.get('/resoluciones/');
      setResoluciones(resResponse.data || []);
      
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
    setFormData({ texto_resolucion: '', fecha_resolucion: '', fk_expediente_id: '' });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateResolucion = async (e) => {
    e.preventDefault();
    
    if (!formData.texto_resolucion || !formData.fecha_resolucion || !formData.fk_expediente_id) {
      setError('Texto, fecha y expediente son obligatorios');
      return;
    }

    try {
      setError('');
      const response = await api.post('/resoluciones/', {
        texto_resolucion: formData.texto_resolucion,
        fecha_resolucion: formData.fecha_resolucion,
        fk_expediente_id: parseInt(formData.fk_expediente_id)
      });
      
      setSuccess('Resolución creada exitosamente');
      await fetchAllData();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || 'Error al crear la resolución');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestión de Resoluciones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear Resolución
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
            rows={resoluciones}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </Box>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nueva Resolución</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Fecha de la Resolución"
              name="fecha_resolucion"
              type="date"
              value={formData.fecha_resolucion}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Texto de la Resolución"
              name="texto_resolucion"
              value={formData.texto_resolucion}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
              placeholder="Ej: La corte resuelve favorablemente..."
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
          <Button onClick={handleCreateResolucion} variant="contained">
            Crear Resolución
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResolucionesPage;