/**
 * Экспорт функции для различных форматов
 */

export function exportToCSV(
  data: Record<string, any>[],
  filename: string = 'export.csv'
) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
}

export async function exportToExcel(
  data: Record<string, any>[],
  filename: string = 'export.xlsx'
) {
  try {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Failed to export to Excel');
  }
}

export async function exportToPDF(
  data: Record<string, any>[],
  title: string = 'Report',
  filename: string = 'export.pdf'
) {
  try {
    const PDFDocument = (await import('pdfkit')).default;
    
    const doc = new PDFDocument({ size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const blob = new Blob([Buffer.concat(chunks)], { type: 'application/pdf' });
      downloadFile(blob, filename, 'application/pdf');
    });

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text(title, 50, 50);
    doc.fontSize(10).font('Helvetica').text(new Date().toLocaleDateString('ru-RU'), 50, 80);

    // Table
    let y = 120;
    const headers = Object.keys(data[0] || {});
    const colWidth = (595 - 100) / headers.length;

    // Header row
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#333');
    headers.forEach((header, i) => {
      doc.text(header, 50 + i * colWidth, y, { width: colWidth, align: 'left', ellipsis: true });
    });

    y += 20;
    doc.strokeColor('#ddd').moveTo(50, y).lineTo(545, y).stroke();
    y += 10;

    // Data rows
    doc.font('Helvetica').fillColor('#000');
    data.forEach((row, rowIndex) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      headers.forEach((header, colIndex) => {
        const value = String(row[header] ?? '');
        doc.fontSize(8).text(value, 50 + colIndex * colWidth, y, {
          width: colWidth,
          align: 'left',
          ellipsis: true,
        });
      });

      y += 15;

      if (rowIndex < data.length - 1) {
        doc.strokeColor('#f0f0f0').moveTo(50, y).lineTo(545, y).stroke();
        y += 5;
      }
    });

    doc.end();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export to PDF');
  }
}

function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = typeof content === 'string' 
    ? new Blob([content], { type: mimeType })
    : content;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
