import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Dashboard } from './components/Dashboard';
import { UniverseView } from './components/UniverseView';
import { PlotInspector } from './components/PlotInspector';
import StyleGuide from './components/StyleGuide';
import { plotsApi } from './api/client';
import type { PlotData } from './types/api';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'universe' | 'styleguide'>('styleguide');
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);

  // Fetch plots data
  const { data: plots = [] } = useQuery({
    queryKey: ['plots'],
    queryFn: () => plotsApi.list(),
  });

  // Convert Plot[] to PlotData[] by fetching detailed data for each plot
  const { data: plotsData = [] } = useQuery({
    queryKey: ['plotsData', plots.map(p => p.id)],
    queryFn: async () => {
      const plotsData = await Promise.all(
        plots.map(plot => plotsApi.get(plot.agent_id))
      );
      return plotsData;
    },
    enabled: plots.length > 0,
  });

  return (
    <div className="min-h-screen">
      {/* Navigation Bar - Always visible */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-logo">🌍</div>
            <span className="brand-text">Yellorn</span>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'universe' ? 'active' : ''}`}
                onClick={() => setCurrentView('universe')}
              >
                Universe
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'styleguide' ? 'active' : ''}`}
                onClick={() => setCurrentView('styleguide')}
              >
                Style Guide
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === 'styleguide' ? (
        <StyleGuide />
      ) : currentView === 'dashboard' ? (
        <Dashboard
          onViewUniverse={() => setCurrentView('universe')}
          selectedPlot={selectedPlot}
        />
      ) : (
        <>
          <div className="h-screen">
            <UniverseView
              plots={plotsData}
              selectedPlot={selectedPlot}
              onPlotSelect={setSelectedPlot}
            />
          </div>
          
          {/* Plot Inspector */}
          <PlotInspector
            plot={selectedPlot}
            onClose={() => setSelectedPlot(null)}
          />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
