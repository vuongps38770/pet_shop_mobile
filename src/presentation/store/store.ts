import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from '../features/auth/auth.slice'
import homeSlice from '../features/home/homeSlice'
import productSlice from '../features/product/product.slice'
import cartSlice from '../features/cart/cart.slice'
import favoriteReducer from '../features/favorite/favorite.slice'
import newAddressReducer from '../features/address/address.slice'
import orderSlice from '../features/order/order.slice'
import profileReducer from '../features/profile/profile.slice'; 
import orderDetailReducer from '../features/order-detail/slices';
import voucherReducer from '../features/voucher/voucher.slice';
import reviewReducer from '../features/review/review.slice';
import appReducer from './slices';



export const store = configureStore({
  reducer: {
    global:appReducer,
    auth:authReducer,
    home:homeSlice,
    product:productSlice,
    cart:cartSlice,
    favorite: favoriteReducer,
    newAddress: newAddressReducer,
    order:orderSlice,
    profile: profileReducer,
    voucher: voucherReducer,
    orderDetail:orderDetailReducer,
    review: reviewReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 