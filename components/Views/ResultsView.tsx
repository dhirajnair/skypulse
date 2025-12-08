import React, { useState, useMemo } from 'react';
import { AstroObject } from '../../types';
import { ArrowRight, Download, Filter, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { exportToCSV } from '../../services/exportService';

interface ResultsViewProps {
  objects: AstroObject[];
  onSelect: (id: string) => void;
  onBack: () => void;
}

type SortKey = 'primaryName' | 'objectType' | 'magnitude' | 'distance';
type SortDirection = 'asc' | 'desc';

const ResultsView: React.FC<ResultsViewProps> = ({ objects, onSelect, onBack }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'primaryName',
    direction: 'asc'
  });

  // Toggle selection for a single row
  const toggleSelect = (id: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (selectedIds.size === objects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(objects.map(o => o.id)));
    }
  };

  // Handle Sort
  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and Sort Data
  const processedObjects = useMemo(() => {
    let filtered = objects;
    
    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      filtered = filtered.filter(obj => 
        (obj.primaryName?.toLowerCase().includes(lowerFilter)) ||
        (obj.inputName.toLowerCase().includes(lowerFilter)) ||
        (obj.objectType?.toLowerCase().includes(lowerFilter))
      );
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [objects, filterText, sortConfig]);

  const handleExport = () => {
    const dataToExport = selectedIds.size > 0 
      ? objects.filter(o => selectedIds.has(o.id))
      : processedObjects;
    
    exportToCSV(dataToExport, `skypulse_results_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-slate-600" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-accent-cyan" /> 
      : <ArrowDown size={14} className="text-accent-cyan" />;
  };

  return (
    <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-1">Results</h2>
          <p className="text-slate-400 text-sm">Found {processedObjects.length} objects matches.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <button 
                onClick={onBack}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-space-700 rounded-lg hover:bg-space-800 transition-colors"
            >
                New Search
            </button>
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${showFilter ? 'bg-space-700 border-accent-cyan text-white' : 'bg-space-800 border-space-700 text-white hover:bg-space-700'}`}
            >
                <Filter size={16} /> Filter
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-violet-600 text-white rounded-lg text-sm transition-colors shadow-lg shadow-accent-purple/20"
            >
                <Download size={16} /> 
                {selectedIds.size > 0 ? `Export Selected (${selectedIds.size})` : 'Export All'}
            </button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Filter by name, type, or ID..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-space-900 border border-space-700 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>
      )}

      <div className="bg-space-900 border border-space-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-space-950/50 border-b border-space-800 text-xs text-slate-400 uppercase font-mono tracking-wider">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === objects.length && objects.length > 0}
                    ref={input => { if (input) input.indeterminate = selectedIds.size > 0 && selectedIds.size < objects.length }}
                    onChange={toggleSelectAll}
                    className="rounded border-space-600 bg-space-800 text-accent-purple focus:ring-accent-purple"
                  />
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('primaryName')}
                >
                  <div className="flex items-center gap-2">Object Name <SortIcon columnKey="primaryName" /></div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('objectType')}
                >
                  <div className="flex items-center gap-2">Type <SortIcon columnKey="objectType" /></div>
                </th>
                <th className="p-4">RA / Dec</th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('magnitude')}
                >
                  <div className="flex items-center gap-2">Mag <SortIcon columnKey="magnitude" /></div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('distance')}
                >
                   <div className="flex items-center gap-2">Dist (pc) <SortIcon columnKey="distance" /></div>
                </th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800">
              {processedObjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No objects matching your filter.
                  </td>
                </tr>
              ) : (
                processedObjects.map((obj) => (
                  <tr 
                    key={obj.id} 
                    className={`hover:bg-space-800/50 transition-colors cursor-pointer group ${selectedIds.has(obj.id) ? 'bg-space-800/30' : ''}`}
                    onClick={() => onSelect(obj.id)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(obj.id)}
                        onChange={(e) => toggleSelect(obj.id, e)}
                        className="rounded border-space-600 bg-space-800 text-accent-purple focus:ring-accent-purple"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white group-hover:text-accent-cyan transition-colors">
                        {obj.primaryName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{obj.inputName}</div>
                    </td>
                    <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-space-800 text-slate-300 border border-space-700">
                            {obj.objectType || 'Unknown'}
                        </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-400">
                      {obj.ra?.toFixed(4)}, {obj.dec?.toFixed(4)}
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      {obj.magnitude?.toFixed(2)} <span className="text-slate-500 text-xs">({obj.magBand})</span>
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      {obj.distance ? `${obj.distance.toFixed(1)}` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-space-700 transition-colors">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;