import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import vendorReducer from './slices/vendorSlice';
import productReducer from './slices/productSlice';
import invoiceReducer from './slices/invoiceSlice';
import analyticsReducer from './slices/analyticsSlice';
import aiAssistantReducer from './slices/aiAssistantSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    purchaseOrders: purchaseOrderReducer,
    vendors: vendorReducer,
    products: productReducer,
    invoices: invoiceReducer,
    analytics: analyticsReducer,
    aiAssistant: aiAssistantReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 