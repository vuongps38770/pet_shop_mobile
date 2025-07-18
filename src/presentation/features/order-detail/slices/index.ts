import { combineReducers } from '@reduxjs/toolkit';
import waitForPayment from './waitForPayment.slice';
import awaitingConfirmation from './awaitingConfirmation.slice';
import awaitingPickup from './awaitingPickup.slice';
import canceled from './canceled.slice';
import delivered from './delivered.slice';
import allDetails from './orderAlldetail.slice';
import orderLog from './orderLog.slice';

const orderDetailReducer = combineReducers({
  waitForPayment,
  awaitingConfirmation,
  awaitingPickup,
  canceled,
  delivered,
  allDetails,
  orderLog
  // TODO: add more reducers here if needed
});

export default orderDetailReducer;
