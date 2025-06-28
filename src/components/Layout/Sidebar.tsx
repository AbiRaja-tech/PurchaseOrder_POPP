import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as PurchaseOrderIcon,
  Business as VendorIcon,
  Inventory as ProductIcon,
  Receipt as InvoiceIcon,
  Analytics as AnalyticsIcon,
  SmartToy as AIAssistantIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { toggleSidebar, toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

const drawerWidth = 280;
const collapsedWidth = 64;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Purchase Orders', icon: <PurchaseOrderIcon />, path: '/purchase-orders' },
  { text: 'Vendors', icon: <VendorIcon />, path: '/vendors' },
  { text: 'Products', icon: <ProductIcon />, path: '/products' },
  { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'AI Assistant', icon: <AIAssistantIcon />, path: '/ai-assistant' },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen, collapsed } = useSelector((state: RootState) => state.ui);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      dispatch(toggleSidebar());
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Collapse/Expand Icon */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            PO Management
          </Typography>
        )}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton onClick={() => dispatch(toggleSidebarCollapsed())} size="small" sx={{ color: '#fff' }}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
        {isMobile && !collapsed && (
          <IconButton onClick={() => dispatch(toggleSidebar())} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 1,
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1.5 : 2,
                color: '#fff',
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  background: 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: '#60a5fa',
                  transition: 'color 0.2s',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ px: 1, pb: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 1,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1.5 : 2,
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)',
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: 'center',
                color: '#60a5fa',
                transition: 'color 0.2s',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 400,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid rgba(255, 255, 255, 0.1)` }}>
        {!collapsed && (
          <Typography variant="caption" color="#e0e6ed" align="center" sx={{ display: 'block', width: '100%' }}>
            © 2024 PO Management System
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: collapsed ? collapsedWidth : drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          background: '#162447',
          color: '#fff',
          borderRight: 'none',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 