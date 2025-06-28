import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vendor, CreateVendorForm } from '../../types';

interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  loading: false,
  error: null,
};

export const fetchVendors = createAsyncThunk(
  'vendors/fetchAll',
  async () => {
    const response = await fetch('/api/vendors');
    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }
    return response.json();
  }
);

export const createVendor = createAsyncThunk(
  'vendors/create',
  async (vendorData: CreateVendorForm) => {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create vendor');
    }
    
    return response.json();
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setCurrentVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vendors';
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.vendors.push(action.payload.data);
      });
  },
});

export const { setCurrentVendor, clearError } = vendorSlice.actions;
export default vendorSlice.reducer; 