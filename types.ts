export type ViewState = 'landing' | 'processing' | 'results' | 'detail';

export type IDType = 'gaia' | 'tic' | 'simbad' | 'unknown';

export type ProcessingStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface DataSourceStatus {
  name: 'SIMBAD' | 'VizieR' | 'NASA Exoplanet' | 'MAST';
  status: 'pending' | 'querying' | 'success' | 'failed' | 'no-data';
  timestamp?: string;
}

export interface AstroObject {
  id: string; // UUID
  inputName: string;
  detectedType: IDType;
  primaryName?: string;
  objectType?: string; // e.g., 'Star', 'Exoplanet Candidate', 'Variable'
  ra?: number;
  dec?: number;
  
  // Physics Params
  magnitude?: number;
  magBand?: string;
  distance?: number; // parsecs
  spectralType?: string;
  temperature?: number; // Kelvin
  mass?: number; // Solar masses
  radius?: number; // Solar radii
  
  // Meta
  status: ProcessingStatus;
  sources: DataSourceStatus[];
  summaryText?: string;
  tags: string[];
  
  // Mock Data for visualization
  lightCurveData?: { time: number; flux: number }[];
}

export interface ProcessingSession {
  sessionId: string;
  objects: AstroObject[];
  startTime: number;
  total: number;
  completed: number;
}