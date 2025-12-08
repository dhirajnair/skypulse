import { AstroObject, DataSourceStatus } from '../types';

// Random float in range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate a light curve for visualization
const generateLightCurve = (points = 50) => {
  const data = [];
  for (let i = 0; i < points; i++) {
    data.push({
      time: i,
      flux: 1 + (Math.random() * 0.02 - 0.01) - (i > 20 && i < 30 ? 0.05 : 0) // dip for transit
    });
  }
  return data;
};

export const simulateObjectRetrieval = async (inputName: string, idType: string): Promise<AstroObject> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, random(500, 2000)));

  const isStar = Math.random() > 0.3;
  
  const sources: DataSourceStatus[] = [
    { name: 'SIMBAD', status: 'success' },
    { name: 'VizieR', status: 'success' },
    { name: 'NASA Exoplanet', status: isStar ? 'no-data' : 'success' },
    { name: 'MAST', status: 'success' },
  ];

  return {
    id: crypto.randomUUID(),
    inputName,
    detectedType: idType as any,
    primaryName: inputName.toUpperCase().replace('GAIA', 'Gaia').replace('TIC', 'TIC'),
    objectType: isStar ? 'Main Sequence Star' : 'Exoplanet Host',
    ra: random(0, 360),
    dec: random(-90, 90),
    magnitude: random(8, 16),
    magBand: 'V',
    distance: random(10, 1000),
    spectralType: isStar ? ['G2V', 'M4V', 'K2III'][Math.floor(Math.random() * 3)] : 'K5V',
    temperature: random(3000, 8000),
    mass: random(0.1, 2.0),
    status: 'complete',
    sources: sources,
    tags: isStar ? ['High Proper Motion', 'Gaia DR3'] : ['Transiting Planet', 'TESS Object'],
    lightCurveData: generateLightCurve(),
  };
};