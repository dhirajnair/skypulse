export type ViewState = 'landing' | 'processing' | 'results' | 'detail';

export type IDType = 'gaia' | 'tic' | 'simbad' | 'unknown';

export type ProcessingStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface DataSourceResult {
  sourceName: 'SIMBAD' | 'VizieR' | 'NASA Exoplanet' | 'MAST';
  status: 'pending' | 'querying' | 'success' | 'failed' | 'no-data';
  timestamp?: string;
  data?: any; // Raw JSON response
}

// Matches Entity: AstronomicalObject
export interface AstroObject {
  id: string; // UUID
  sessionId: string; // FK to QuerySession
  inputName: string;
  detectedType: IDType;
  primaryName?: string;
  objectType?: string; 
  ra?: number;
  dec?: number;
  
  // Physics Params
  magnitude?: number;
  magBand?: string;
  distance?: number; // parsecs
  spectralType?: string;
  temperature?: number; // Kelvin
  mass?: number; 
  radius?: number;
  
  // Meta
  status: ProcessingStatus;
  sources: DataSourceResult[]; // Stored as JSONB in real DB
  summaryText?: string;
  tags: string[];
  
  // Visualization Data (computed or retrieved)
  lightCurveData?: { time: number; flux: number }[];
  
  createdAt: string;
  updatedAt: string;
}

// Matches Entity: QuerySession
export interface QuerySession {
  id: string; // UUID
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputIds: string[]; // Stored as array
  totalObjects: number;
  completedObjects: number;
}
