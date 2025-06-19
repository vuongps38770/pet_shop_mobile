import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItemDTO, OrderrespondDTO} from 'src/presentation/dto/res/order-respond';

const initialState: OrderrespondDTO = {
  method: 'vnpay',
  items: [],
  subtotal: 0,
  tax: 2,
  delivery: 3,
  total: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderMethod: (state, action: PayloadAction<'vnpay' | 'momo'>) => {
      state.method = action.payload;
    },
    setOrderItems: (state, action: PayloadAction<OrderItemDTO[]>) => {
      state.items = action.payload;

      // Tính subtotal
      state.subtotal = action.payload.reduce(
        (sum, item) => sum + item.promotionalPrice * item.quantity,
        0
      );

      // Tính total
      state.total = state.subtotal + state.tax + state.delivery;
    },
    resetOrder: () => initialState,
  },
});

export const { setOrderMethod, setOrderItems, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;