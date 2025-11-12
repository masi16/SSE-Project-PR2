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

  // Efecto para verificar el token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Decodificamos el token para verificar si ha expirado
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            // El token ha expirado
            localStorage.removeItem('accessToken');
          } else {
            // El token es válido, lo configuramos y obtenemos los datos del usuario
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Asumimos que el payload del token contiene la información del usuario
            // Opcional: Podrías llamar a un endpoint /users/me si lo tienes
            setUser({ email: decodedToken.sub, rol: decodedToken.rol || 'ABOGADO' });
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
      // El endpoint de token de FastAPI espera los datos en formato 'form-data'
      const formData = new URLSearchParams();
      formData.append('Correo', email);
      formData.append('Contraseña', password);

      // Hacemos la petición POST a la ruta de login del backend
      const response = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token } = response.data;
      if (access_token) {
        // Guardamos el token en localStorage
        localStorage.setItem('accessToken', access_token);
        
        // Configuramos el token en los headers de Axios para las siguientes peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Decodificamos el token para obtener la info del usuario y guardarla en el estado
        const decodedToken = jwtDecode(access_token);
        setUser({ email: decodedToken.sub, rol: decodedToken.rol || 'USUARIO' });
      }
    } catch (error) {
      console.error("Error en el login:", error.response?.data || error.message);
      // Lanzamos el error para que el componente del formulario lo muestre
      throw new Error(error.response?.data?.detail || 'Usuario o contraseña incorrectos');
    }
  };

  // ======================================================================
  // FUNCIÓN REGISTER CONECTADA AL BACKEND
  // ======================================================================
  const register = async (userData) => {
    // userData debe ser un objeto: { email, password, nombre, apellido, matricula }
    try {
      // Hacemos la petición POST a la ruta de registro que creaste en tu router de abogados/usuarios
      const response = await api.post('/usuarios/', userData);
      
      console.log("Usuario registrado con éxito:", response.data);
      // Opcionalmente, puedes loguear al usuario automáticamente
      await login(userData.email, userData.password);

      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'No se pudo registrar el usuario. Verifique los datos.');
    }
  };

  // ======================================================================
  // FUNCIÓN LOGOUT
  // ======================================================================
  const logout = () => {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    // Para una mejor experiencia, redirige al usuario al login
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
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