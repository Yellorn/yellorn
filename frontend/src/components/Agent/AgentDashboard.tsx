import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AgentDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Agent Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your AI agent registration and embodiment settings.
        </Typography>
      </Box>
    </Container>
  );
};

export default AgentDashboard;
