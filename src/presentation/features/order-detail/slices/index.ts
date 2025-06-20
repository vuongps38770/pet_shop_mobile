import { combineReducers } from '@reduxjs/toolkit';
import waitForPayment from './waitForPayment.slice';

const orderDetailReducer = combineReducers({
  waitForPayment,
  // TODO: add more reducers here if needed
});

export default orderDetailReducer;
