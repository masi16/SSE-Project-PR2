// Contenido CORRECTO para: frontend/src/api/_mockData.js

// 👇 Asegúrate de que "export" esté aquí
export const mockSummary = {
  active_cases: 23,
  today_consultations: 3,
  pending_tasks: 8,
};

// 👇 Y aquí...
export const mockActivity = [
  { id: 1, expediente_caratula: "Perez, Juan c/ Seguros S.A.", descripcion: "Se presentó escrito de contestación.", fecha_movimiento: "2025-10-20T10:00:00Z" },
  { id: 2, expediente_caratula: "Lopez, Maria s/ Sucesión", descripcion: "Resolución: se aprueba inventario.", fecha_movimiento: "2025-10-20T09:30:00Z" },
  { id: 3, expediente_caratula: "Gomez, Carlos c/ Banco Nacional", descripcion: "Nueva notificación recibida.", fecha_movimiento: "2025-10-19T15:45:00Z" },
  { id: 4, expediente_caratula: "Perez, Juan c/ Seguros S.A.", descripcion: "Cliente envió documentación adjunta.", fecha_movimiento: "2025-10-18T11:00:00Z" },
];

// 👇 ...y también aquí.
export const mockConsultations = [
  { id: 1, tema_consulta: "Revisión de contrato de alquiler", cliente_nombre: "Ana Garcia", fecha_consulta: "2025-10-21T14:00:00Z" },
  { id: 2, tema_consulta: "Firma de poder judicial", cliente_nombre: "Roberto Diaz", fecha_consulta: "2025-10-22T10:30:00Z" },
  { id: 3, tema_consulta: "Consulta sobre despido", cliente_nombre: "Laura Fernandez", fecha_consulta: "2025-10-24T16:00:00Z" },
];