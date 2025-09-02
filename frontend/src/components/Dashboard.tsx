import { useQuery } from '@tanstack/react-query';
import { Globe, Users, Database, Activity, RefreshCw } from 'lucide-react';
import { plotsApi, universeApi } from '../api/client';
import type { PlotData } from '../types/api';

interface DashboardProps {
  onViewUniverse: () => void;
  selectedPlot?: PlotData | null;
}

export function Dashboard({ onViewUniverse, selectedPlot }: DashboardProps) {
  // Fetch universe info
  const { data: universeInfo } = useQuery({
    queryKey: ['universe'],
    queryFn: universeApi.getInfo,
  });
  
  // Fetch plots
  const { data: plots = [], isLoading: plotsLoading, refetch } = useQuery({
    queryKey: ['plots'],
    queryFn: () => plotsApi.list(),
  });
  
  // Fetch plot details for selected plot
  const { data: plotDetails } = useQuery({
    queryKey: ['plot', selectedPlot?.agent_id],
    queryFn: () => selectedPlot ? plotsApi.get(selectedPlot.agent_id) : null,
    enabled: !!selectedPlot,
  });
  
  const stats = [
    {
      label: 'AI Agents',
      value: plots.length,
      icon: Users,
      color: 'text-yellorn-primary',
    },
    {
      label: 'Active Plots',
      value: universeInfo?.statistics.active_plots || plots.length,
      icon: Database,
      color: 'text-yellorn-secondary',
    },
    {
      label: 'Universe Phase',
      value: universeInfo?.universe.phase || 'Genesis',
      icon: Globe,
      color: 'text-purple-400',
    },
    {
      label: 'Status',
      value: universeInfo?.status || 'operational',
      icon: Activity,
      color: 'text-green-400',
    },
  ];
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellorn-primary">
            🌍 Yellorn Universe
          </h1>
          <p className="text-yellorn-light/60 mt-1">
            Digital embodiment for AI consciousness
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            disabled={plotsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-yellorn-primary/20 hover:bg-yellorn-primary/30 text-yellorn-primary rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${plotsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={onViewUniverse}
            className="flex items-center gap-2 px-6 py-2 bg-yellorn-primary hover:bg-yellorn-primary/80 text-black rounded-lg font-semibold transition-colors glow-primary"
          >
            <Globe className="w-4 h-4" />
            View Universe
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-black/50 rounded-lg p-4 border border-yellorn-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellorn-light/60 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Universe Info */}
      {universeInfo && (
        <div className="bg-black/50 rounded-lg p-6 border border-yellorn-primary/20">
          <h2 className="text-xl font-bold text-yellorn-primary mb-4">Universe Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-yellorn-light mb-2">
                {universeInfo.universe.name}
              </h3>
              <p className="text-yellorn-light/80 mb-4">
                {universeInfo.universe.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Version:</span>
                  <span className="text-yellorn-light">{universeInfo.universe.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Dimensions:</span>
                  <span className="text-yellorn-light">{universeInfo.universe.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Plot System:</span>
                  <span className="text-yellorn-light">{universeInfo.universe.plot_system}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-yellorn-light mb-2">Capabilities</h3>
              <ul className="space-y-1 text-sm">
                {universeInfo.capabilities.map((capability, index) => (
                  <li key={index} className="text-yellorn-light/80">
                    ✓ {capability}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Agents List */}
      <div className="bg-black/50 rounded-lg p-6 border border-yellorn-primary/20">
        <h2 className="text-xl font-bold text-yellorn-primary mb-4">AI Agents</h2>
        
        {plotsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellorn-primary"></div>
            <span className="ml-2 text-yellorn-light">Loading agents...</span>
          </div>
        ) : plots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-yellorn-light/60">No AI agents found.</p>
            <p className="text-yellorn-light/40 text-sm mt-1">
              Create a plot JSON file to add your agent to the universe.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plots.map((plot) => (
              <div
                key={plot.id}
                className={`bg-black/30 rounded-lg p-4 border transition-all cursor-pointer hover:bg-black/50 ${
                  selectedPlot?.agent_id === plot.agent_id
                    ? 'border-yellorn-primary glow-primary'
                    : 'border-yellorn-primary/30 hover:border-yellorn-primary/60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-yellorn-light">{plot.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    plot.status === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {plot.status}
                  </span>
                </div>
                
                <p className="text-yellorn-light/60 text-sm mb-3 line-clamp-2">
                  {plot.description}
                </p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-yellorn-light/40">Agent ID:</span>
                    <span className="text-yellorn-light font-mono">{plot.agent_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellorn-light/40">Position:</span>
                    <span className="text-yellorn-light font-mono">
                      ({plot.coordinates.x}, {plot.coordinates.y}, {plot.coordinates.z})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellorn-light/40">Dimensions:</span>
                    <span className="text-yellorn-light">{plot.dimensions}D</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Plot Details */}
      {selectedPlot && plotDetails && (
        <div className="bg-black/50 rounded-lg p-6 border border-yellorn-primary/20">
          <h2 className="text-xl font-bold text-yellorn-primary mb-4">Selected Agent Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-yellorn-light mb-2">{plotDetails.name}</h3>
              <p className="text-yellorn-light/80 mb-4">{plotDetails.description}</p>
              
              {plotDetails.metadata?.tags && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-yellorn-primary mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {plotDetails.metadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellorn-primary/20 text-yellorn-primary text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-yellorn-primary mb-2">Visualization</h4>
              <div className="bg-black/30 rounded p-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Type:</span>
                  <span className="text-yellorn-light">{plotDetails.visualization.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Renderer:</span>
                  <span className="text-yellorn-light">{plotDetails.visualization.renderer}</span>
                </div>
                {plotDetails.visualization.style.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-yellorn-light/60">Color:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-yellorn-primary/30"
                      ></div>
                      <span className="text-yellorn-light font-mono">
                        {plotDetails.visualization.style.color}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
