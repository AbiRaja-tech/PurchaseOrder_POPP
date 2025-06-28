import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar, Divider, ListItemIcon } from '@mui/material';
import { ChevronLeft, ChevronRight, AccountCircle, Person, Settings as SettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { styled, useTheme } from '@mui/material/styles';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { collapsed } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Helper for avatar initials
  const getInitials = (nameOrEmail: string) => {
    if (!nameOrEmail) return '?';
    const parts = nameOrEmail.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <StyledAppBar position="fixed" open={!collapsed} sx={{ background: theme.palette.primary.main, color: '#fff', boxShadow: '0 2px 8px rgba(24,49,83,0.10)' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            marginRight: 5,
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700 }}>
          PO Management
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          {/* User Info (name/email) */}
          {user && (
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              mr: 1,
            }}>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: 16, lineHeight: 1.2 }}>
                {user.name || (user.email ? user.email.split('@')[0] : '')}
              </Typography>
              <Typography sx={{ color: '#b6c2e2', fontSize: 13, lineHeight: 1.2 }}>
                {user.email}
              </Typography>
            </Box>
          )}
          {/* Avatar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              width: 44,
              borderRadius: '50%',
              background: 'rgba(24,49,83,0.06)',
              border: '2px solid #2563eb',
              boxShadow: '0 2px 8px rgba(24,49,83,0.08)',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              mr: 0.5,
              '&:hover': {
                boxShadow: '0 4px 16px rgba(37,99,235,0.18)',
                borderColor: '#60a5fa',
              },
            }}
            onClick={handleMenu}
          >
            <Avatar
              sx={{
                bgcolor: '#2563eb',
                color: '#fff',
                width: 36,
                height: 36,
                fontWeight: 700,
                fontSize: 18,
                boxShadow: 'none',
              }}
            >
              {user?.name ? getInitials(user.name) : user?.email ? getInitials(user.email) : '?'}
            </Avatar>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 6,
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                bgcolor: '#162447',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(24,49,83,0.18)',
                p: 0.5,
              },
            }}
            MenuListProps={{
              sx: {
                py: 0,
              },
            }}
          >
            <MenuItem onClick={handleClose} sx={{
              color: '#fff',
              borderRadius: 1,
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'background 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                color: '#fff',
              },
            }}>
              <ListItemIcon sx={{ color: '#fff', minWidth: 32 }}><Person /></ListItemIcon>
              My Profile
            </MenuItem>
            {user && user.role === 'admin' && (
              <MenuItem onClick={() => { navigate('/settings'); handleClose(); }} sx={{
                color: '#fff',
                borderRadius: 1,
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                  color: '#fff',
                },
              }}>
                <ListItemIcon sx={{ color: '#fff', minWidth: 32 }}><SettingsIcon /></ListItemIcon>
                Settings
              </MenuItem>
            )}
            <Divider sx={{ my: 0.5, bgcolor: 'rgba(255,255,255,0.08)' }} />
            <MenuItem onClick={handleLogout} sx={{
              color: '#fff',
              borderRadius: 1,
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'background 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                color: '#fff',
              },
            }}>
              <ListItemIcon sx={{ color: '#fff', minWidth: 32 }}><LogoutIcon /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 