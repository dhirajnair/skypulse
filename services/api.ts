import { db } from '../lib/db';
import { AstroObject, QuerySession, IDType } from '../types';
import { startBackgroundJob } from './worker';
import { detectIDType } from '../constants';

// --- POST /api/query/start ---
export const startQuerySession = async (inputIds: string[]): Promise<QuerySession> => {
  const sessionId = crypto.randomUUID();
  const now = new Date().toISOString();

  // 1. Create Session Record
  const session: QuerySession = {
    id: sessionId,
    createdAt: now,
    status: 'pending',
    inputIds: inputIds,
    totalObjects: inputIds.length,
    completedObjects: 0,
  };

  await db.createSession(session);

  // 2. Create Initial Object Records
  const initialObjects: AstroObject[] = inputIds.map(id => ({
    id: crypto.randomUUID(),
    sessionId: sessionId,
    inputName: id,
    detectedType: detectIDType(id),
    status: 'pending',
    sources: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
  }));

  await db.createObjects(initialObjects);

  // 3. Trigger Background Worker (Fire and forget)
  startBackgroundJob(sessionId);

  return session;
};

// --- GET /api/query/:sessionId/status ---
export const getSessionStatus = async (sessionId: string): Promise<QuerySession | null> => {
  return await db.getSession(sessionId);
};

// --- GET /api/query/:sessionId/results ---
export const getSessionResults = async (sessionId: string): Promise<AstroObject[]> => {
  return await db.getObjectsBySession(sessionId);
};

// --- GET /api/object/:id ---
export const getObjectDetails = async (sessionId: string, objectId: string): Promise<AstroObject | undefined> => {
  const results = await db.getObjectsBySession(sessionId);
  return results.find(o => o.id === objectId);
};
