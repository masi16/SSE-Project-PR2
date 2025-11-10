// Contenido SIMPLIFICADO Y DEBUGGEADO para: frontend/src/pages/ExpedienteDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Breadcrumbs, Divider, List, ListItem, ListItemText } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { getExpedienteById } from '../api/mockApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ExpedienteDetailPage() {
  const { expedienteId } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        console.log('🔍 Buscando expediente con ID:', expedienteId);
        const data = await getExpedienteById(expedienteId);
        console.log('✅ Datos recibidos:', data);
        setExpediente(data);
      } catch (err) {
        console.error("❌ Error al obtener el expediente:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpediente();
  }, [expedienteId]);

  const generatePdf = () => {
    console.log('📄 Generando PDF con datos:', expediente);

    if (!expediente) {
      alert("Error: No hay datos de expediente para generar el PDF.");
      return;
    }

    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // ===== TÍTULO =====
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("INFORME DE EXPEDIENTE", 105, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, yPosition);
      doc.text(`Expediente: ${expediente.nro_expediente || 'N/A'}`, 120, yPosition);
      
      yPosition += 15;
      doc.line(20, yPosition, 190, yPosition);

      // ===== DATOS PRINCIPALES =====
      yPosition += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("DATOS PRINCIPALES", 20, yPosition);
      
      yPosition += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      doc.text(`Número: ${expediente.nro_expediente || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Carátula: ${expediente.caratula || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Juzgado: ${expediente.juzgado || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Fecha de Ingreso: ${expediente.fecha_ingreso ? new Date(expediente.fecha_ingreso).toLocaleDateString() : 'N/A'}`, 20, yPosition);

      // ===== PARTES INVOLUCRADAS =====
      yPosition += 12;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PARTES INVOLUCRADAS", 20, yPosition);
      
      yPosition += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      const clienteNombre = `${expediente.cliente?.nombre || 'N/A'} ${expediente.cliente?.apellido || ''}`.trim();
      const clienteEmail = expediente.cliente?.email || 'N/A';
      const abogadoNombre = `${expediente.abogado?.nombre || 'N/A'} ${expediente.abogado?.apellido || ''}`.trim();
      const abogadoMatricula = expediente.abogado?.matricula || 'N/A';

      doc.text(`Cliente: ${clienteNombre}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Email: ${clienteEmail}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Abogado: ${abogadoNombre}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Matrícula: ${abogadoMatricula}`, 20, yPosition);

      // ===== MOVIMIENTOS =====
      yPosition += 12;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("HISTORIAL DE MOVIMIENTOS", 20, yPosition);
      
      yPosition += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      if (expediente.movimientos && Array.isArray(expediente.movimientos)) {
        expediente.movimientos.forEach((mov, index) => {
          const fecha = mov.fecha_movimiento ? new Date(mov.fecha_movimiento).toLocaleDateString() : 'N/A';
          const desc = mov.descripcion || 'N/A';
          
          doc.text(`${index + 1}. [${fecha}] ${desc}`, 25, yPosition);
          yPosition += 6;
        });
      }

      // ===== GUARDAR PDF =====
      doc.save(`expediente_${expediente.nro_expediente || 'sin_numero'}.pdf`);
      console.log('✅ PDF generado correctamente');

    } catch (error) {
      console.error("❌ ERROR AL GENERAR PDF:", error);
      alert("Error al generar PDF: " + error.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!expediente) return <Typography color="error">Error: No se encontró el expediente.</Typography>;

  const clienteNombre = `${expediente.cliente?.nombre || 'N/A'} ${expediente.cliente?.apellido || ''}`.trim();
  const clienteEmail = expediente.cliente?.email || 'N/A';
  const abogadoNombre = `${expediente.abogado?.nombre || 'N/A'} ${expediente.abogado?.apellido || ''}`.trim();
  const abogadoMatricula = expediente.abogado?.matricula || 'N/A';

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
      <Typography><strong>Cliente:</strong> {clienteNombre}</Typography>
      <Typography><strong>Email:</strong> {clienteEmail}</Typography>
      <Typography><strong>Abogado a Cargo:</strong> {abogadoNombre}</Typography>
      <Typography><strong>Matrícula:</strong> {abogadoMatricula}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>Historial de Movimientos</Typography>
      <List>
        {expediente.movimientos?.map((mov) => (
          <ListItem key={mov.id} disableGutters>
            <ListItemText
              primary={mov.descripcion}
              secondary={`Fecha: ${new Date(mov.fecha_movimiento).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ExpedienteDetailPage;