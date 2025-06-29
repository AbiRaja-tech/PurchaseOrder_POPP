import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import { Add as AddIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal';
import { useAuth } from '../../hooks/useAuth';
import { fetchUsers } from '../../services/userService';
import { fetchSuppliers } from '../../services/supplierService';
import { fetchProducts } from '../../services/productService';

function formatDate(dateStr: string | Date | undefined) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB'); // DD/MM/YYYY
}

const statusColors: Record<string, string> = {
  draft: '#757575',
  pending: '#ff9800',
  approved: '#4caf50',
  rejected: '#f44336',
  ordered: '#2196f3',
  received: '#388e3c',
  cancelled: '#bdbdbd',
};

const PurchaseOrders: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [poList, setPoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [poRes, userRes, supplierRes, productRes] = await Promise.all([
        fetch('/api/purchase-orders').then(r => r.json()),
        fetchUsers(),
        fetchSuppliers(),
        fetchProducts(),
      ]);
      setPoList(poRes);
      setUsers(userRes);
      setSuppliers(supplierRes);
      setProducts(productRes);
      setLoading(false);
    }
    fetchAll();
  }, [open]); // refetch after modal closes

  function getUserName(userId: number | string) {
    const u = users.find(u => u.user_id === userId || u.id === userId);
    return u ? u.name || u.email : userId;
  }
  function getSupplierName(supplierId: number | string) {
    const s = suppliers.find(s => s.supplier_id === supplierId || s.id === supplierId);
    return s ? s.name : supplierId;
  }
  function getProductName(productId: number | string) {
    const p = products.find(p => p.product_id === productId || p.id === productId);
    return p ? p.name : productId;
  }

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
          onClick={() => setOpen(true)}
        >
          Create Purchase Order
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>PO Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Expected Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
            ) : poList.length === 0 ? (
              <TableRow><TableCell colSpan={5}>No purchase orders found.</TableCell></TableRow>
            ) : poList.map(po => (
              <TableRow key={po.po_id || po.id}>
                <TableCell>
                  <IconButton onClick={() => setSelectedPO(po)}><KeyboardArrowDown /></IconButton>
                </TableCell>
                <TableCell>{po.po_number || po.poNumber}</TableCell>
                <TableCell>
                  <Chip label={po.status} sx={{ backgroundColor: statusColors[po.status] || '#90caf9', color: 'white', fontWeight: 600 }} />
                </TableCell>
                <TableCell>{formatDate(po.order_date || po.orderDate)}</TableCell>
                <TableCell>{formatDate(po.expected_date || po.expectedDeliveryDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreatePurchaseOrderModal open={open} onClose={() => setOpen(false)} user={user} />
      {/* PO Details Modal */}
      <Dialog open={!!selectedPO} onClose={() => setSelectedPO(null)} maxWidth="md" fullWidth>
        <DialogTitle>Purchase Order Details</DialogTitle>
        <DialogContent>
          {selectedPO && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><b>PO Number:</b> {selectedPO.po_number || selectedPO.poNumber}</Grid>
              <Grid item xs={12} sm={6}><b>Status:</b> <Chip label={selectedPO.status} sx={{ backgroundColor: statusColors[selectedPO.status] || '#90caf9', color: 'white', fontWeight: 600 }} /></Grid>
              <Grid item xs={12} sm={6}><b>Order Date:</b> {formatDate(selectedPO.order_date || selectedPO.orderDate)}</Grid>
              <Grid item xs={12} sm={6}><b>Expected Date:</b> {formatDate(selectedPO.expected_date || selectedPO.expectedDeliveryDate)}</Grid>
              <Grid item xs={12} sm={6}><b>Supplier:</b> {getSupplierName(selectedPO.supplier_id || selectedPO.vendorId)}</Grid>
              <Grid item xs={12} sm={6}><b>Created By:</b> {getUserName(selectedPO.created_by || selectedPO.createdBy)}</Grid>
              <Grid item xs={12} sm={6}><b>Total Amount:</b> {selectedPO.total_amount || selectedPO.total}</Grid>
              <Grid item xs={12}><b>Products:</b>
                {(() => {
                  const poItems = selectedPO.items && selectedPO.items.length > 0
                    ? selectedPO.items
                    : (selectedPO.products || []);
                  return (
                    <Table size="small" sx={{ mt: 1 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Total Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {poItems.map((item: any, idx: number) => (
                          <TableRow key={item.product_id || item.productId || idx}>
                            <TableCell>{getProductName(item.product_id || item.productId)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit_price || item.unitPrice}</TableCell>
                            <TableCell>{item.total_price || item.totalPrice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  );
                })()}
              </Grid>
              {selectedPO.notes && <Grid item xs={12}><b>Notes:</b> {selectedPO.notes}</Grid>}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPO(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrders; 