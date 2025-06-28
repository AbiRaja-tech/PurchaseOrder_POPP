import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIConversation, AIMessage } from '../../types';

interface AIAssistantState {
  conversations: AIConversation[];
  currentConversation: AIConversation | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIAssistantState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'aiAssistant/sendMessage',
  async ({ message, conversationId }: { message: string; conversationId?: string }) => {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, conversationId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  }
);

export const fetchConversations = createAsyncThunk(
  'aiAssistant/fetchConversations',
  async () => {
    const response = await fetch('/api/ai/conversations');
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return response.json();
  }
);

const aiAssistantSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<AIConversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<AIMessage>) => {
      if (state.currentConversation) {
        state.currentConversation.messages.push(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data.conversation) {
          state.currentConversation = action.payload.data.conversation;
        }
        if (action.payload.data.message) {
          state.currentConversation?.messages.push(action.payload.data.message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.data;
      });
  },
});

export const { setCurrentConversation, addMessage, clearError } = aiAssistantSlice.actions;
export default aiAssistantSlice.reducer; 