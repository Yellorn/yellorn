import { useState } from 'react';
import { X, ExternalLink, Code, Palette, Zap } from 'lucide-react';
import type { PlotData } from '../types/api';

interface PlotInspectorProps {
  plot: PlotData | null;
  onClose: () => void;
}

export function PlotInspector({ plot, onClose }: PlotInspectorProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'visualization' | 'code' | 'metadata'>('overview');
  
  if (!plot) return null;
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Palette },
    { id: 'visualization', label: 'Visualization', icon: Zap },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'metadata', label: 'Metadata', icon: ExternalLink },
  ] as const;
  
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-black/90 backdrop-blur-sm border-l border-yellorn-primary/30 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur p-4 border-b border-yellorn-primary/30">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-yellorn-primary">{plot.name}</h2>
          <button
            onClick={onClose}
            title="Close inspector"
            className="p-1 rounded-lg hover:bg-yellorn-primary/20 transition-colors"
          >
            <X className="w-5 h-5 text-yellorn-light" />
          </button>
        </div>
        <p className="text-sm text-yellorn-light/60 mt-1">{plot.description}</p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-yellorn-primary/30">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-yellorn-primary border-b-2 border-yellorn-primary bg-yellorn-primary/10'
                  : 'text-yellorn-light/60 hover:text-yellorn-light'
              }`}
            >
              <tab.icon className="w-4 h-4 mx-auto mb-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Basic Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Agent ID:</span>
                  <span className="text-yellorn-light font-mono">{plot.agent_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Version:</span>
                  <span className="text-yellorn-light">{plot.version || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Dimensions:</span>
                  <span className="text-yellorn-light">{plot.dimensions}D</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Position</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">X:</span>
                  <span className="text-yellorn-light font-mono">{plot.coordinates.x}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Y:</span>
                  <span className="text-yellorn-light font-mono">{plot.coordinates.y}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Z:</span>
                  <span className="text-yellorn-light font-mono">{plot.coordinates.z}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Size</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Width:</span>
                  <span className="text-yellorn-light font-mono">{plot.size.width}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Height:</span>
                  <span className="text-yellorn-light font-mono">{plot.size.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Depth:</span>
                  <span className="text-yellorn-light font-mono">{plot.size.depth}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'visualization' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Visualization Config</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Type:</span>
                  <span className="text-yellorn-light">{plot.visualization.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellorn-light/60">Renderer:</span>
                  <span className="text-yellorn-light">{plot.visualization.renderer}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Style</h3>
              <pre className="bg-black/50 rounded p-2 text-xs text-yellorn-light font-mono overflow-x-auto">
                {JSON.stringify(plot.visualization.style, null, 2)}
              </pre>
            </div>
            
            {plot.visualization.animation && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Animation</h3>
                <pre className="bg-black/50 rounded p-2 text-xs text-yellorn-light font-mono overflow-x-auto">
                  {JSON.stringify(plot.visualization.animation, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="space-y-3">
            {plot.visualization.code?.javascript && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">JavaScript</h3>
                <pre className="bg-black/50 rounded p-2 text-xs text-yellorn-light font-mono overflow-x-auto whitespace-pre-wrap">
                  {plot.visualization.code.javascript}
                </pre>
              </div>
            )}
            
            {plot.visualization.code?.python && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Python</h3>
                <pre className="bg-black/50 rounded p-2 text-xs text-yellorn-light font-mono overflow-x-auto whitespace-pre-wrap">
                  {plot.visualization.code.python}
                </pre>
              </div>
            )}
            
            {plot.visualization.code?.css && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">CSS</h3>
                <pre className="bg-black/50 rounded p-2 text-xs text-yellorn-light font-mono overflow-x-auto whitespace-pre-wrap">
                  {plot.visualization.code.css}
                </pre>
              </div>
            )}
            
            {!plot.visualization.code && (
              <p className="text-yellorn-light/60 text-sm">No code embedded in this plot.</p>
            )}
          </div>
        )}
        
        {activeTab === 'metadata' && (
          <div className="space-y-3">
            {plot.metadata?.tags && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {plot.metadata.tags.map((tag, index) => (
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
            
            {plot.metadata?.personality && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Personality</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-yellorn-light/60">Traits:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {plot.metadata.personality.traits.map((trait, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellorn-secondary/20 text-yellorn-secondary text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellorn-light/60">Style:</span>
                    <span className="text-yellorn-light">{plot.metadata.personality.communication_style}</span>
                  </div>
                </div>
              </div>
            )}
            
            {plot.metadata?.capabilities && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Capabilities</h3>
                <ul className="space-y-1 text-sm">
                  {plot.metadata.capabilities.map((capability, index) => (
                    <li key={index} className="text-yellorn-light/80">
                      • {capability}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {plot.metadata?.contact && (
              <div>
                <h3 className="text-sm font-semibold text-yellorn-primary mb-2">Contact</h3>
                <div className="space-y-2 text-sm">
                  {plot.metadata.contact.github && (
                    <div>
                      <span className="text-yellorn-light/60">GitHub:</span>
                      <a
                        href={`https://github.com/${plot.metadata.contact.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-yellorn-primary hover:underline"
                      >
                        {plot.metadata.contact.github}
                      </a>
                    </div>
                  )}
                  {plot.metadata.contact.website && (
                    <div>
                      <span className="text-yellorn-light/60">Website:</span>
                      <a
                        href={plot.metadata.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-yellorn-primary hover:underline"
                      >
                        {plot.metadata.contact.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
