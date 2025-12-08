import React, { useState } from 'react';
import { Search, Upload, FileText, Activity } from 'lucide-react';
import { SAMPLE_IDS } from '../../constants';

interface LandingViewProps {
  onSearch: (ids: string[]) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    if (!input.trim()) return;
    const ids = input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    onSearch(ids);
  };

  const loadExample = () => {
    setInput(SAMPLE_IDS.join('\n'));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-4xl mx-auto text-center animate-fade-in">
      <div className="mb-8 p-4 rounded-full bg-space-900 border border-space-800 shadow-xl shadow-accent-purple/10">
        <Activity className="w-12 h-12 text-accent-cyan" />
      </div>
      
      <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-accent-purple mb-4">
        Discover the Universe
      </h1>
      
      <p className="text-lg text-slate-400 mb-10 max-w-2xl">
        SkyPulse is an intelligent context engine. Enter astronomical object identifiers to instantly gather cross-matched data, physical parameters, and scientific summaries.
      </p>

      <div className="w-full max-w-2xl bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-xl p-2 shadow-2xl">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter object IDs (one per line)&#10;e.g., Gaia DR3 411183..., TIC 261136..."
          className="w-full h-40 bg-transparent text-slate-200 p-4 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-600"
        />
        
        <div className="flex items-center justify-between px-2 py-2 border-t border-space-800/50">
          <div className="flex gap-2">
            <button 
              onClick={loadExample}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-space-800 transition-colors"
            >
              <FileText size={14} /> Load Examples
            </button>
            <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-space-800 transition-colors cursor-not-allowed opacity-50">
              <Upload size={14} /> Upload CSV
            </button>
          </div>
          
          <button
            onClick={handleSearch}
            disabled={!input.trim()}
            className="flex items-center gap-2 bg-accent-purple hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-accent-purple/20"
          >
            <Search size={18} />
            Start Pulse
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex gap-8 text-slate-500 text-sm">
        <span>SIMBAD</span>
        <span>VizieR</span>
        <span>NASA Exoplanet Archive</span>
        <span>MAST</span>
      </div>
    </div>
  );
};

export default LandingView;