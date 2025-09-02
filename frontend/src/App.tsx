import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';

// Components
import Header from './components/Header/Header';
import UniverseViewer from './components/Universe/UniverseViewer';
import AgentDashboard from './components/Agent/AgentDashboard';
import PlotCreator from './components/Plot/PlotCreator';
import Documentation from './components/Documentation/Documentation';

// Create theme for AI-first design
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88', // Yellorn green
    },
    secondary: {
      main: '#0088ff', // Complementary blue
    },
    background: {
      default: '#0a0a0a', // Deep space black
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Fira Code", "Monaco", monospace',
    h1: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<UniverseViewer />} />
              <Route path="/agents" element={<AgentDashboard />} />
              <Route path="/plots/create" element={<PlotCreator />} />
              <Route path="/docs" element={<Documentation />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
