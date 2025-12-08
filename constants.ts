import { AstroObject, IDType } from './types';

export const SAMPLE_IDS = [
  "Gaia DR3 4111834567779557376",
  "TIC 261136679",
  "Proxima Centauri",
  "TRAPPIST-1",
  "HD 209458"
];

export const MOCK_SUMMARY_TEMPLATES = [
  "is a high-proper-motion star located in the constellation of Centaurus. It is a red dwarf of spectral type M5.5Ve and is the closest known star to the Sun.",
  "is an ultra-cool dwarf star in the constellation Aquarius. It is known for hosting a system of seven temperate terrestrial planets.",
  "is a hot Jupiter exoplanetary system. The host star is a G-type main-sequence star located approximately 150 light-years away.",
];

// Helper to detect ID type
export const detectIDType = (input: string): IDType => {
  const normalized = input.trim().toLowerCase();
  if (normalized.startsWith('gaia')) return 'gaia';
  if (normalized.startsWith('tic')) return 'tic';
  if (normalized.startsWith('kic') || normalized.startsWith('koi')) return 'simbad'; // Simplification
  // Basic heuristic for names
  if (normalized.length > 0 && !normalized.match(/\d{5,}/)) return 'simbad';
  return 'unknown';
};
