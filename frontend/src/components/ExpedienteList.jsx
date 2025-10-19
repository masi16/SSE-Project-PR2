import { useState, useEffect } from 'react';
import axios from 'axios';

function ExpedienteList() {
  // Estado para guardar la lista de expedientes
  const [expedientes, setExpedientes] = useState([]);
  // Estado para saber si estamos cargando los datos
  const [loading, setLoading] = useState(true);
  // Estado para guardar cualquier error
  const [error, setError] = useState(null);

  // useEffect se ejecuta cuando el componente se monta por primera vez
  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        // ¡LA PARTE CLAVE! Hacemos una petición GET a nuestro backend
        // Tu backend FastAPI corre en el puerto 8000
        const response = await axios.get('http://127.0.0.1:8000/expedientes');
        setExpedientes(response.data); // Guardamos los datos en el estado
      } catch (err) {
        setError(err); // Si hay un error, lo guardamos
      } finally {
        setLoading(false); // Terminamos de cargar
      }
    };

    fetchExpedientes();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  if (loading) return <p>Cargando expedientes...</p>;
  if (error) return <p>Error al cargar los datos: {error.message}</p>;

  return (
    <div>
      <h1>Lista de Expedientes</h1>
      <ul>
        {/* Hacemos un bucle sobre la lista de expedientes y los mostramos */}
        {expedientes.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.nro_expediente}</strong>: {exp.caratula}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpedienteList;