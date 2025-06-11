import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import authReducer from '../features/auth/auth.slice'

import homeSlice from '../features/home/homeSlice'
import productSlice from '../features/product/product.slice'
import cartSlice from '../features/cart/cart.slice'



export const store = configureStore({
  reducer: {
    auth:authReducer,
    home:homeSlice,
    product:productSlice,
    cart:cartSlice
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