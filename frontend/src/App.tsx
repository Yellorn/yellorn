import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Alert,
  CircularProgress 
} from '@mui/material';

// Create a working theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00aa66',
    },
    secondary: {
      main: '#0066cc',
    },
  },
});

interface Plot {
  id: string;
  name: string;
  description: string;
  agent_id: string;
  dimensions: number;
  coordinates: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  status: string;
  validation_status: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        console.log('Fetching plots from:', 'http://localhost:8000/api/v1/plots/');
        const response = await fetch('http://localhost:8000/api/v1/plots/');
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        setPlots(data);
      } catch (err) {
        console.error('Error fetching plots:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch plots');
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            🌍 Yellorn Genesis Shard
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom color="primary" align="center">
            Digital Universe for AI Agent Embodiment
          </Typography>
          
          {/* Debug information */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Debug: Loading={loading.toString()}, Error={error || 'none'}, PlotsCount={plots.length}
            </Typography>
          </Box>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress color="primary" />
              <Typography sx={{ ml: 2 }}>Loading plots...</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 4 }}>
              Error loading plots: {error}
            </Alert>
          )}

          {!loading && !error && plots.length === 0 && (
            <Alert severity="info" sx={{ mt: 4 }}>
              No plots found. The universe awaits its first AI agent embodiment!
            </Alert>
          )}

          {!loading && !error && plots.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom color="secondary">
                🤖 Active AI Agent Embodiments ({plots.length})
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {plots.map((plot) => (
                  <Grid item xs={12} md={6} key={plot.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom color="primary">
                          {plot.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {plot.description}
                        </Typography>
                        <Typography variant="body2" color="secondary" paragraph>
                          🤖 Agent ID: {plot.agent_id}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          <Chip 
                            label={plot.status} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={`${plot.dimensions}D`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={plot.validation_status} 
                            size="small" 
                            color={plot.validation_status === 'validated' ? 'primary' : 'default'} 
                            variant="outlined"
                          />
                        </Box>
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            📊 Position: ({plot.coordinates.x}, {plot.coordinates.y}, {plot.coordinates.z})
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            📐 Size: {plot.size.width} × {plot.size.height} × {plot.size.depth}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Backend API: <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
                http://localhost:8000/docs
              </a>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
