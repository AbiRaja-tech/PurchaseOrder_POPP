import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Typography, Alert, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { fetchProducts } from '../../services/productService';
import { fetchSuppliers } from '../../services/supplierService';
import { fetchUsers } from '../../services/userService';

interface CreatePurchaseOrderModalProps {
  open: boolean;
  onClose: () => void;
  user: any; // Should be User type, but using any for now
}

type Supplier = {
  supplier_id: number;
  name: string;
  // add other fields if needed
};

interface ProductItem {
  product_id: string;
  quantity: string;
  unit_price: string;
  total_price: string;
  [key: string]: string; // Add index signature for dynamic field access
}

type Product = {
  product_id: number;
  name: string;
  unit_price: number;
  // add other fields if needed
};

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({ open, onClose, user }) => {
  const [form, setForm] = useState({
    po_number: '',
    supplier_id: '',
    order_date: dayjs(),
    expected_date: dayjs().add(7, 'day'),
    status: 'draft',
    total_amount: '',
  });
  const [products, setProducts] = useState<ProductItem[]>([
    { product_id: '', quantity: '', unit_price: '', total_price: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [users, setUsers] = useState([]);
  const [productOptions, setProductOptions] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(data => {
      console.log('Fetched products from GCP:', data);
      setProductOptions(data);
    }).catch(() => setProductOptions([]));
    fetchSuppliers().then(data => {
      console.log('Fetched suppliers from GCP:', data);
      setSuppliers(data);
    }).catch(() => setSuppliers([]));
    fetchUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    if (open) {
      setForm({
        po_number: '',
        supplier_id: '',
        order_date: dayjs(),
        expected_date: dayjs().add(7, 'day'),
        status: 'draft',
        total_amount: '',
      });
      setProducts([{ product_id: '', quantity: '', unit_price: '', total_price: '' }]);
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    const supplierIds = suppliers.map(s => String(s.supplier_id));
    const productIds = productOptions.map(p => String(p.product_id));
    if (new Set(supplierIds).size !== supplierIds.length) {
      console.warn('Duplicate supplier IDs detected:', supplierIds);
    }
    if (new Set(productIds).size !== productIds.length) {
      console.warn('Duplicate product IDs detected:', productIds);
    }
  }, [suppliers, productOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (e.target.name === 'supplier_id') {
      // Only allow valid supplier IDs
      const validIds = suppliers.map(s => String(s.supplier_id));
      if (!validIds.includes(value)) {
        value = '';
        console.warn('Attempted to set invalid supplier_id:', e.target.value);
      }
      console.log('Setting supplier_id to:', value);
    }
    setForm(prev => { const updated = { ...prev, [e.target.name]: value }; console.log('Form updated:', updated); return updated; });
  };

  const handleDateChange = (name: string, value: Dayjs | null) => {
    setForm(prev => { const updated = { ...prev, [name]: value || dayjs() }; console.log('Form updated:', updated); return updated; });
  };

  const handleProductChange = (idx: number, field: keyof ProductItem, value: string) => {
    setProducts(prev => {
      const updated = [...prev];
      if (field === 'product_id') {
        const validIds = productOptions.map(p => String(p.product_id));
        if (!validIds.includes(value)) {
          value = '';
          console.warn('Attempted to set invalid product_id:', value);
        }
        console.log('Setting product_id to:', value);
      }
      updated[idx][field] = value;
      // Auto-fill unit price if product selected
      if (field === 'product_id') {
        const prod = productOptions.find((p) => String(p.product_id) === String(value));
        updated[idx].unit_price = prod && prod.unit_price !== undefined ? prod.unit_price.toString() : '';
      }
      // Auto-calculate total price
      const qty = parseFloat(updated[idx].quantity) || 0;
      const price = parseFloat(updated[idx].unit_price) || 0;
      updated[idx].total_price = qty && price ? (qty * price).toString() : '';
      console.log('Products updated:', updated);
      return updated;
    });
  };

  const addProduct = () => {
    setProducts([...products, { product_id: '', quantity: '', unit_price: '', total_price: '' }]);
  };

  const removeProduct = (idx: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== idx));
  };

  const calcTotalAmount = () => {
    return products.reduce((sum, p) => sum + (parseFloat(p.total_price) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    // Validate required fields
    if (!form.po_number || !form.supplier_id || !form.order_date || !form.expected_date || !form.status || products.some(p => !p.product_id || !p.quantity || !p.unit_price || !p.total_price)) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      // Always match user email to user_id from backend
      let userId: number | undefined = undefined;
      if (user?.email) {
        const res = await fetch('/api/users');
        const users: Array<{ email: string; user_id: number }> = await res.json();
        const found = users.find(u => u.email === user.email);
        if (found) userId = found.user_id;
      }
      if (!userId) {
        setError('Could not determine user ID for created_by. Please ensure your user exists in the database.');
        setSubmitting(false);
        return;
      }
      console.log('Submitting to GCP:', {
        po_number: form.po_number,
        supplier_id: Number(form.supplier_id),
        order_date: form.order_date.format('YYYY-MM-DD'),
        expected_date: form.expected_date.format('YYYY-MM-DD'),
        status: form.status,
        total_amount: calcTotalAmount(),
        items: products.map(p => ({
          product_id: p.product_id,
          quantity: parseFloat(p.quantity),
          unit_price: parseFloat(p.unit_price),
          total_price: parseFloat(p.total_price)
        })),
        created_by: userId,
      });
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          po_number: form.po_number,
          supplier_id: Number(form.supplier_id),
          order_date: form.order_date.format('YYYY-MM-DD'),
          expected_date: form.expected_date.format('YYYY-MM-DD'),
          status: form.status,
          total_amount: calcTotalAmount(),
          items: products.map(p => ({
            product_id: p.product_id,
            quantity: parseFloat(p.quantity),
            unit_price: parseFloat(p.unit_price),
            total_price: parseFloat(p.total_price)
          })),
          created_by: userId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create purchase order');
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setForm({
          po_number: '',
          supplier_id: '',
          order_date: dayjs(),
          expected_date: dayjs().add(7, 'day'),
          status: 'draft',
          total_amount: '',
        });
        setProducts([{ product_id: '', quantity: '', unit_price: '', total_price: '' }]);
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Purchase Order</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="PO Number"
                name="po_number"
                value={form.po_number}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Supplier"
                name="supplier_id"
                value={form.supplier_id || ''}
                onChange={e => { handleChange(e); console.log('Selected supplier:', e.target.value, 'Available:', suppliers.map(s => String(s.supplier_id))); }}
                required
                fullWidth
              >
                {suppliers.map((s) => (
                  <MenuItem key={s.supplier_id} value={String(s.supplier_id)}>{s.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Order Date"
                value={form.order_date}
                onChange={(date) => handleDateChange('order_date', date)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expected Date"
                value={form.expected_date}
                onChange={(date) => handleDateChange('expected_date', date)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Products
                  </Typography>
                </Grid>
                {products.map((item: any, idx: number) => (
                  <React.Fragment key={item.product_id || idx}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Product"
                        name="product_id"
                        value={item.product_id || ''}
                        onChange={e => { handleProductChange(idx, 'product_id', e.target.value); console.log('Selected product:', e.target.value, 'Available:', productOptions.map(opt => String(opt.product_id))); }}
                        required
                        fullWidth
                      >
                        {productOptions.map(opt => (
                          <MenuItem key={opt.product_id} value={String(opt.product_id)}>{opt.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={item.quantity}
                        onChange={e => handleProductChange(idx, 'quantity', e.target.value)}
                        required
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Unit Price"
                        name="unit_price"
                        type="number"
                        value={item.unit_price || item.unitPrice}
                        inputProps={{ min: 0, step: 0.01, readOnly: true }}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Total Price"
                        name="total_price"
                        type="number"
                        value={item.total_price || item.totalPrice}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton onClick={() => removeProduct(idx)} disabled={products.length === 1} color="error">
                        <RemoveIcon />
                      </IconButton>
                      {idx === products.length - 1 && (
                        <IconButton onClick={addProduct} color="primary">
                          <AddIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Amount"
                name="total_amount"
                type="number"
                value={calcTotalAmount()}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Created By"
                value={user?.email || user?.name || ''}
                fullWidth
                disabled
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">Purchase order created successfully!</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePurchaseOrderModal; 