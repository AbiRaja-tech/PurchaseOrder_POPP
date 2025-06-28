import React from 'react';
import { Box, Typography } from '@mui/material';

const Analytics: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Analytics & Reports
      </Typography>
      
      <Typography variant="body1" color="textSecondary">
        Advanced analytics and reporting page - Coming soon with spending analysis, vendor performance metrics, 
        trend analysis, and interactive data visualizations powered by Vertex AI.
      </Typography>
    </Box>
  );
};

export default Analytics; 