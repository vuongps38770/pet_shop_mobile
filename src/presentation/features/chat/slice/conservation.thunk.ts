import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/config/axios';

// Lấy tất cả conversation của user
export const getAllConversations = createAsyncThunk(
  'conservation/getAllConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/conversations');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Lỗi lấy danh sách hội thoại');
    }
  }
);

// Tạo phòng shop
export const createShopConversation = createAsyncThunk(
  'conservation/createShopConversation',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/create-shop-conversation');
      return true;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Lỗi tạo phòng shop');
    }
  }
); 