import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '../../types';

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async () => {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return response.json();
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setCurrentInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.currentInvoice = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      });
  },
});

export const { setCurrentInvoice, clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer; 