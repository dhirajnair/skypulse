import React, { useState, useCallback, useEffect } from 'react';
import LandingView from './components/Views/LandingView';
import ProcessingView from './components/Views/ProcessingView';
import ResultsView from './components/Views/ResultsView';
import ObjectDetailView from './components/Views/ObjectDetailView';
import StarField from './components/StarField';
import HeaderLogo from './components/HeaderLogo';
import { AstroObject, ViewState } from './types';
import { startQuerySession, getSessionStatus, getSessionResults } from './services/api';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [objects, setObjects] = useState<AstroObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Poll for results when in processing mode
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (view === 'processing' && currentSessionId) {
      const poll = async () => {
        // 1. Get Status
        const session = await getSessionStatus(currentSessionId);
        // 2. Get Real-time Results (so we see progress bars update)
        const currentObjects = await getSessionResults(currentSessionId);
        setObjects(currentObjects);

        // 3. Check for completion
        if (session && (session.status === 'completed' || session.status === 'failed')) {
           // Wait a brief moment for UI transition
           setTimeout(() => {
             setView('results');
           }, 1000);
        }
      };

      interval = setInterval(poll, 1000); // Poll every second
      poll(); // Immediate first call
    }

    return () => clearInterval(interval);
  }, [view, currentSessionId]);


  const startProcessing = useCallback(async (ids: string[]) => {
    // Call the "API" to start the session
    const session = await startQuerySession(ids);
    setCurrentSessionId(session.id);
    setView('processing');
  }, []);

  const handleProcessingComplete = () => {
    // This is now handled by the polling effect
    setView('results');
  };

  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id);
    setView('detail');
  };

  const selectedObject = objects.find(o => o.id === selectedObjectId);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-200 print:text-black print:bg-white print:overflow-visible print:h-auto">
      <div className="print:hidden">
        <StarField />
      </div>
      
      {/* Navigation Bar */}
      <nav className="border-b border-space-800 bg-space-950/80 backdrop-blur-md sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('landing')}
          >
            <HeaderLogo />
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">API Status</span>
            {process.env.API_KEY ? (
               <span className="text-green-500 flex items-center gap-1 text-xs px-2 py-1 bg-green-500/10 rounded-full">
                 ● Gemini Active
               </span>
            ) : (
                <span className="text-slate-600 flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 rounded-full">
                  ○ Demo Mode
                </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="print:w-full print:block">
        {view === 'landing' && <LandingView onSearch={startProcessing} />}
        
        {view === 'processing' && (
          <ProcessingView 
            objects={objects} 
            onComplete={handleProcessingComplete} 
          />
        )}
        
        {view === 'results' && (
          <ResultsView 
            objects={objects} 
            onSelect={handleSelectObject} 
            onBack={() => setView('landing')}
          />
        )}

        {view === 'detail' && selectedObject && (
          <ObjectDetailView 
            object={selectedObject} 
            onBack={() => setView('results')}
          />
        )}
      </main>
    </div>
  );
}

export default App;