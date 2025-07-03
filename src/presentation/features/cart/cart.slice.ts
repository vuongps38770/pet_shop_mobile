import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { CartRespondDto } from 'src/presentation/dto/res/cart-respond.dto';
import { CartRequestCreateDto } from 'src/presentation/dto/req/cart.req.dto';

export type CartState = {
  items: CartRespondDto[];
  getCartStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  addToCartStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  removeFromCartStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedIds: string[];
  backupItems?: CartRespondDto[]; // backup cho  updatex
};

const initialState: CartState = {
  items: [],
  getCartStatus: 'idle',
  addToCartStatus: 'idle',
  removeFromCartStatus: 'idle',
  error: undefined,
  selectedIds: [],
  backupItems: undefined,
};

export const getCart = createAsyncThunk<CartRespondDto[], void, { rejectValue: string }>(
  'cart/get-cart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('cart/get-cart');
      return res.data.data as CartRespondDto[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const addToCart = createAsyncThunk<CartRespondDto[], CartRequestCreateDto, { rejectValue: string }>(
  'cart/add-to-cart',
  async (body, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('cart/add-to-cart', body);
      return res.data.data as CartRespondDto[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

export const removeFromCart = createAsyncThunk<CartRespondDto[], string, { rejectValue: string }>(
  'cart/remove',
  async (cartId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`cart/remove`, {data:{cartId: cartId}});
      return res.data.data as CartRespondDto[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.getCartStatus = 'idle';
      state.addToCartStatus = 'idle';
      state.removeFromCartStatus = 'idle';
      state.error = undefined;
      state.selectedIds = [];
      state.backupItems = undefined;
    },
    setSelectedIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    selectAll(state) {
      state.selectedIds = state.items
        .filter(item => !item.isActivate && item.quantity>item.availableStock)
        .map(item => item._id);
    },
    deselectAll(state) {
      state.selectedIds = [];
    },
    resetStatus(state){
        state.getCartStatus='idle';
        state.addToCartStatus='idle';
        state.removeFromCartStatus='idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.getCartStatus = 'loading';
        state.error = undefined;
      })
      .addCase(getCart.fulfilled, (state, action: PayloadAction<CartRespondDto[]>) => {
        state.getCartStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.getCartStatus = 'failed';
        state.error = action.payload as string;
      })

      // Optimistic update cho tăng/giảm số lượng
      .addCase(addToCart.pending, (state, action) => {
        state.addToCartStatus = 'loading';
        state.error = undefined;
        state.backupItems = state.items;
        const { productVariantId, quantity } = action.meta.arg;
        state.items = state.items.map(item =>
          item.productVariantId === productVariantId
            ? { ...item, quantity }
            : item
        );
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartRespondDto[]>) => {
        state.addToCartStatus = 'succeeded';
        state.items = action.payload;
        state.backupItems = undefined;
      })
      .addCase(addToCart.rejected, (state) => {
        state.addToCartStatus = 'failed';
        if (state.backupItems) state.items = state.backupItems;
        state.backupItems = undefined;
      })

      // Optimistic update cho xoá
      .addCase(removeFromCart.pending, (state, action) => {
        state.removeFromCartStatus = 'loading';
        state.error = undefined;
        state.backupItems = state.items;
        const cartId = action.meta.arg;
        state.items = state.items.filter(item => item._id !== cartId);
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartRespondDto[]>) => {
        state.removeFromCartStatus = 'succeeded';
        state.items = action.payload;
        state.backupItems = undefined;
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.removeFromCartStatus = 'failed';
        if (state.backupItems) state.items = state.backupItems;
        state.backupItems = undefined;
      });
  },
});

export const { clearCart, setSelectedIds, selectAll, deselectAll, resetStatus } = cartSlice.actions;
export default cartSlice.reducer;
