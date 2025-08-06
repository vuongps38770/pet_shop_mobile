import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderListResDto } from 'src/presentation/dto/res/order-respond.dto';
import { fetchOrders } from './pick-order.thunk';

interface PickOrderState {
  orders: OrderListResDto | null;
  loading: boolean;
  error: string | null;
  currentSelectedOrderId: string | null;
}

const initialState: PickOrderState = {
  orders: null,
  loading: false,
  error: null,
  currentSelectedOrderId: null,
};

const pickOrderSlice = createSlice({
  name: 'pickOrder',
  initialState,
  reducers: {
    setCurrentSelectedOrderId: (state, action: PayloadAction<string | null>) => {
      state.currentSelectedOrderId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { setCurrentSelectedOrderId } = pickOrderSlice.actions;
export default pickOrderSlice.reducer;
