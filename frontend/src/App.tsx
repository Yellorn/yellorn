import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Dashboard, UniverseView, PlotInspector } from './components';
import { useTimeBasedTheme } from './lib';
import { api } from './api';
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'universe'>('dashboard');
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);

  // Initialize time-based theme system
  const { theme, toggleTheme } = useTimeBasedTheme();

  // Fetch plots data
  const { data: plots = [] } = useQuery({
    queryKey: ['plots'],
    queryFn: () => api.plots.list(),
  });

  // Convert Plot[] to PlotData[] by fetching detailed data for each plot
  const { data: plotsData = [] } = useQuery({
    queryKey: ['plotsData', plots.map((p: any) => p.id)],
    queryFn: async () => {
      const plotsData = await Promise.all(
        plots.map((plot: any) => api.plots.get(plot.agent_id))
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
                className="nav-theme-indicator theme-toggle-btn"
                type="button"
                aria-label="Toggle light/dark mode"
                onClick={toggleTheme}
              >
                <span className="theme-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
                <span className="theme-text">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === 'dashboard' ? (
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
