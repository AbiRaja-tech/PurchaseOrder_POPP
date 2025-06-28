import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'primary.main', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4, maxWidth: 400 }}>
        The page you're looking for doesn't exist. Please check the URL or navigate back to the dashboard.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        size="large"
        onClick={() => navigate('/dashboard')}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound; 