import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Vendors: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Vendors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Add Vendor
        </Button>
      </Box>
      
      <Typography variant="body1" color="textSecondary">
        Vendor management page - Coming soon with vendor catalog, performance tracking, and contact management.
      </Typography>
    </Box>
  );
};

export default Vendors; 