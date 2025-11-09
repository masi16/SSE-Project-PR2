// Contenido COMPLETO Y ACTUALIZADO para: frontend/src/api/_mockData.js

export const mockSummary = {
  active_cases: 23,
  today_consultations: 3,
  pending_tasks: 8,
};

export const mockActivity = [
  { id: 1, expediente_caratula: "Perez, Juan c/ Seguros S.A.", descripcion: "Se presentó escrito de contestación.", fecha_movimiento: "2025-10-20T10:00:00Z" },
  { id: 2, expediente_caratula: "Lopez, Maria s/ Sucesión", descripcion: "Resolución: se aprueba inventario.", fecha_movimiento: "2025-10-20T09:30:00Z" },
];

export const mockConsultations = [
  { id: 1, tema_consulta: "Revisión de contrato de alquiler", cliente_nombre: "Ana Garcia", fecha_consulta: "2025-10-21T14:00:00Z" },
];

export const mockExpedientes = [
  { id: 1, nro_expediente: 'EXP-2025-001', caratula: 'GOMEZ, JUAN C/ ESTADO NACIONAL S/ DAÑOS', fecha_ingreso: '2025-01-15', juzgado: 'Juzgado Civil N°10', abogado: 'Dr. Pérez', cliente: 'Juan Gomez' },
  { id: 2, nro_expediente: 'EXP-2025-002', caratula: 'PEREZ, MARIA S/ SUCESION AB INTESTATO', fecha_ingreso: '2025-02-20', juzgado: 'Juzgado de Familia N°2', abogado: 'Dra. López', cliente: 'Maria Perez' },
  { id: 3, nro_expediente: 'EXP-2025-003', caratula: 'LOPEZ, CARLOS C/ LA SEGUNDA SEGUROS S/ COBRO DE PESOS', fecha_ingreso: '2025-03-10', juzgado: 'Juzgado Comercial N°5', abogado: 'Dr. García', cliente: 'Carlos Lopez' },
];

// ======================================================================
// 👇 ¡ESTA ES LA LISTA QUE FALTABA! 👇
// ======================================================================
export const mockClientes = [
  { id: 101, nombre: 'Juan', apellido: 'Gomez', email: 'juan.gomez@email.com', telefono: '+54 9 11 1234-5678' },
  { id: 102, nombre: 'Maria', apellido: 'Perez', email: 'maria.p@email.com', telefono: '+54 9 351 8765-4321' },
  { id: 103, nombre: 'Carlos', apellido: 'Lopez', email: 'c.lopez@email.com', telefono: '+54 9 261 4567-8901' },
  { id: 104, nombre: 'Ana', apellido: 'Garcia', email: 'ana.garcia@email.com', telefono: '+54 9 221 1098-7654' },
];