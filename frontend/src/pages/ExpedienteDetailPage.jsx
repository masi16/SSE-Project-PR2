import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Breadcrumbs, Divider, List, ListItem, ListItemText } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext'; 

function ExpedienteDetailPage() {
  const { expedienteId } = useParams();
  const { api } = useAuth();

  // Estado para los datos principales y de detalle
  const [expediente, setExpediente] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [abogado, setAbogado] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para buscar el expediente principal
  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/expedientes/${expedienteId}`);
        setExpediente(response.data);
      } catch (err) {
        console.error("Error al obtener el expediente:", err);
        setError(err.message || 'No se pudo cargar el expediente');
        setLoading(false); // Detener la carga si hay error
      }
    };
    fetchExpediente();
  }, [expedienteId, api]);

  // --- INICIO DE LA CORRECCIÓN ---
  // Efecto para buscar los detalles (cliente, abogado, movimientos) UNA VEZ que tenemos el expediente
  useEffect(() => {
    if (!expediente) return;

    const fetchDetails = async () => {
      try {
        // Creamos un array de promesas para ejecutar las llamadas en paralelo
        const promises = [
          api.get(`/clientes/${expediente.fk_cliente_id}`),
          api.get(`/abogados/${expediente.fk_abogado_id}`),
          api.get('/movimientos/') // Obtenemos todos los movimientos
        ];

        // Esperamos a que todas las llamadas terminen
        const [clienteResponse, abogadoResponse, movimientosResponse] = await Promise.all(promises);

        setCliente(clienteResponse.data);
        setAbogado(abogadoResponse.data);

        // Filtramos los movimientos para quedarnos solo con los de este expediente
        const expedienteMovimientos = movimientosResponse.data.filter(
          mov => mov.fk_expediente_id === expediente.id
        );
        setMovimientos(expedienteMovimientos);

      } catch (err) {
        console.error("Error al obtener los detalles adicionales:", err);
        setError("No se pudieron cargar los detalles del cliente o abogado.");
      } finally {
        setLoading(false); // Terminamos la carga cuando todos los datos están listos
      }
    };

    fetchDetails();
  }, [expediente, api]); // Este efecto se dispara cuando 'expediente' cambia

 // En frontend/src/pages/ExpedienteDetailPage.jsx

const generatePdf = () => {
  if (!expediente || !cliente || !abogado) {
    alert("Error: Aún no se han cargado todos los datos para generar el PDF.");
    return;
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 20; // Posición vertical inicial

    // --- TÍTULO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ANÁLISIS DE EXPEDIENTE", pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15; // Aumentar espacio

    // --- FUNCIÓN AUXILIAR PARA ESCRIBIR LÍNEAS DE DATOS ---
    const writeDataLine = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${label}:`, margin, yPosition);
      
      doc.setFont("helvetica", "normal");
      doc.text(value || 'N/A', margin + 45, yPosition); // Alinea el valor
      yPosition += 7; // Espacio entre líneas
    };

    // --- BLOQUE DE DATOS PRINCIPALES ---
    writeDataLine("NÚMERO DE EXPEDIENTE", expediente.nro_expediente);
    writeDataLine("CARÁTULA", expediente.caratula);
    writeDataLine("CLIENTE (DEMANDANTE)", `${cliente.nombre} ${cliente.apellido}`);
    writeDataLine("ABOGADO A CARGO", `${abogado.nombre} ${abogado.apellido} (Mat: ${abogado.matricula})`);
    writeDataLine("FECHA DE INGRESO", new Date(expediente.fecha_ingreso).toLocaleDateString());
    yPosition += 10;

    // --- SECCIÓN DE DETALLES DEL CASO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DETALLES DEL PROCESO", pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PARTES INVOLUCRADAS:", margin, yPosition);
    yPosition += 7;

    doc.setFont("helvetica", "normal");
    const clientText = `El cliente principal en este caso es ${cliente.nombre} ${cliente.apellido}, con correo electrónico de contacto ${cliente.email}.`;
    // Usamos splitTextToSize para que el texto largo se ajuste automáticamente al ancho de la página
    const clientLines = doc.splitTextToSize(clientText, pageWidth - margin * 2);
    doc.text(clientLines, margin, yPosition);
    yPosition += clientLines.length * 5 + 5; // Ajustar Y según el número de líneas

    const lawyerText = `El caso está siendo gestionado por el abogado ${abogado.nombre} ${abogado.apellido}, cuya matrícula profesional es ${abogado.matricula}.`;
    const lawyerLines = doc.splitTextToSize(lawyerText, pageWidth - margin * 2);
    doc.text(lawyerLines, margin, yPosition);
    yPosition += lawyerLines.length * 5 + 10;


    // --- SECCIÓN DE HISTORIAL DE MOVIMIENTOS ---
    if (movimientos.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("HISTORIAL DE MOVIMIENTOS RELEVANTES", pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      movimientos.forEach((mov, index) => {
        // Reiniciamos la fuente para cada movimiento
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        
        const fecha = new Date(mov.fecha_movimiento).toLocaleDateString();
        const header = `${index + 1}. [${fecha}]`;
        doc.text(header, margin, yPosition);
        
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(mov.descripcion || "Sin descripción", pageWidth - margin * 2 - 25); // Dejamos espacio
        doc.text(descLines, margin + 25, yPosition); // Indentamos la descripción
        yPosition += descLines.length * 5 + 5;

        // Comprobamos si nos estamos saliendo de la página para añadir una nueva
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20; // Reiniciamos Y en la nueva página
        }
      });
    }
    
    // --- Guardar el PDF ---
    doc.save(`analisis_expediente_${expediente.nro_expediente || 'sin_numero'}.pdf`);

  } catch (error) {
    console.error("ERROR al generar PDF:", error);
    alert("Hubo un error al generar el PDF. Revisa la consola.");
  }
};
  // --- FIN DE LA CORRECCIÓN ---

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!expediente) return <Typography color="error">No se encontró el expediente.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <RouterLink to="/expedientes" style={{ textDecoration: 'none', color: 'inherit' }}>
          Expedientes
        </RouterLink>
        <Typography color="text.primary">{expediente.nro_expediente}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Expediente: {expediente.nro_expediente}</Typography>
        <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={generatePdf}>Exportar a PDF</Button>
      </Box>
      <Typography variant="h6" color="text.secondary">Carátula: {expediente.caratula}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>Partes Involucradas</Typography>
      {/* Usamos los datos de los estados 'cliente' y 'abogado' */}
      <Typography><strong>Cliente:</strong> {cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cargando...'}</Typography>
      <Typography><strong>Email:</strong> {cliente ? cliente.email : 'Cargando...'}</Typography>
      <Typography><strong>Abogado a Cargo:</strong> {abogado ? `${abogado.nombre} ${abogado.apellido}` : 'Cargando...'}</Typography>
      <Typography><strong>Matrícula:</strong> {abogado ? abogado.matricula : 'Cargando...'}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>Historial de Movimientos</Typography>
      <List>
        {/* Usamos el estado 'movimientos' */}
        {movimientos.length > 0 ? (
          movimientos.map((mov) => (
            <ListItem key={mov.id} disableGutters>
              <ListItemText
                primary={mov.descripcion}
                secondary={`Fecha: ${new Date(mov.fecha_movimiento).toLocaleDateString()}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography color="text.secondary">No hay movimientos para este expediente.</Typography>
        )}
      </List>
    </Paper>
  );
}

export default ExpedienteDetailPage;