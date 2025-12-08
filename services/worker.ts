import { db } from '../lib/db';
import { AstroObject } from '../types';
import { simulateObjectRetrieval } from './mockDataService';
import { generateObjectSummary } from './geminiService';

// This simulates the backend worker process that handles long-running jobs
export const startBackgroundJob = async (sessionId: string) => {
  console.log(`[Worker] Starting job for session ${sessionId}`);
  
  try {
    const session = await db.getSession(sessionId);
    if (!session) return;

    // Update session status
    await db.updateSession(sessionId, { status: 'processing' });

    // Get all pending objects for this session
    const allObjects = await db.getObjectsBySession(sessionId);
    
    // Process sequentially (or with limited concurrency)
    let completed = 0;

    for (const obj of allObjects) {
      // 1. Update object status to processing
      await db.updateObject(obj.id, { status: 'processing' });

      // 2. FETCH DATA (Simulates querying SIMBAD, VizieR, etc.)
      // In a real app, this would call actual external APIs via the Orchestrator
      const enrichmentData = await simulateObjectRetrieval(obj.inputName, obj.detectedType);
      
      // 3. GENERATE SUMMARY (Simulates Gemini AI Call)
      // We pass the merged object to Gemini
      const mergedObject = { ...obj, ...enrichmentData };
      const summary = await generateObjectSummary(mergedObject);

      // 4. SAVE RESULT
      await db.updateObject(obj.id, {
        ...enrichmentData,
        summaryText: summary,
        status: 'complete'
      });

      // 5. UPDATE SESSION PROGRESS
      completed++;
      await db.updateSession(sessionId, { completedObjects: completed });
    }

    // Finish Job
    await db.updateSession(sessionId, { status: 'completed' });
    console.log(`[Worker] Job finished for session ${sessionId}`);

  } catch (error) {
    console.error('[Worker] Job failed', error);
    await db.updateSession(sessionId, { status: 'failed' });
  }
};
