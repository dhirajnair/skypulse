import React, { useEffect } from 'react';
import { AstroObject } from '../../types';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface ProcessingViewProps {
  objects: AstroObject[];
  onComplete: () => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ objects, onComplete }) => {
  const completedCount = objects.filter(o => o.status === 'complete' || o.status === 'failed').length;
  const progress = (completedCount / objects.length) * 100;

  useEffect(() => {
    if (completedCount === objects.length && objects.length > 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [completedCount, objects.length, onComplete]);

  return (
    <div className="max-w-3xl mx-auto pt-20 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Processing Data Streams</h2>
        <p className="text-slate-400">Querying astronomical databases and normalizing metadata...</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-space-800 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-accent-cyan h-2 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="bg-space-900/50 border border-space-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-space-900 border-b border-space-800 flex justify-between items-center">
          <span className="font-mono text-sm text-slate-400">SESSION ID: {crypto.randomUUID().slice(0, 8)}</span>
          <span className="text-xs font-medium px-2 py-1 bg-space-800 rounded text-accent-cyan">
            {completedCount}/{objects.length} OBJECTS
          </span>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
          {objects.map((obj) => (
            <div key={obj.id} className="flex items-center justify-between p-3 rounded-lg bg-space-950/50 border border-space-800/50">
              <div className="flex items-center gap-3">
                {obj.status === 'pending' && <Circle size={18} className="text-slate-600" />}
                {obj.status === 'processing' && <Loader2 size={18} className="text-accent-gold animate-spin" />}
                {obj.status === 'complete' && <CheckCircle2 size={18} className="text-green-500" />}
                
                <div>
                  <div className="font-mono text-sm text-slate-200">{obj.inputName}</div>
                  <div className="text-xs text-slate-500 capitalize">{obj.detectedType} ID Detected</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                 {obj.status === 'processing' && (
                   <span className="text-xs text-accent-gold animate-pulse">Querying SIMBAD...</span>
                 )}
                 {obj.status === 'complete' && (
                   <span className="text-xs text-slate-400">Done</span>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;