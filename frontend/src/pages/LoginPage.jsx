// Contenido COMPLETO Y CORRECTO para: frontend/src/pages/LoginPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Grid } from '@mui/material';

function LoginPage() {
  // 👇 1. El estado ahora se llama "dni"
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      // 👇 2. Pasamos "dni" a la función de login
      await login(dni, password);
      navigate('/');
    } catch (err) {
      setError('DNI o contraseña incorrectos');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          
          {/* 👇 3. ESTE ES EL CAMBIO MÁS IMPORTANTE PARA LA PARTE VISUAL 👇 */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="dni"
            label="DNI" // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN!
            name="dni"
            autoFocus
            value={dni}
            onChange={e => setDni(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register" variant="body2">
                {"¿No tienes una cuenta? Regístrate"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;