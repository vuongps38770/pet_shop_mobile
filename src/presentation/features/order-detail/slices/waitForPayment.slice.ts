import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { OrderListReqDto } from 'src/presentation/dto/req/order.req.dto';
import { OrderListResDto } from 'src/presentation/dto/res/order-respond.dto';

export type WaitForPaymentState = {
  loading: boolean;
  error: string | null;
  data: OrderListResDto | null;
  payUrl: string | null


  getUrlStatus: "failed" | "success" | "idle" | "loading"

  updateStatus: "idle" | "loading" | "success" | "failed";
  updateStatusError: string | null;
};

const initialState: WaitForPaymentState = {
  loading: false,
  error: null,
  data: null,
  updateStatus: "idle",
  updateStatusError: null,

  getUrlStatus: "idle",
  payUrl: null
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

export const updateOrderStatus = createAsyncThunk<
  any,
  { orderId: string; nextStatus: string },
  { rejectValue: string }
>(
  'waitForPayment/updateOrderStatus',
  async ({ orderId, nextStatus }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/order/${orderId}/status`, { nextStatus });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const fetchZaloPayUrl = createAsyncThunk<
  string,
  { orderId: string; paymentUrl: string },
  { rejectValue: string }
>(
  'paymentUrl/fetchZaloPayUrl',
  async (body, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/payment/zalopay-get-payment-url', body);
      console.log(res.data.data);

      return res.data.data as string;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);


const waitForPaymentSlice = createSlice({
  name: 'waitForPayment',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.updateStatus = "idle";
      state.updateStatusError = null;
      state.getUrlStatus = "idle";
      state.payUrl = null;
      state.error = null;
    },
  },
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
      })




      .addCase(fetchZaloPayUrl.pending, (state) => {
        state.getUrlStatus = "loading";
        state.error = null;
      })
      .addCase(fetchZaloPayUrl.fulfilled, (state, action) => {
        state.getUrlStatus = "success";
        state.payUrl = action.payload;
      })
      .addCase(fetchZaloPayUrl.rejected, (state, action) => {
        state.getUrlStatus = "failed";
        state.error = action.payload || 'Lỗi không xác định';
      })








      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = "loading";
        state.updateStatusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = "success";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateStatusError = action.payload || 'Lỗi không xác định';
      })
  },
});

export const { resetStatus } = waitForPaymentSlice.actions;
export default waitForPaymentSlice.reducer; 