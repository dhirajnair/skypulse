import { QuerySession, AstroObject } from '../types';

const DB_KEYS = {
  SESSIONS: 'skypulse_sessions',
  OBJECTS: 'skypulse_objects',
};

// Helper to simulate DB latency
const dbDelay = () => new Promise(resolve => setTimeout(resolve, 50));

class LocalDatabase {
  private getTable<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveTable<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Session Methods ---

  async createSession(session: QuerySession): Promise<QuerySession> {
    await dbDelay();
    const sessions = this.getTable<QuerySession>(DB_KEYS.SESSIONS);
    sessions.push(session);
    this.saveTable(DB_KEYS.SESSIONS, sessions);
    return session;
  }

  async getSession(id: string): Promise<QuerySession | null> {
    await dbDelay();
    const sessions = this.getTable<QuerySession>(DB_KEYS.SESSIONS);
    return sessions.find(s => s.id === id) || null;
  }

  async updateSession(id: string, updates: Partial<QuerySession>): Promise<void> {
    await dbDelay();
    const sessions = this.getTable<QuerySession>(DB_KEYS.SESSIONS);
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.saveTable(DB_KEYS.SESSIONS, sessions);
    }
  }

  // --- Object Methods ---

  async createObjects(objects: AstroObject[]): Promise<void> {
    await dbDelay();
    const current = this.getTable<AstroObject>(DB_KEYS.OBJECTS);
    this.saveTable(DB_KEYS.OBJECTS, [...current, ...objects]);
  }

  async getObjectsBySession(sessionId: string): Promise<AstroObject[]> {
    await dbDelay();
    const objects = this.getTable<AstroObject>(DB_KEYS.OBJECTS);
    return objects.filter(o => o.sessionId === sessionId);
  }

  async updateObject(id: string, updates: Partial<AstroObject>): Promise<void> {
    // Note: No delay here to keep UI snappy during rapid updates
    const objects = this.getTable<AstroObject>(DB_KEYS.OBJECTS);
    const index = objects.findIndex(o => o.id === id);
    if (index !== -1) {
      objects[index] = { ...objects[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveTable(DB_KEYS.OBJECTS, objects);
    }
  }
}

export const db = new LocalDatabase();
