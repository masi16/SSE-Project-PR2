import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, CircularProgress, Chip } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function StatCard({ title, value, color = 'primary' }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: `${color}.50` }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    </Paper>
  );
}

function HomePage() {
  const [summary, setSummary] = useState(null);
  const [expedientesGrafico, setExpedientesGrafico] = useState([]);
  const [actividadPorAbogado, setActividadPorAbogado] = useState([]);
  const [casosPorCliente, setCasosPorCliente] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [expResponse, abogadosResponse, clientesResponse, estadosResponse] = await Promise.all([
        api.get('/expedientes/'),
        api.get('/abogados/'),
        api.get('/clientes/'),
        api.get('/estados/')
      ]);

      const expedientes = expResponse.data || [];
      const abogados = abogadosResponse.data || [];
      const clientes = clientesResponse.data || [];
      const estados = estadosResponse.data || [];

      const totalExpedientes = expedientes.length;
      const expedientesAbiertos = expedientes.filter(e => e.fk_estado_id === 1).length;
      const expedientesEnProgreso = expedientes.filter(e => e.fk_estado_id === 2).length;
      const expedientesCerrados = expedientes.filter(e => e.fk_estado_id === 3).length;

      setSummary({
        total_cases: totalExpedientes,
        active_cases: expedientesAbiertos + expedientesEnProgreso,
        closed_cases: expedientesCerrados,
      });

      const datosGrafico = estados.map(estado => {
        const cantidad = expedientes.filter(e => e.fk_estado_id === estado.id).length;
        return {
          name: estado.nombre,
          value: cantidad
        };
      }).filter(d => d.value > 0);

      setExpedientesGrafico(datosGrafico);

      const actividadAbogado = {};
      abogados.forEach(abogado => {
        const casosAsignados = expedientes.filter(e => e.fk_abogado_id === abogado.id).length;
        if (casosAsignados > 0) {
          actividadAbogado[abogado.nombre + ' ' + abogado.apellido] = casosAsignados;
        }
      });

      const datosAbogado = Object.entries(actividadAbogado).map(([nombre, casos]) => ({
        name: nombre.split(' ')[0],
        cases: casos
      }));

      setActividadPorAbogado(datosAbogado);
      
      const casosPorClienteData = {};
      clientes.forEach(cliente => {
        const casos = expedientes.filter(e => e.fk_cliente_id === cliente.id).length;
        if (casos > 0) {
          casosPorClienteData[cliente.nombre + ' ' + cliente.apellido] = casos;
        }
      });

      const datosCliente = Object.entries(casosPorClienteData)
        .map(([nombre, casos]) => ({
          name: nombre.split(' ')[0],
          cases: casos
        }))
        .sort((a, b) => b.cases - a.cases)
        .slice(0, 8);

      setCasosPorCliente(datosCliente);

      const actividadReciente = expedientes.slice(-5).reverse().map(exp => ({
        id: exp.id,
        expediente_caratula: exp.caratula,
        descripcion: `Expediente #${exp.nro_expediente}`,
        fecha_movimiento: exp.fecha_ingreso
      }));

      setActivity(actividadReciente);

    } catch (error) {
      console.error("Error al cargar los datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total de Expedientes" value={summary?.total_cases || 0} color="primary" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Expedientes Activos" value={summary?.active_cases || 0} color="warning" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Expedientes Cerrados" value={summary?.closed_cases || 0} color="success" />
        </Grid>
        {}
        {}
        {}
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Expedientes por Estado</Typography>
            {expedientesGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expedientesGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expedientesGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">Sin datos</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Casos por Abogado</Typography>
            {actividadPorAbogado.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actividadPorAbogado}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">Sin datos</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Clientes (por cantidad de casos)</Typography>
            {casosPorCliente.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={casosPorCliente} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">Sin datos</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Typography variant="h6" gutterBottom>Expedientes Recientes</Typography>
            <List sx={{ overflow: 'auto' }}>
              {activity.length > 0 ? activity.map((item) => (
                <ListItem key={item.id} disableGutters sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {item.expediente_caratula}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.fecha_movimiento).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText primary="No hay expedientes recientes." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;