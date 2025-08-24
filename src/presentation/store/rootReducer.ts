import { combineReducers } from '@reduxjs/toolkit';
import auth from '../features/auth/auth.slice';
import home from '../features/home/homeSlice';
import product from '../features/product/product.slice';
import cart from '../features/cart/cart.slice';
import favorite from '../features/favorite/favorite.slice';
import newAddress from '../features/address/address.slice';
import order from '../features/order/order.slice';
import profile from '../features/profile/profile.slice';
import orderDetail from '../features/order-detail/slices';
import voucher from '../features/voucher/voucher.slice';
import review from '../features/review/review.slice';
import pickVoucher from '../features/order/pick-voucher.slice';
import notification from '../features/notification/notification.slice';
import explore from '../features/home/explore.slice';
import chat from '../features/chat/slice';
import blog from '../features/blog/blog.slice';
import app from './slices';

const appReducer = combineReducers({
  global: app,
  auth,
  home,
  product,
  cart,
  favorite,
  newAddress,
  order,
  profile,
  voucher,
  orderDetail,
  review,
  pickVoucher,
  notification,
  explore,
  chat,
  blog
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ALL_STATE') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
