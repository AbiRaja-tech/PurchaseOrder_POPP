import React from 'react';
import { Box, Typography } from '@mui/material';

const AIAssistant: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        AI Assistant
      </Typography>
      
      <Typography variant="body1" color="textSecondary">
        AI-powered assistant page - Coming soon with intelligent chat interface, PO analysis, 
        spending pattern insights, and automated recommendations powered by Vertex AI.
      </Typography>
    </Box>
  );
};

export default AIAssistant; 