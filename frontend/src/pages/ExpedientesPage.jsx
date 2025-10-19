// Contenido para: frontend/src/pages/ExpedientesPage.jsx

import ExpedienteList from '../components/ExpedienteList';
import ExpedienteForm from '../components/ExpedienteForm';

function ExpedientesPage() {
  return (
    <div>
      <h2>Gestión de Expedientes</h2>
      <ExpedienteForm />
      <hr />
      <ExpedienteList />
    </div>
  );
}

export default ExpedientesPage;