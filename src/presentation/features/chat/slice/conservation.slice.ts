import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/config/axios';
import { ConversationRespondDto } from 'src/presentation/dto/res/chat-respond.dto';

export const getAllConversations = createAsyncThunk(
  'conservation/getAllConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('message/conversations');
      console.log('Fetched conversations:', res.data.data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Lỗi lấy danh sách hội thoại');
    }
  }
);

export const createShopConversation = createAsyncThunk(
  'conservation/createShopConversation',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('message/create-shop-conversation');
      return true;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Lỗi tạo phòng shop');
    }
  }
);

// Thunk: Lấy tin nhắn cũ của 1 conversation
export const getOlderMessages = createAsyncThunk(
  'conservation/getOlderMessages',
  async (
    { conversationId, limit = 10, before }: { conversationId: string; limit?: number; before?: string },
    { rejectWithValue }
  ) => {
    try {
      const params: any = { limit };
      if (before) params.before = before;
      const res = await axios.get(`/message/older-messages/${conversationId}`, { params });
      return res.data.data; // array of messages
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Lỗi lấy tin nhắn cũ');
    }
  }
);


interface ConservationState {
  shopConversation: ConversationRespondDto | null;
}

const initialState: ConservationState = {
  shopConversation: null,
};

const conservationSlice = createSlice({
  name: 'conservation',
  initialState,
  reducers: {
    setShopConversation(state, action: PayloadAction<ConversationRespondDto | null>) {
      state.shopConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllConversations.fulfilled, (state, action) => {
      const shopConv = action.payload?.find((c: any) => c.type === 'shop');
      state.shopConversation = shopConv || null;
    });
  },
});

export const { setShopConversation } = conservationSlice.actions;
export default conservationSlice.reducer;
