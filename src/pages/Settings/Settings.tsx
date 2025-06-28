import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Settings
        </Typography>
        <Typography paragraph>
          This page is only accessible to administrators. Here you can manage application-wide settings.
        </Typography>
        {/* Add more settings components here */}
      </Paper>
    </Container>
  );
};

export default Settings; 