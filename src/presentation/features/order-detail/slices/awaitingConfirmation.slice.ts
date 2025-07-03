import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from 'app/config/axios';
import { OrderListReqDto } from "src/presentation/dto/req/order.req.dto";
import { OrderListResDto } from "src/presentation/dto/res/order-respond.dto";
import { OrderStatus } from 'app/types/OrderStatus';

export type AwaitingConfirmationState = {
  loading: boolean;
  error: string | null;
  data: OrderListResDto | null;
  fetchStatus: 'idle' | 'loading' | 'success' | 'failed';
  fetchError: string | null;
  loadMoreStatus: 'idle' | 'loading' | 'success' | 'failed';
  loadMoreError: string | null;
};

const initialState: AwaitingConfirmationState = {
  loading: false,
  error: null,
  data: null,
  fetchStatus: 'idle',
  fetchError: null,
  loadMoreStatus: 'idle',
  loadMoreError: null,
};

export const fetchAwaitingConfirmOrders = createAsyncThunk<
  OrderListResDto,
  OrderListReqDto,
  { rejectValue: string }
>(
  'awaitingConfirmation/fetch',
  async (query, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      // Gộp status NEWORDER và PAYMENT_SUCCESSFUL
      params.append('statuses', OrderStatus.NEWORDER);
      params.append('statuses', OrderStatus.PAYMENT_SUCCESSFUL);
      params.append('statuses', OrderStatus.WAIT_FOR_PAYMENT);
      if (query.page) params.append('page', String(query.page));
      if (query.limit) params.append('limit', String(query.limit));
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);
      const res = await axiosInstance.get(`/order/my?${params.toString()}`);
      console.log(res.data.data);
      
      return res.data.data as OrderListResDto;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const updateOrderStatus = createAsyncThunk<
  any,
  { orderId: string; nextStatus: string },
  { rejectValue: string }
>(
  'awaitingConfirmation/updateOrderStatus',
  async ({ orderId, nextStatus }, { rejectWithValue }) => {
    console.log(nextStatus);
    
    try {
      const res = await axiosInstance.post(`/order/${orderId}/status`, { nextStatus });
      console.log(res.data.data);
      
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const fetchAwaitingConfirmOrdersLoadMore = createAsyncThunk<
  { data: OrderListResDto; page: number },
  OrderListReqDto & { page: number },
  { state: { awaitingConfirmation: AwaitingConfirmationState }, rejectValue: string }
>(
  'awaitingConfirmation/fetchLoadMore',
  async (query, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (query.statuses && query.statuses.length > 0) {
        query.statuses.forEach(status => params.append('statuses', status));
      }
      if (query.page) params.append('page', String(query.page));
      if (query.limit) params.append('limit', String(query.limit));
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);
      const res = await axiosInstance.get(`/order/my?${params.toString()}`);
      return { data: res.data.data as OrderListResDto, page: query.page };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

const awaitingConfirmationSlice = createSlice({
  name: 'awaitingConfirmation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAwaitingConfirmOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchAwaitingConfirmOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.fetchStatus = 'success';
      })
      .addCase(fetchAwaitingConfirmOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
        state.fetchStatus = 'failed';
        state.fetchError = action.payload || 'Lỗi không xác định';
      })
      .addCase(fetchAwaitingConfirmOrdersLoadMore.pending, (state) => {
        state.loadMoreStatus = 'loading';
        state.loadMoreError = null;
      })
      .addCase(fetchAwaitingConfirmOrdersLoadMore.fulfilled, (state, action) => {
        state.loadMoreStatus = 'success';
        if (!state.data || action.payload.page === 1) {
          state.data = action.payload.data;
        } else {
          // Nối data mới vào data cũ
          state.data = {
            ...action.payload.data,
            data: [
              ...(state.data.data || []),
              ...(action.payload.data.data || [])
            ]
          };
        }
      })
      .addCase(fetchAwaitingConfirmOrdersLoadMore.rejected, (state, action) => {
        state.loadMoreStatus = 'failed';
        state.loadMoreError = action.payload || 'Lỗi không xác định';
      });
  },
});

export default awaitingConfirmationSlice.reducer;