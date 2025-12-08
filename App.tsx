import React, { useState, useCallback } from 'react';
import LandingView from './components/Views/LandingView';
import ProcessingView from './components/Views/ProcessingView';
import ResultsView from './components/Views/ResultsView';
import ObjectDetailView from './components/Views/ObjectDetailView';
import StarField from './components/StarField';
import { AstroObject, ViewState, IDType } from './types';
import { simulateObjectRetrieval } from './services/mockDataService';
import { detectIDType } from './constants';
import { Rocket } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [objects, setObjects] = useState<AstroObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const startProcessing = useCallback(async (ids: string[]) => {
    setView('processing');
    
    // Create initial placeholder objects
    const initialObjects: AstroObject[] = ids.map(id => ({
      id: crypto.randomUUID(),
      inputName: id,
      detectedType: detectIDType(id),
      status: 'pending',
      sources: [],
      tags: []
    }));

    setObjects(initialObjects);

    // Simulate processing queue
    // In a real app, this would be a Promise.all or a batch job
    const processedObjects = [...initialObjects];
    
    for (let i = 0; i < processedObjects.length; i++) {
        // Update to 'processing'
        processedObjects[i] = { ...processedObjects[i], status: 'processing' };
        setObjects([...processedObjects]);

        // Simulate API call
        const result = await simulateObjectRetrieval(processedObjects[i].inputName, processedObjects[i].detectedType);
        
        // Update with result
        processedObjects[i] = result;
        setObjects([...processedObjects]);
    }

  }, []);

  const handleProcessingComplete = () => {
    setView('results');
  };

  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id);
    setView('detail');
  };

  const selectedObject = objects.find(o => o.id === selectedObjectId);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-200">
      <StarField />
      
      {/* Navigation Bar */}
      <nav className="border-b border-space-800 bg-space-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-display font-bold text-xl cursor-pointer"
            onClick={() => setView('landing')}
          >
            <div className="bg-accent-purple/20 p-2 rounded-lg">
                <Rocket size={20} className="text-accent-purple" />
            </div>
            <span className="tracking-tight text-white">SkyPulse</span>
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
      <main>
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