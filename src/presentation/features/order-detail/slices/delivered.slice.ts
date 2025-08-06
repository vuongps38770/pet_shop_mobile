import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { OrderListReqDto } from 'src/presentation/dto/req/order.req.dto';
import { OrderListResDto } from 'src/presentation/dto/res/order-respond.dto';
import { OrderStatus } from 'app/types/OrderStatus';

export type DeliveredState = {
  loading: boolean;
  error: string | null;
  data: OrderListResDto | null;
  fetchStatus: 'idle' | 'loading' | 'success' | 'failed';
  fetchError: string | null;
  loadMoreStatus: 'idle' | 'loading' | 'success' | 'failed';
  loadMoreError: string | null;
  updateStatus: 'idle' | 'loading' | 'success' | 'failed';
  updateStatusError: string | null;
};

const initialState: DeliveredState = {
  loading: false,
  error: null,
  data: null,
  fetchStatus: 'idle',
  fetchError: null,
  loadMoreStatus: 'idle',
  loadMoreError: null,
  updateStatus: 'idle',
  updateStatusError: null,
};

export const fetchDeliveredOrders = createAsyncThunk<
  OrderListResDto,
  OrderListReqDto,
  { rejectValue: string }
>(
  'delivered/fetch',
  async (query, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      // Gộp status DELIVERED và RECEIVED
      params.append('statuses', OrderStatus.DELIVERED);
      params.append('statuses', OrderStatus.RECEIVED);
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
  'delivered/updateOrderStatus',
  async ({ orderId, nextStatus }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/order/${orderId}/status`, { nextStatus });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const fetchDeliveredOrdersLoadMore = createAsyncThunk<
  { data: OrderListResDto; page: number },
  OrderListReqDto & { page: number },
  { state: { delivered: DeliveredState }, rejectValue: string }
>(
  'delivered/fetchLoadMore',
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

const deliveredSlice = createSlice({
  name: 'delivered',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateStatusError = null;
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveredOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchDeliveredOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.fetchStatus = 'success';
      })
      .addCase(fetchDeliveredOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
        state.fetchStatus = 'failed';
        state.fetchError = action.payload || 'Lỗi không xác định';
      })
      .addCase(fetchDeliveredOrdersLoadMore.pending, (state) => {
        state.loadMoreStatus = 'loading';
        state.loadMoreError = null;
      })
      .addCase(fetchDeliveredOrdersLoadMore.fulfilled, (state, action) => {
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
      .addCase(fetchDeliveredOrdersLoadMore.rejected, (state, action) => {
        state.loadMoreStatus = 'failed';
        state.loadMoreError = action.payload || 'Lỗi không xác định';
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateStatusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = 'success';
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateStatusError = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { resetStatus } = deliveredSlice.actions;
export default deliveredSlice.reducer; 