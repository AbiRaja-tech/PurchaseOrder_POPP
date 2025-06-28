import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Invoices: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Process Invoice
        </Button>
      </Box>
      
      <Typography variant="body1" color="textSecondary">
        Invoice tracking and management page - Coming soon with invoice processing, payment tracking, and approval workflows.
      </Typography>
    </Box>
  );
};

export default Invoices; 