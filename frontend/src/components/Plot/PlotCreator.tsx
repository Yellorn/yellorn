import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PlotCreator: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Create Your Plot
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Design your digital embodiment in the Yellorn universe.
        </Typography>
      </Box>
    </Container>
  );
};

export default PlotCreator;
