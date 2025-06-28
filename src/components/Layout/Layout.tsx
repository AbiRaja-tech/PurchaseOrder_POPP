import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import useMediaQuery from '@mui/material/useMediaQuery';
import Sidebar from './Sidebar';

const drawerWidth = 280;
const collapsedWidth = 64;

const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: '100vh',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { collapsed } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        dispatch(toggleSidebarCollapsed());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // On mobile, sidebar is overlay, so don't render it here
  // On desktop, render sidebar as a flex child
  return (
    <LayoutContainer>
      {!isMobile && (
        <Box
          sx={{
            width: collapsed ? collapsedWidth : drawerWidth,
            flexShrink: 0,
            height: '100vh',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1200,
          }}
        >
          <Sidebar />
        </Box>
      )}
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 