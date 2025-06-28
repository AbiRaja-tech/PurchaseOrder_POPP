import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SpendingAnalytics } from '../../types';
import { mockSpendingAnalytics, createMockResponse } from '../../services/mockData';

interface AnalyticsState {
  spendingAnalytics: SpendingAnalytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  spendingAnalytics: null,
  loading: false,
  error: null,
};

export const fetchSpendingAnalytics = createAsyncThunk(
  'analytics/fetchSpending',
  async (dateRange?: { start: Date; end: Date }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for now
    return createMockResponse(mockSpendingAnalytics);
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpendingAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpendingAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.spendingAnalytics = action.payload.data;
      })
      .addCase(fetchSpendingAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch spending analytics';
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 