import { combineReducers } from "@reduxjs/toolkit";
import conservationSlice from './conservation.slice';
import pickOrder from './pick-order.slice';
const chatSlice = combineReducers({
    conservation: conservationSlice,
    pickOrder,
})

export default chatSlice;