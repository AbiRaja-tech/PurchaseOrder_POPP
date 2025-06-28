import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  collapsed: boolean;
  theme: 'light' | 'dark';
  language: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  collapsed: false,
  theme: 'light',
  language: 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setLanguage, toggleSidebarCollapsed, setSidebarCollapsed } = uiSlice.actions;
export default uiSlice.reducer; 