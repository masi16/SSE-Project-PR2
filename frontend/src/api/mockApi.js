// Contenido FINAL Y SINCRONIZADO para: frontend/src/api/mockApi.js

import {
  mockSummary, mockActivity, mockConsultations,
  mockExpedientes as originalExpedientes,
  mockClientes as originalClientes
} from './_mockData.js';

let localExpedientes = JSON.parse(JSON.stringify(originalExpedientes));
let localClientes = JSON.parse(JSON.stringify(originalClientes));

// --- Funciones de la API (las de Dashboard y Clientes no cambian) ---
export const getDashboardData = () => { /* ... */ };
export const getClientes = () => { /* ... */ };
export const getClienteById = (id) => { /* ... */ };
export const createCliente = (newClienteData) => { /* ... */ };

// --- Funciones de Expedientes (Aquí están las correcciones) ---

export const getExpedientes = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(localExpedientes), 500);
  });
};

// 👇 ¡FUNCIÓN DE CREACIÓN MEJORADA! 👇
export const createExpediente = (newExpedienteData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ahora, al crear, construimos el objeto con la estructura detallada
      const newExpediente = {
        id: Date.now(),
        nro_expediente: newExpedienteData.nro_expediente,
        caratula: newExpedienteData.caratula,
        fecha_ingreso: newExpedienteData.fecha_ingreso || new Date().toISOString().split('T')[0],
        juzgado: 'Juzgado a asignar', // Mantenemos los placeholders simples
        
        // Creamos objetos anidados falsos para que la estructura sea consistente
        cliente: { id: 999, nombre: 'Nuevo', apellido: 'Cliente', email: 'N/A' },
        abogado: { id: 999, nombre: 'Abogado', apellido: 'Actual', matricula: 'N/A' },
        movimientos: [], // Un nuevo expediente empieza sin movimientos
      };
      
      localExpedientes = [...localExpedientes, newExpediente];
      resolve(newExpediente);
    }, 1000);
  });
};


// 👇 ¡FUNCIÓN DE DETALLE SIMPLIFICADA! 👇
export const getExpedienteById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Ahora solo necesitamos buscar en la lista, porque todos los expedientes
      // (tanto los originales como los nuevos) ya tienen la estructura correcta.
      const expediente = localExpedientes.find(exp => exp.id === parseInt(id));
      
      if (expediente) {
        // Para que los datos se vean más ricos, nos aseguramos de que tenga movimientos
        if (!expediente.movimientos || expediente.movimientos.length === 0) {
            expediente.movimientos = [
                { id: 1001, fecha_movimiento: '2025-05-10', descripcion: 'Presentación de escrito inicial.' },
                { id: 1002, fecha_movimiento: '2025-06-15', descripcion: 'Se corre traslado a la contraparte.' },
            ];
        }
        resolve(expediente);
      } else {
        reject(new Error("Expediente no encontrado"));
      }
    }, 400);
  });
};