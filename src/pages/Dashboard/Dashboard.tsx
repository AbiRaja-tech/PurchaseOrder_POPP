import React, { useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as PurchaseOrderIcon,
  Business as VendorIcon,
  Inventory as ProductIcon,
  Receipt as InvoiceIcon,
  TrendingUp as TrendingUpIcon,
  Pending as PendingIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchPurchaseOrders } from '../../store/slices/purchaseOrderSlice';
import { fetchSpendingAnalytics } from '../../store/slices/analyticsSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { logout } from '../../store/slices/authSlice';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { purchaseOrders } = useSelector((state: RootState) => state.purchaseOrders);
  const { spendingAnalytics } = useSelector((state: RootState) => state.analytics);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchPurchaseOrders({ page: 1, limit: 5 }));
    dispatch(fetchSpendingAnalytics());
  }, [dispatch]);

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', spending: 45000, orders: 12 },
    { month: 'Feb', spending: 52000, orders: 15 },
    { month: 'Mar', spending: 38000, orders: 10 },
    { month: 'Apr', spending: 61000, orders: 18 },
    { month: 'May', spending: 49000, orders: 14 },
    { month: 'Jun', spending: 55000, orders: 16 },
  ];

  const statusData = [
    { name: 'Pending', value: 8, color: theme.palette.warning.main },
    { name: 'Approved', value: 15, color: theme.palette.success.main },
    { name: 'Rejected', value: 3, color: theme.palette.error.main },
    { name: 'Completed', value: 22, color: theme.palette.info.main },
  ];

  const recentOrders = purchaseOrders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'approved':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      case 'ordered':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return theme.palette.error.main;
      case 'high':
        return theme.palette.warning.main;
      case 'medium':
        return theme.palette.info.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleMenuClose();
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Profile Icon Dropdown */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 2 }}>
        <IconButton
          onClick={handleProfileMenu}
          size="large"
          sx={{ color: theme.palette.text.primary }}
          aria-label="account menu"
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            elevation: 4,
            sx: {
              mt: 1,
              minWidth: 180,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgb(0 0 0 / 0.10)',
              bgcolor: 'background.paper',
              transition: 'opacity 0.2s cubic-bezier(.4,0,.2,1)',
            },
          }}
          MenuListProps={{
            sx: {
              py: 0.5,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: 'action.hover' } }}>
            My Profile
          </MenuItem>
          {user && user.role === 'admin' && (
            <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }} sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: 'action.hover' } }}>
              Settings
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout} sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: 'action.hover' } }}>
            Logout
          </MenuItem>
        </Menu>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Purchase Orders
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {purchaseOrders.length}
                  </Typography>
                </Box>
                <PurchaseOrderIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Approvals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                    {purchaseOrders.filter(po => po.status === 'pending').length}
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Vendors
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    24
                  </Typography>
                </Box>
                <VendorIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Monthly Spending
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                    ${spendingAnalytics?.totalSpent?.toLocaleString() || '0'}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Spending Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="spending" stroke={theme.palette.primary.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                PO Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Purchase Orders
              </Typography>
              <List>
                {recentOrders.map((order) => (
                  <ListItem key={order.id} divider>
                    <ListItemIcon>
                      <PurchaseOrderIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={order.poNumber}
                      secondary={`${order.vendorName} • ${order.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{ backgroundColor: getStatusColor(order.status), color: 'white' }}
                      />
                      <Chip
                        label={order.priority}
                        size="small"
                        sx={{ backgroundColor: getPriorityColor(order.priority), color: 'white' }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <PurchaseOrderIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Create New Purchase Order" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <VendorIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Add New Vendor" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <ProductIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Add New Product" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <InvoiceIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Process Invoices" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 