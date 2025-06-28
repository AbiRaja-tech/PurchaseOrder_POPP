import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PurchaseOrder, CreatePurchaseOrderForm, FilterOptions, SortOptions } from '../../types';
import { mockPurchaseOrders, createMockPaginatedResponse } from '../../services/mockData';

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  currentPurchaseOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort: SortOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: PurchaseOrderState = {
  purchaseOrders: [],
  currentPurchaseOrder: null,
  loading: false,
  error: null,
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchPurchaseOrders = createAsyncThunk(
  'purchaseOrders/fetchAll',
  async (params: { page?: number; limit?: number; filters?: FilterOptions; sort?: SortOptions }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for now
    return createMockPaginatedResponse(mockPurchaseOrders, params.page || 1, params.limit || 10);
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/create',
  async (purchaseOrderData: CreatePurchaseOrderForm) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock response
    const newPO: PurchaseOrder = {
      id: Date.now().toString(),
      poNumber: `PO-2024-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`,
      vendorId: purchaseOrderData.vendorId,
      vendorName: 'New Vendor',
      vendorEmail: 'vendor@example.com',
      items: purchaseOrderData.items.map((item, index) => ({
        id: `item${Date.now()}-${index}`,
        productId: item.productId,
        productName: 'Product',
        productSku: 'SKU-001',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        currency: 'USD',
        notes: item.notes,
      })),
      subtotal: purchaseOrderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      tax: 0,
      total: purchaseOrderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      currency: 'USD',
      status: 'draft',
      priority: purchaseOrderData.priority,
      expectedDeliveryDate: purchaseOrderData.expectedDeliveryDate,
      notes: purchaseOrderData.notes,
      terms: purchaseOrderData.terms,
      createdBy: 'admin@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return { data: newPO };
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrders/update',
  async ({ id, data }: { id: string; data: Partial<PurchaseOrder> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and update mock data
    const existingPO = mockPurchaseOrders.find(po => po.id === id);
    if (!existingPO) {
      throw new Error('Purchase order not found');
    }
    
    const updatedPO = { ...existingPO, ...data, updatedAt: new Date() };
    return { data: updatedPO };
  }
);

export const approvePurchaseOrder = createAsyncThunk(
  'purchaseOrders/approve',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and approve mock data
    const existingPO = mockPurchaseOrders.find(po => po.id === id);
    if (!existingPO) {
      throw new Error('Purchase order not found');
    }
    
    const approvedPO = { 
      ...existingPO, 
      status: 'approved' as const,
      approvedBy: 'approver@example.com',
      approvedAt: new Date(),
      updatedAt: new Date()
    };
    
    return { data: approvedPO };
  }
);

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    setCurrentPurchaseOrder: (state, action: PayloadAction<PurchaseOrder | null>) => {
      state.currentPurchaseOrder = action.payload;
    },
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },
    setSort: (state, action: PayloadAction<SortOptions>) => {
      state.sort = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch purchase orders';
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders.unshift(action.payload.data);
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        const index = state.purchaseOrders.findIndex(po => po.id === action.payload.data.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload.data;
        }
        if (state.currentPurchaseOrder?.id === action.payload.data.id) {
          state.currentPurchaseOrder = action.payload.data;
        }
      })
      .addCase(approvePurchaseOrder.fulfilled, (state, action) => {
        const index = state.purchaseOrders.findIndex(po => po.id === action.payload.data.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload.data;
        }
        if (state.currentPurchaseOrder?.id === action.payload.data.id) {
          state.currentPurchaseOrder = action.payload.data;
        }
      });
  },
});

export const { setCurrentPurchaseOrder, setFilters, setSort, clearError } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer; 