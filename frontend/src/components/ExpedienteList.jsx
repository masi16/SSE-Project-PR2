// Contenido FINAL Y CORREGIDO para: frontend/src/pages/ExpedienteDetailPage.jsx

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

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const data = await getExpedienteById(expedienteId);
        setExpediente(data);
      } catch (error) {
        console.error("Error al obtener el detalle del expediente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpediente();
  }, [expedienteId]);

  const generatePdf = () => {
    if (!expediente) {
      alert("Error: No hay datos de expediente para generar el PDF.");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      // Encabezado
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Informe de Expediente", pageWidth / 2, margin + 5, { align: 'center' });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, margin, margin + 15);
      doc.text(`Número de Expediente: ${expediente.nro_expediente || 'N/A'}`, pageWidth - margin, margin + 15, { align: 'right' });
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 20, pageWidth - margin, margin + 20);

      // Extrae datos del cliente de forma segura
      const clienteNombre = expediente.cliente?.nombre || 'No asignado';
      const clienteApellido = expediente.cliente?.apellido || '';
      const clienteEmail = expediente.cliente?.email || 'N/A';
      const clienteCompleto = `${clienteNombre} ${clienteApellido}`.trim();

      // Extrae datos del abogado de forma segura
      const abogadoNombre = expediente.abogado?.nombre || 'No asignado';
      const abogadoApellido = expediente.abogado?.apellido || '';
      const abogadoMatricula = expediente.abogado?.matricula || 'N/A';
      const abogadoCompleto = `${abogadoNombre} ${abogadoApellido}`.trim();

      // Datos Principales
      const datosBody = [
        ['Carátula', expediente.caratula || 'Sin carátula'],
        ['Fecha de Ingreso', expediente.fecha_ingreso ? new Date(expediente.fecha_ingreso).toLocaleDateString() : 'N/A'],
        ['Juzgado', expediente.juzgado || 'No asignado'],
      ];
      
      autoTable(doc, {
        startY: margin + 25,
        head: [['Campo', 'Valor']],
        body: datosBody,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], textColor: 255 },
        bodyStyles: { textColor: 0 },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 'auto' } },
      });

      // Partes Involucradas
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Partes Involucradas']],
        body: [
          ['Cliente', clienteCompleto],
          ['Email Cliente', clienteEmail],
          ['Abogado a Cargo', abogadoCompleto],
          ['Matrícula', abogadoMatricula],
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
      });
      
      // Historial de Movimientos
      if (expediente.movimientos && Array.isArray(expediente.movimientos) && expediente.movimientos.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [['Fecha', 'Descripción del Movimiento']],
          body: expediente.movimientos.map(mov => [
            mov.fecha_movimiento ? new Date(mov.fecha_movimiento).toLocaleDateString() : 'N/A',
            mov.descripcion || 'Sin descripción'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [44, 62, 80] },
        });
      }

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      doc.save(`expediente_${expediente.nro_expediente || 'sin_numero'}.pdf`);

    } catch (error) {
      console.error("ERROR al generar PDF:", error);
      alert("Hubo un error al generar el PDF. Revisa la consola.");
    }
  };

  if (loading) return <CircularProgress />;
  if (!expediente) return <Typography color="error">Error: No se encontró el expediente.</Typography>;

  // Extrae datos con valores por defecto
  const clienteNombre = expediente.cliente?.nombre || 'No disponible';
  const clienteApellido = expediente.cliente?.apellido || '';
  const clienteEmail = expediente.cliente?.email || 'N/A';
  const abogadoNombre = expediente.abogado?.nombre || 'No disponible';
  const abogadoApellido = expediente.abogado?.apellido || '';
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
      <Typography><strong>Cliente:</strong> {clienteNombre} {clienteApellido}</Typography>
      <Typography><strong>Email:</strong> {clienteEmail}</Typography>
      <Typography><strong>Abogado a Cargo:</strong> {abogadoNombre} {abogadoApellido}</Typography>
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