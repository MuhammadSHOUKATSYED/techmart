'use client';

import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ExportButtonsProps = {
  data: any[];
  columns: { label: string; key: string }[];
  filename: string;
};

export default function ExportButtons({ data, columns, filename }: ExportButtonsProps) {
  const exportCSV = () => {
    const csvRows = [];

    // Add headers
    csvRows.push(columns.map(col => col.label).join(','));

    // Add rows
    data.forEach(row => {
      const values = columns.map(col => {
        const val = row[col.key];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.label);
    const tableRows = data.map(row => columns.map(col => row[col.key]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [100, 149, 237] },
      margin: { top: 20 },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={exportCSV}
        className="px-4 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
      >
        Export CSV
      </button>
      <button
        onClick={exportPDF}
        className="px-4 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
      >
        Export PDF
      </button>
    </div>
  );
}
