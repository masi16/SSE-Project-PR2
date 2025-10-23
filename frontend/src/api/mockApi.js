// Contenido CORRECTO para: frontend/src/api/mockApi.js

// 1. ¿Están estos imports correctos?
import { mockSummary, mockActivity, mockConsultations } from './_mockData.js';

// 2. ¡LA LÍNEA CLAVE! ¿Tiene la palabra "export" al principio?
//    ¿El nombre es exactamente "getDashboardData"?
export const getDashboardData = () => {
  console.log(" MOCK API: Fetching dashboard data...");
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(" MOCK API: Data fetched successfully.");
      resolve({
        summary: mockSummary,
        activity: mockActivity,
        consultations: mockConsultations,
      });
    }, 800);
  });
};


// 3. ¿Tiene esta también la palabra "export"?
export const getExpedientes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, nro_expediente: 'EXP-001', caratula: 'Perez c/ Gomez', fecha_ingreso: '2025-01-15' },
        { id: 2, nro_expediente: 'EXP-002', caratula: 'Lopez s/ Sucesión', fecha_ingreso: '2025-02-20' },
      ]);
    }, 500);
  });
};
export const registerUser = (email, password) => {
  console.log(`MOCK API: Intentando registrar nuevo usuario con email: ${email}`);
  
  return new Promise((resolve) => {
    // Simulamos un retraso de red
    setTimeout(() => {
      // En un backend real, aquí comprobarías si el email ya existe
      // y guardarías el nuevo usuario en la base de datos.
      // Aquí, simplemente asumimos que siempre funciona.
      console.log("MOCK API: Usuario registrado con éxito.");
      
      // Devolvemos un objeto de usuario simulado
      resolve({ id: Date.now(), email: email, rol: 'ABOGADO' });
    }, 1000);
  });
};