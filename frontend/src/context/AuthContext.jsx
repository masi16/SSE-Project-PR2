import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const mockUserDatabase = [
  {
    id: 1,
    email: 'abogado@test.com',
    password: 'password', 
    rol: 'ABOGADO',
  }
];
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      const loggedInUser = mockUserDatabase.find(u => u.id === parseInt(userId));
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUserDatabase.find(
          (u) => u.email === username && u.password === password
        );

        if (foundUser) {
          console.log("MOCK LOGIN: ¡Credenciales correctas para", foundUser.email);
          const fakeToken = 'este-es-un-token-falso-de-prueba';
          localStorage.setItem('accessToken', fakeToken);
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
  const register = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        
        const existingUser = mockUserDatabase.find(u => u.email === email);
        if (existingUser) {
          console.log("MOCK REGISTER: El email ya existe.");
          return reject(new Error('El email ya está en uso.'));
        }

        
        const newUser = {
          id: Date.now(), 
          email,
          password,
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
    localStorage.removeItem('userId'); 
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