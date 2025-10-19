// Contenido CORRECTO para: frontend/src/components/ExpedienteForm.jsx

import { useState } from 'react';
import axios from 'axios';

function ExpedienteForm() {
  // ... (todo el código del useState y la función handleSubmit)
  const [nroExpediente, setNroExpediente] = useState('');
  const [caratula, setCaratula] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [clienteId, setClienteId] = useState(1);
  const [abogadoId, setAbogadoId] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const nuevoExpediente = {
        nro_expediente: nroExpediente,
        caratula: caratula,
        fecha_ingreso: fechaIngreso,
        fk_cliente_id: clienteId,
        fk_abogado_id: abogadoId,
      };

      const response = await axios.post('http://127.0.0.1:8000/expedientes/', nuevoExpediente);
      alert(`Expediente creado con éxito con ID: ${response.data.id}`);
      
    } catch (error) {
      console.error("Hubo un error al crear el expediente:", error);
      alert("Error al crear el expediente. Revisa la consola.");
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Nuevo Expediente</h2>
      <div>
        <label>Número de Expediente:</label>
        <input
          type="text"
          value={nroExpediente}
          onChange={(e) => setNroExpediente(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Carátula:</label>
        <input
          type="text"
          value={caratula}
          onChange={(e) => setCaratula(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Fecha de Ingreso:</label>
        <input
          type="date"
          value={fechaIngreso}
          onChange={(e) => setFechaIngreso(e.target.value)}
          required
        />
      </div>
      <button type="submit">Crear Expediente</button>
    </form>
  );
}

// 👇 ¡ESTA ES LA LÍNEA QUE PROBABLEMENTE FALTA! 👇
export default ExpedienteForm;