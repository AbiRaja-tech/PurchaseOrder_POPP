import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Local Imports
import { useAuth } from './hooks/useAuth';
import { AppDispatch } from './store/store';
import { setUser } from './store/slices/authSlice';
import { authService } from './services/authService';

// Layout and Page Components
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import PurchaseOrders from './pages/PurchaseOrders/PurchaseOrders';
import Vendors from './pages/Vendors/Vendors';
import Invoices from './pages/Invoices/Invoices';
import Products from './pages/Products/Products';
import AIAssistant from './pages/AIAssistant/AIAssistant';
import Analytics from './pages/Analytics/Analytics';
import NotFound from './pages/NotFound/NotFound';
import Settings from './pages/Settings/Settings';
import AdminRoute from './routes/AdminRoute';
import AccessDenied from './pages/AccessDenied/AccessDenied';

/**
 * A wrapper for routes that should only be accessible to authenticated users.
 * It also prevents authenticated users from accessing the login page.
 */
const ProtectedRoutes: React.FC = () => {
  const { user } = useAuth();
  return user ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        {/* Public route for login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/products" element={<Products />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          
          {/* Admin Only Route */}
          <Route element={<AdminRoute />}>
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LocalizationProvider>
  );
};

export default App; 