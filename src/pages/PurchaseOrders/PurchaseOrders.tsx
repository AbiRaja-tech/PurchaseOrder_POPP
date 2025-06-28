import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PurchaseOrders: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Purchase Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Create Purchase Order
        </Button>
      </Box>
      
      <Typography variant="body1" color="textSecondary">
        Purchase Orders management page - Coming soon with full CRUD operations, filtering, and approval workflows.
      </Typography>
    </Box>
  );
};

export default PurchaseOrders; 