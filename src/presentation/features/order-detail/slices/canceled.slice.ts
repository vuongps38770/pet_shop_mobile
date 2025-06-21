import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { OrderListReqDto } from 'src/presentation/dto/req/order.req.dto';
import { OrderListResDto } from 'src/presentation/dto/res/order-respond.dto';
import { OrderStatus } from 'app/types/OrderStatus';

export type CanceledState = {
  loading: boolean;
  error: string | null;
  data: OrderListResDto | null;
  fetchStatus: 'idle' | 'loading' | 'success' | 'failed';
  fetchError: string | null;
  loadMoreStatus: 'idle' | 'loading' | 'success' | 'failed';
  loadMoreError: string | null;
};

const initialState: CanceledState = {
  loading: false,
  error: null,
  data: null,
  fetchStatus: 'idle',
  fetchError: null,
  loadMoreStatus: 'idle',
  loadMoreError: null,
};

export const fetchCanceledOrders = createAsyncThunk<
  OrderListResDto,
  OrderListReqDto,
  { rejectValue: string }
>(
  'canceled/fetch',
  async (query, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      // Lấy đơn hàng có trạng thái CANCELLED
      params.append('statuses', OrderStatus.CANCELLED);
      if (query.page) params.append('page', String(query.page));
      if (query.limit) params.append('limit', String(query.limit));
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);
      const res = await axiosInstance.get(`/order/my?${params.toString()}`);
      return res.data.data as OrderListResDto;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const fetchCanceledOrdersLoadMore = createAsyncThunk<
  { data: OrderListResDto; page: number },
  OrderListReqDto & { page: number },
  { state: { canceled: CanceledState }, rejectValue: string }
>(
  'canceled/fetchLoadMore',
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

const canceledSlice = createSlice({
  name: 'canceled',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCanceledOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchCanceledOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.fetchStatus = 'success';
      })
      .addCase(fetchCanceledOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
        state.fetchStatus = 'failed';
        state.fetchError = action.payload || 'Lỗi không xác định';
      })
      .addCase(fetchCanceledOrdersLoadMore.pending, (state) => {
        state.loadMoreStatus = 'loading';
        state.loadMoreError = null;
      })
      .addCase(fetchCanceledOrdersLoadMore.fulfilled, (state, action) => {
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
      .addCase(fetchCanceledOrdersLoadMore.rejected, (state, action) => {
        state.loadMoreStatus = 'failed';
        state.loadMoreError = action.payload || 'Lỗi không xác định';
      });
  },
});

export default canceledSlice.reducer; 