import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('accessToken');
          } else {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ email: decodedToken.sub, rol: decodedToken.rol || 'usuario' });
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Intentando login con:", email);
      
      // Crear FormData para enviar como form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      console.log("Login exitoso:", response.data);

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('accessToken', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        const decodedToken = jwtDecode(access_token);
        setUser({ email: decodedToken.sub, rol: decodedToken.rol || 'usuario' });
      }
    } catch (error) {
      console.error("Error en el login:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Email o contraseña incorrectos');
    }
  };

  const register = async (userData) => {
    try {
      console.log("Registrando usuario:", userData);
      
      // POST a /auth/register con JSON
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        rol: userData.rol || 'usuario',
        fk_abogado_id: userData.fk_abogado_id || null
      });

      console.log("Usuario registrado con éxito:", response.data);
      
      // Loguear automáticamente después del registro
      await login(userData.email, userData.password);

      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      const detail = error.response?.data?.detail;
      
      if (Array.isArray(detail)) {
        // Si es un array de errores de validación
        const errors = detail.map(e => e.msg || e).join(', ');
        throw new Error(errors);
      } else if (typeof detail === 'string') {
        throw new Error(detail);
      } else {
        throw new Error('No se pudo registrar el usuario');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
    api,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};