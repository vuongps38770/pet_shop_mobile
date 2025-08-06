import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';

export enum OrderAction {
  CANCEL_ORDER = "CANCEL_ORDER",
  CREATE_ORDER = "CREATE_ORDER",
  CONFIRM_ORDER = "CONFIRM_ORDER",
  SHIPPING_ORDER = "SHIPPING_ORDER",
  CONFIRM_PAYMENT = "CONFIRM_PAYMENT",
  COMPLETE_ORDER = "COMPLETE_ORDER",
  RETURN_ORDER = "RETURN_ORDER",
  REFUND_ORDER = "REFUND_ORDER",
  WAIT_PAYMENT_ORDER = "WAIT_PAYMENT_ORDER",
  PROCESS_ORDER = "PROCESS_ORDER",
  DELIVER_ORDER = "DELIVER_ORDER",
  FAIL_DELIVERY_ORDER = "FAIL_DELIVERY_ORDER"
}

export type OrderLogDto = {
  _id: string;
  orderId: string;
  action: OrderAction;
  performed_by: 'SYSTEM' | 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface OrderLogState {
  data: OrderLogDto[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderLogState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchOrderLogs = createAsyncThunk<
  OrderLogDto[],
  string,
  { rejectValue: string }
>(
  'orderLog/fetchAll',
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/order-log/all/${orderId}`);
      console.log(res.data.data);
      return res.data.data as OrderLogDto[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

const orderLogSlice = createSlice({
  name: 'orderLog',
  initialState,
  reducers: {
    clearOrderLogs: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { clearOrderLogs } = orderLogSlice.actions;
export default orderLogSlice.reducer;


// Hàm dịch action sang tiếng Việt
export const translateOrderAction = (action: OrderAction): string => {
  switch (action) {
    case OrderAction.CANCEL_ORDER:
      return 'Hủy đơn';
    case OrderAction.CREATE_ORDER:
      return 'Tạo đơn';
    case OrderAction.CONFIRM_ORDER:
      return 'Xác nhận đơn';
    case OrderAction.SHIPPING_ORDER:
      return 'Đang chờ bàn giao';
    case OrderAction.CONFIRM_PAYMENT:
      return 'Xác nhận thanh toán';
    case OrderAction.COMPLETE_ORDER:
      return 'Hoàn thành đơn';
    case OrderAction.RETURN_ORDER:
      return 'Trả hàng';
    case OrderAction.REFUND_ORDER:
      return 'Hoàn tiền';
    case OrderAction.DELIVER_ORDER:
      return 'Bắt đầu giao hàng';
    case OrderAction.FAIL_DELIVERY_ORDER:
      return 'Giao hàng thất bại';
    case OrderAction.PROCESS_ORDER:
      return 'Xử lý đơn';
    case OrderAction.WAIT_PAYMENT_ORDER:
      return 'Chờ thanh toán';
    default:
      return action;
  }
}; 