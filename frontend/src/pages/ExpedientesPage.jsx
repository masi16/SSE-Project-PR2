import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

const getEstadoColor = (estado) => {
  const colores = {
    'Abierto': 'primary',
    'En progreso': 'warning',
    'Cerrado': 'success',
    'Archivado': 'default'
  };
  return colores[estado] || 'default';
};

function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [abogados, setAbogados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [formData, setFormData] = useState({
    nro_expediente: '',
    caratula: '',
    fecha_ingreso: '',
    fk_cliente_id: '',
    fk_abogado_id: '',
    fk_estado_id: 1
  });
  const { api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoadingData(true);
      setError('');
      
      const expResponse = await api.get('/expedientes/');
      setExpedientes(expResponse.data || []);
      
      const clientesResponse = await api.get('/clientes/');
      setClientes(clientesResponse.data || []);
      
      const abogadosResponse = await api.get('/abogados/');
      setAbogados(abogadosResponse.data || []);
      
      const estadosResponse = await api.get('/estados/');
      setEstados(estadosResponse.data || []);
      
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError('Error al cargar los datos: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenModal = async () => {
    try {
      setLoadingModal(true);
      setError('');
      setSuccess('');
      
      const clientesResponse = await api.get('/clientes/');
      const abogadosResponse = await api.get('/abogados/');
      const estadosResponse = await api.get('/estados/');
      
      setClientes(clientesResponse.data || []);
      setAbogados(abogadosResponse.data || []);
      setEstados(estadosResponse.data || []);
      
      setOpenModal(true);
    } catch (error) {
      console.error("Error al cargar datos del modal:", error);
      setError('Error al cargar datos: ' + error.message);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      nro_expediente: '',
      caratula: '',
      fecha_ingreso: '',
      fk_cliente_id: '',
      fk_abogado_id: '',
      fk_estado_id: 1
    });
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

  const handleCreateExpediente = async (e) => {
    e.preventDefault();
    
    if (!formData.nro_expediente || !formData.caratula || !formData.fecha_ingreso || 
        !formData.fk_cliente_id || !formData.fk_abogado_id) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setError('');
      setLoadingModal(true);
      
      const payload = {
        nro_expediente: formData.nro_expediente,
        caratula: formData.caratula,
        fecha_ingreso: formData.fecha_ingreso,
        fk_cliente_id: parseInt(formData.fk_cliente_id),
        fk_abogado_id: parseInt(formData.fk_abogado_id),
        fk_estado_id: parseInt(formData.fk_estado_id)
      };
      
      await api.post('/expedientes/', payload);
      
      setSuccess('Expediente creado exitosamente');
      await fetchAllData();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || 'Error al crear el expediente');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleRowClick = (params) => {
    navigate(`/expedientes/${params.id}`);
  };

  const filteredExpedientes = filtroEstado 
    ? expedientes.filter(e => e.fk_estado_id === parseInt(filtroEstado))
    : expedientes;

  const getEstadoNombre = (estadoId) => {
    const estado = estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Desconocido';
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nro_expediente', headerName: 'Nro. Expediente', width: 150 },
    { field: 'caratula', headerName: 'Carátula', flex: 1 },
    { field: 'fecha_ingreso', headerName: 'Fecha Ingreso', width: 130 },
    {
      field: 'fk_estado_id',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => {
        const estadoNombre = getEstadoNombre(params.value);
        return (
          <Chip 
            label={estadoNombre} 
            color={getEstadoColor(estadoNombre)}
            variant="outlined"
            size="small"
          />
        );
      }
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestión de Expedientes</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenModal}
          disabled={loadingModal}
        >
          Crear Expediente
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      {/* Filtro por estado */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Filtrar por Estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          sx={{ width: 200 }}
          size="small"
        >
          <MenuItem value="">Todos los estados</MenuItem>
          {estados.map(estado => (
            <MenuItem key={estado.id} value={estado.id}>
              {estado.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Mostrando {filteredExpedientes.length} de {expedientes.length} expedientes
        </Typography>
      </Box>
      
      {loadingData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: '70vh', width: '100%' }}>
          <DataGrid
            rows={filteredExpedientes}
            columns={columns}
            loading={loadingData}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            onRowClick={handleRowClick}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          />
        </Box>
      )}

      {/* Modal para crear expediente */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Expediente</DialogTitle>
        <DialogContent>
          {loadingModal && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          )}
          
          {!loadingModal && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                fullWidth
                label="Número de Expediente"
                name="nro_expediente"
                value={formData.nro_expediente}
                onChange={handleInputChange}
                required
                placeholder="Ej: 2023-001234"
              />
              
              <TextField
                fullWidth
                label="Carátula"
                name="caratula"
                value={formData.caratula}
                onChange={handleInputChange}
                required
                placeholder="Ej: Juan Gómez vs. Pedro Sánchez"
                multiline
                rows={2}
              />
              
              <TextField
                fullWidth
                label="Fecha de Ingreso"
                name="fecha_ingreso"
                type="date"
                value={formData.fecha_ingreso}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                label="Estado"
                name="fk_estado_id"
                select
                value={formData.fk_estado_id}
                onChange={handleInputChange}
              >
                {estados.map(estado => (
                  <MenuItem key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                label="Cliente"
                name="fk_cliente_id"
                select
                value={formData.fk_cliente_id}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Seleccionar cliente</MenuItem>
                {clientes.map(cliente => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido} ({cliente.email})
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                label="Abogado"
                name="fk_abogado_id"
                select
                value={formData.fk_abogado_id}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Seleccionar abogado</MenuItem>
                {abogados.map(abogado => (
                  <MenuItem key={abogado.id} value={abogado.id}>
                    {abogado.nombre} {abogado.apellido} (Mat: {abogado.matricula})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={loadingModal}>Cancelar</Button>
          <Button onClick={handleCreateExpediente} variant="contained" disabled={loadingModal}>
            {loadingModal ? 'Cargando...' : 'Crear Expediente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExpedientesPage;