// Contenido MEJORADO para: frontend/src/context/AuthContext.jsx
// VERSIÓN SIMULADA CON "BASE DE DATOS" EN MEMORIA

import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// ======================================================================
// 👇 ¡NUEVO! Nuestra "Base de Datos" de usuarios simulada 👇
// ======================================================================
const mockUserDatabase = [
  {
    id: 1,
    email: 'abogado@test.com',
    password: 'password', // Ahora guardamos la contraseña para poder verificarla
    rol: 'ABOGADO',
  }
];
// ======================================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      // Al recargar, buscamos al usuario en nuestra "BD"
      const loggedInUser = mockUserDatabase.find(u => u.id === parseInt(userId));
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    }
    setLoading(false);
  }, []);

  // 👇 FUNCIÓN LOGIN MEJORADA 👇
  const login = async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Buscamos al usuario en nuestra "base de datos"
        const foundUser = mockUserDatabase.find(
          (u) => u.email === username && u.password === password
        );

        if (foundUser) {
          console.log("MOCK LOGIN: ¡Credenciales correctas para", foundUser.email);
          const fakeToken = 'este-es-un-token-falso-de-prueba';
          localStorage.setItem('accessToken', fakeToken);
          // Guardamos el ID del usuario para poder encontrarlo al recargar la página
          localStorage.setItem('userId', foundUser.id);
          setUser(foundUser);
          resolve();
        } else {
          console.log("MOCK LOGIN: Credenciales incorrectas.");
          reject(new Error('Usuario o contraseña incorrectos'));
        }
      }, 1000);
    });
  };

  // 👇 FUNCIÓN REGISTER MEJORADA 👇
  const register = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Comprobamos si el usuario ya existe en nuestra "base de datos"
        const existingUser = mockUserDatabase.find(u => u.email === email);
        if (existingUser) {
          console.log("MOCK REGISTER: El email ya existe.");
          return reject(new Error('El email ya está en uso.'));
        }

        // Si no existe, lo añadimos a la "base de datos"
        const newUser = {
          id: Date.now(), // ID único basado en la fecha actual
          email,
          password, // Guardamos la contraseña
          rol: 'ABOGADO'
        };
        mockUserDatabase.push(newUser);
        console.log("MOCK REGISTER: Usuario registrado con éxito:", newUser);
        console.log("Base de datos actual:", mockUserDatabase);
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId'); // También limpiamos el ID
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Cargando aplicación...</div>;
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