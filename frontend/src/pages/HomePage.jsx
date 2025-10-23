import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

import { getDashboardData } from '../api/mockApi';


function StatCard({ title, value }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
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
  const [activity, setActivity] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        const response = await getDashboardData();

        setSummary(response.summary);
        setActivity(response.activity);
        setConsultations(response.consultations);
      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); 
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <StatCard title="Expedientes Activos" value={summary?.active_cases || 0} />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <StatCard title="Consultas para Hoy" value={summary?.today_consultations || 0} />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Actividad Reciente</Typography>
            <List>
              {activity.length > 0 ? activity.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={`[${item.expediente_caratula}] - ${item.descripcion}`}
                    secondary={new Date(item.fecha_movimiento).toLocaleDateString()}
                  />
                </ListItem>
              )) : <ListItem><ListItemText primary="No hay actividad reciente." /></ListItem>}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Próximas Consultas</Typography>
            <List>
              {consultations.length > 0 ? consultations.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.tema_consulta}
                    secondary={`Cliente: ${item.cliente_nombre} - ${new Date(item.fecha_consulta).toLocaleString()}`}
                  />
                </ListItem>
              )) : <ListItem><ListItemText primary="No hay próximas consultas." /></ListItem>}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
