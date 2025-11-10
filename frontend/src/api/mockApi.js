// Contenido FINAL Y SINCRONIZADO para: frontend/src/api/mockApi.js

import {
  mockSummary, mockActivity, mockConsultations,
  mockExpedientes as originalExpedientes,
  mockClientes as originalClientes
} from './_mockData.js';

let localExpedientes = JSON.parse(JSON.stringify(originalExpedientes));
let localClientes = JSON.parse(JSON.stringify(originalClientes));

// --- Funciones de la API (las que no cambian) ---

export const getDashboardData = () => {
  return new Promise((resolve) => setTimeout(() => resolve({ summary: mockSummary, activity: mockActivity, consultations: mockConsultations }), 800));
};

export const getExpedientes = () => {
  return new Promise((resolve) => setTimeout(() => resolve(localExpedientes), 500));
};

export const createExpediente = (newExpedienteData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpediente = {
        id: Date.now(),
        ...newExpedienteData,
        juzgado: 'Juzgado a asignar',
        cliente: { id: 999, nombre: 'Nuevo', apellido: 'Cliente', email: 'N/A' },
        abogado: { id: 999, nombre: 'Abogado', apellido: 'Actual', matricula: 'N/A' },
        movimientos: [],
      };
      localExpedientes = [...localExpedientes, newExpediente];
      resolve(newExpediente);
    }, 1000);
  });
};

export const getClientes = () => {
  return new Promise((resolve) => setTimeout(() => resolve(localClientes), 300));
};

// ... (otras funciones de cliente si las tienes)

// ======================================================================
// 👇 ¡ESTA ES LA FUNCIÓN CLAVE QUE ARREGLA EL PDF! 👇
// ======================================================================
export const getExpedienteById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. Buscamos el expediente base en nuestra lista local
      const expedienteBase = localExpedientes.find(exp => exp.id === parseInt(id));
      
      if (expedienteBase) {
        // 2. Simulamos la respuesta detallada del backend ANIDANDO los datos
        const expedienteDetallado = {
          ...expedienteBase, // Incluye id, nro_expediente, caratula, etc. que ya son correctos
          
          // Anidamos el objeto completo del cliente (si ya es un objeto, lo usamos)
          cliente: typeof expedienteBase.cliente === 'object' ? expedienteBase.cliente : (localClientes.find(c => c.nombre === expedienteBase.cliente) || { id: 999, nombre: 'Cliente', apellido: 'Desconocido', email: 'N/A' }),
          
          // Anidamos el objeto completo del abogado (si ya es un objeto, lo usamos)
          abogado: typeof expedienteBase.abogado === 'object' ? expedienteBase.abogado : { id: 202, nombre: 'Dr.', apellido: 'Pérez', matricula: 'T123F45' },
          
          // Nos aseguramos de que siempre haya una lista de movimientos
          movimientos: expedienteBase.movimientos || [
            { id: 1001, fecha_movimiento: '2025-05-10', descripcion: 'Presentación de escrito inicial.' },
            { id: 1002, fecha_movimiento: '2025-06-15', descripcion: 'Se corre traslado a la contraparte.' },
          ],
        };
        
        // 3. Devolvemos el objeto completo y detallado
        resolve(expedienteDetallado);
      } else {
        reject(new Error("Expediente no encontrado"));
      }
    }, 400);
  });
};  