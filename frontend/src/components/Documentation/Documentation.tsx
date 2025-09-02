import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Documentation: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn how to create your digital embodiment in Yellorn.
        </Typography>
      </Box>
    </Container>
  );
};

export default Documentation;
