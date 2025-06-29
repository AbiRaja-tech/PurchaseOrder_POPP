import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField
} from '@mui/material';
import { Add as AddIcon, KeyboardArrowDown } from '@mui/icons-material';
import { fetchSuppliers, createSupplier } from '../../services/supplierService';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers().then(setVendors).finally(() => setLoading(false));
  }, [openAdd]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createSupplier(form);
      setOpenAdd(false);
      setForm({ name: '', contact_name: '', email: '', phone: '', address: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
          onClick={() => setOpenAdd(true)}
        >
          Add Vendor
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : vendors.length === 0 ? (
              <TableRow><TableCell colSpan={6}>No vendors found.</TableCell></TableRow>
            ) : vendors.map(vendor => (
              <TableRow key={vendor.supplier_id}>
                <TableCell>
                  <IconButton onClick={() => setOpenDetails(vendor)}><KeyboardArrowDown /></IconButton>
                </TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.contact_name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>{vendor.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add Vendor Modal */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Vendor</DialogTitle>
        <form onSubmit={handleAddVendor}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Contact Name" name="contact_name" value={form.contact_name} onChange={handleFormChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" name="email" value={form.email} onChange={handleFormChange} required fullWidth type="email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" name="phone" value={form.phone} onChange={handleFormChange} required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address" name="address" value={form.address} onChange={handleFormChange} required fullWidth />
              </Grid>
              {error && <Grid item xs={12}><Typography color="error">{error}</Typography></Grid>}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Vendor Details Modal */}
      <Dialog open={!!openDetails} onClose={() => setOpenDetails(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Vendor Details</DialogTitle>
        <DialogContent>
          {openDetails && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><b>Name:</b> {openDetails.name}</Grid>
              <Grid item xs={12} sm={6}><b>Contact Name:</b> {openDetails.contact_name}</Grid>
              <Grid item xs={12} sm={6}><b>Email:</b> {openDetails.email}</Grid>
              <Grid item xs={12} sm={6}><b>Phone:</b> {openDetails.phone}</Grid>
              <Grid item xs={12}><b>Address:</b> {openDetails.address}</Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vendors; 