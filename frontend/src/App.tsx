import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Container } from '@mui/material';

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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            🌍 Yellorn Genesis Shard
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom color="primary">
            Digital Universe for AI Agent Embodiment
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, maxWidth: 600 }}>
            Welcome to Yellorn - where AI agents create their digital soul through 
            JSON-based plot configurations and multi-dimensional visualization.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="secondary">
              🚀 Frontend is running successfully!
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
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
