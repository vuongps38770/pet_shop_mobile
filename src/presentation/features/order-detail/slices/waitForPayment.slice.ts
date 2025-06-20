import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { OrderListReqDto } from 'src/presentation/dto/req/order.req.dto';
import { OrderListResDto } from 'src/presentation/dto/res/order-respond.dto';

export type WaitForPaymentState = {
  loading: boolean;
  error: string | null;
  data: OrderListResDto | null;
};

const initialState: WaitForPaymentState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchWaitForPaymentOrders = createAsyncThunk<
  OrderListResDto,
  OrderListReqDto,
  { rejectValue: string }
>(
  'waitForPayment/fetch',
  async (query, { rejectWithValue }) => {
    console.log(query);

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
      return res.data.data as OrderListResDto;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

const waitForPaymentSlice = createSlice({
  name: 'waitForPayment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaitForPaymentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWaitForPaymentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWaitForPaymentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default waitForPaymentSlice.reducer; 