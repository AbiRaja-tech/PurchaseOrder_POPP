import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Products: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Add Product
        </Button>
      </Box>
      
      <Typography variant="body1" color="textSecondary">
        Product catalog management page - Coming soon with product listings, pricing, and inventory tracking.
      </Typography>
    </Box>
  );
};

export default Products; 