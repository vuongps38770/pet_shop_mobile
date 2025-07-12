import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { VoucherAvailableRes } from 'src/presentation/dto/res/voucher-respond';

interface PickVoucherState {
  availableVouchers: VoucherAvailableRes[];
  selectedVoucher: VoucherAvailableRes | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PickVoucherState = {
  availableVouchers: [],
  selectedVoucher: null,
  isLoading: false,
  error: null,
};

// Thunk để lấy voucher khả dụng cho đơn hàng
export const fetchAvailableVouchersForOrder = createAsyncThunk(
  'pickVoucher/fetchAvailableVouchersForOrder',
  async ({ total }: { total: number }) => {
    try {
      const response = await axiosInstance.get(`/voucher/for-order?total=${total}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách voucher');
    }
  }
);

const pickVoucherSlice = createSlice({
  name: 'pickVoucher',
  initialState,
  reducers: {
    setSelectedVoucher: (state, action: PayloadAction<VoucherAvailableRes | null>) => {
      state.selectedVoucher = action.payload;
    },
    clearSelectedVoucher: (state) => {
      state.selectedVoucher = null;
    },
    clearVouchers: (state) => {
      state.availableVouchers = [];
      state.selectedVoucher = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableVouchersForOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableVouchersForOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableVouchers = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableVouchersForOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Có lỗi xảy ra';
      });
  },
});

export const { setSelectedVoucher, clearSelectedVoucher, clearVouchers } = pickVoucherSlice.actions;
export default pickVoucherSlice.reducer;
