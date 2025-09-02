import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Dashboard } from './components/Dashboard';
import { UniverseView } from './components/UniverseView';
import { PlotInspector } from './components/PlotInspector';
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'universe'>('dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-yellorn-light">
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
          
          {/* Navigation Bar */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-2 bg-black/70 backdrop-blur-sm border border-yellorn-primary/30 text-yellorn-primary rounded-lg hover:bg-yellorn-primary/20 transition-colors"
            >
              ← Back to Dashboard
            </button>
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
