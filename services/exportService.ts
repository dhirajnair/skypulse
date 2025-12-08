import { AstroObject } from '../types';

export const triggerDownload = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: AstroObject | AstroObject[], filename: string) => {
  const content = JSON.stringify(data, null, 2);
  triggerDownload(content, filename, 'application/json');
};

export const exportToCSV = (objects: AstroObject[], filename: string) => {
  if (objects.length === 0) return;

  // Define columns
  const columns = [
    { header: 'ID', accessor: (o: AstroObject) => o.id },
    { header: 'Input Name', accessor: (o: AstroObject) => o.inputName },
    { header: 'Primary Name', accessor: (o: AstroObject) => o.primaryName || '' },
    { header: 'Type', accessor: (o: AstroObject) => o.objectType || '' },
    { header: 'RA', accessor: (o: AstroObject) => o.ra?.toFixed(6) || '' },
    { header: 'Dec', accessor: (o: AstroObject) => o.dec?.toFixed(6) || '' },
    { header: 'Magnitude', accessor: (o: AstroObject) => o.magnitude?.toString() || '' },
    { header: 'Band', accessor: (o: AstroObject) => o.magBand || '' },
    { header: 'Distance (pc)', accessor: (o: AstroObject) => o.distance?.toString() || '' },
    { header: 'Spectral Type', accessor: (o: AstroObject) => o.spectralType || '' },
    { header: 'Temperature (K)', accessor: (o: AstroObject) => o.temperature?.toString() || '' },
    { header: 'Tags', accessor: (o: AstroObject) => o.tags.join('; ') },
    { header: 'Sources', accessor: (o: AstroObject) => o.sources.map(s => s.sourceName).join('; ') },
  ];

  // Generate Header Row
  const headerRow = columns.map(c => `"${c.header}"`).join(',');

  // Generate Data Rows
  const rows = objects.map(obj => {
    return columns.map(col => {
      const value = col.accessor(obj).replace(/"/g, '""'); // Escape quotes
      return `"${value}"`;
    }).join(',');
  });

  const content = [headerRow, ...rows].join('\n');
  triggerDownload(content, filename, 'text/csv');
};