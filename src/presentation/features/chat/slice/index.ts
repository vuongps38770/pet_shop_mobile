import { combineReducers } from "@reduxjs/toolkit";
import conservationSlice from './conservation.slice';
const chatSlice = combineReducers({
    conservation: conservationSlice
})

export default chatSlice;