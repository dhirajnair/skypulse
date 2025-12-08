import React, { useState } from 'react';
import { AstroObject } from '../../types';
import { ArrowLeft, Database, Zap, Star, Code, FileJson, Printer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SkyMapViz from '../SkyMapViz';
import { generateObjectSummary } from '../../services/geminiService';
import { exportToJSON } from '../../services/exportService';

interface ObjectDetailViewProps {
  object: AstroObject;
  onBack: () => void;
}

const ObjectDetailView: React.FC<ObjectDetailViewProps> = ({ object, onBack }) => {
  const [summary, setSummary] = useState<string | null>(object.summaryText || null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const text = await generateObjectSummary(object);
    setSummary(text);
    setLoadingSummary(false);
  };

  const handleDownloadJSON = () => {
    exportToJSON(object, `skypulse_${object.primaryName?.replace(/\s+/g, '_')}_data.json`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto pt-6 px-4 pb-20 print:pt-0 print:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="mt-1 p-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">{object.primaryName}</h1>
            <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 rounded-md font-medium">
                    {object.objectType}
                </span>
                {object.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-space-800 text-slate-400 border border-space-700 rounded-md">
                        {tag}
                    </span>
                ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 bg-space-800 hover:bg-space-700 text-white rounded-lg text-sm border border-space-700 transition-colors"
          >
            <FileJson size={16} /> JSON
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-accent-cyan hover:bg-cyan-600 text-black font-medium rounded-lg text-sm shadow-lg shadow-cyan-500/20 transition-colors"
          >
            <Printer size={16} /> Print PDF
          </button>
        </div>
      </div>
      
      {/* Print-only Header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-3xl font-bold text-black">{object.primaryName}</h1>
        <p className="text-gray-600">SkyPulse Report - {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visuals */}
        <div className="space-y-6">
            {/* Sky Map Card */}
            <div className="bg-space-900 border border-space-800 rounded-xl p-6 shadow-xl print:border-gray-300 print:bg-white print:text-black">
                <h3 className="text-sm font-bold text-slate-400 print:text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Star size={16} /> Celestial Position
                </h3>
                <SkyMapViz ra={object.ra || 0} dec={object.dec || 0} />
                <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div className="bg-space-950 p-2 rounded border border-space-800 print:bg-gray-100 print:border-gray-200">
                        <div className="text-xs text-slate-500 mb-1">RA</div>
                        <div className="font-mono text-accent-gold print:text-black">{object.ra?.toFixed(5)}°</div>
                    </div>
                    <div className="bg-space-950 p-2 rounded border border-space-800 print:bg-gray-100 print:border-gray-200">
                        <div className="text-xs text-slate-500 mb-1">DEC</div>
                        <div className="font-mono text-accent-gold print:text-black">{object.dec?.toFixed(5)}°</div>
                    </div>
                </div>
            </div>

            {/* AI Summary Card */}
            <div className="bg-space-900 border border-space-800 rounded-xl p-6 shadow-xl relative overflow-hidden group print:border-gray-300 print:bg-white">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-purple to-accent-cyan print:hidden" />
                <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-accent-gold print:text-black" /> Intelligent Summary
                </h3>
                
                {!summary && !loadingSummary && (
                   <div className="text-center py-6 print:hidden">
                      <p className="text-slate-400 text-sm mb-4">Generate a consolidated scientific summary using Gemini AI.</p>
                      <button 
                        onClick={handleGenerateSummary}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm border border-white/10 transition-colors backdrop-blur-sm"
                      >
                        Generate Summary
                      </button>
                   </div>
                )}

                {loadingSummary && (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-space-800 rounded w-full"></div>
                        <div className="h-4 bg-space-800 rounded w-5/6"></div>
                        <div className="h-4 bg-space-800 rounded w-4/6"></div>
                    </div>
                )}

                {summary && (
                    <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed print:text-black">
                        {summary}
                    </div>
                )}
            </div>
        </div>

        {/* Center/Right: Data */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Key Parameters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Distance', value: object.distance ? `${object.distance.toFixed(1)} pc` : 'N/A' },
                    { label: 'Magnitude', value: object.magnitude?.toFixed(2) || 'N/A' },
                    { label: 'Spectral Type', value: object.spectralType || 'N/A' },
                    { label: 'Temperature', value: object.temperature ? `${Math.round(object.temperature)} K` : 'N/A' },
                ].map((item) => (
                    <div key={item.label} className="bg-space-900 border border-space-800 p-4 rounded-xl hover:border-space-700 transition-colors print:bg-white print:border-gray-300 print:text-black">
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{item.label}</div>
                        <div className="text-xl font-display font-medium text-white print:text-black">{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Light Curve Chart */}
            <div className="bg-space-900 border border-space-800 rounded-xl p-6 shadow-xl print:bg-white print:border-gray-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-400 print:text-gray-600 uppercase tracking-wider">
                        Flux Time Series (Normalized)
                    </h3>
                    <div className="text-xs px-2 py-1 bg-space-950 rounded border border-space-800 text-slate-500 print:bg-gray-100 print:border-gray-200">
                        SOURCE: TESS
                    </div>
                </div>
                
                {object.lightCurveData && object.lightCurveData.length > 0 ? (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={object.lightCurveData}>
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#475569" 
                                    tick={{fontSize: 12}} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    stroke="#475569" 
                                    tick={{fontSize: 12}}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#F59E0B' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="flux" 
                                    stroke="#F59E0B" 
                                    strokeWidth={2} 
                                    dot={false} 
                                    activeDot={{ r: 4, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                     <div className="h-64 w-full flex items-center justify-center text-slate-500 text-sm italic">
                        No light curve data available for this object.
                     </div>
                )}
            </div>

            {/* Data Sources */}
            <div className="bg-space-900 border border-space-800 rounded-xl p-6 print:bg-white print:border-gray-300">
                <h3 className="text-sm font-bold text-slate-400 print:text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Database size={16} /> Data Provenance
                </h3>
                <div className="space-y-3">
                    {object.sources.map(source => (
                        <div key={source.sourceName} className="flex items-center justify-between p-3 bg-space-950 rounded-lg border border-space-800 print:bg-gray-50 print:border-gray-200">
                            <span className="text-sm font-medium text-slate-300 print:text-black">{source.sourceName}</span>
                            <div className="flex items-center gap-2">
                                {source.status === 'success' && <span className="w-2 h-2 rounded-full bg-green-500" />}
                                {source.status === 'failed' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                                {source.status === 'no-data' && <span className="w-2 h-2 rounded-full bg-slate-600" />}
                                <span className="text-xs text-slate-500 uppercase">{source.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Raw Data Accordion */}
            <div className="print:hidden">
              <details className="group bg-space-900 border border-space-800 rounded-xl overflow-hidden">
                <summary className="flex items-center gap-2 p-4 cursor-pointer hover:bg-space-800 transition-colors text-slate-400 font-medium">
                  <Code size={16} /> Raw Data Payload
                  <span className="ml-auto text-xs text-slate-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 bg-space-950/50 border-t border-space-800 overflow-auto max-h-96">
                  <pre className="text-xs font-mono text-slate-400 whitespace-pre-wrap">
                    {JSON.stringify(object, (key, value) => {
                       if (key === 'lightCurveData') return '[Array of ' + value.length + ' points]';
                       return value;
                    }, 2)}
                  </pre>
                </div>
              </details>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ObjectDetailView;