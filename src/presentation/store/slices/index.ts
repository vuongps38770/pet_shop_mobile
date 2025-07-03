import { combineReducers } from "@reduxjs/toolkit";
import fcmReducer from './fcm.slice'
import checkPaymentReducer from './check-payment.slice'
import userInfoReducer from './user-info.slice'

const appReducer = combineReducers({
    fcmReducer,
    checkPaymentReducer,
    userInfoReducer
});

export default appReducer;