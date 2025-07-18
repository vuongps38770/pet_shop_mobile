import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { OrderListResDto, OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';

export interface OrderAllDetailState {
  data: OrderRespondDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderAllDetailState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDetails = createAsyncThunk<
  OrderRespondDto,
  string,
  { rejectValue: string }
>(
  'orderAllDetail/fetch',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/order/${orderId}/detail`);
      console.log(res.data.data);
      return res.data.data as OrderRespondDto;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

const orderAllDetailSlice = createSlice({
  name: 'orderAllDetail',
  initialState,
  reducers: {
    clearOrderDetail: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { clearOrderDetail } = orderAllDetailSlice.actions;
export default orderAllDetailSlice.reducer;

