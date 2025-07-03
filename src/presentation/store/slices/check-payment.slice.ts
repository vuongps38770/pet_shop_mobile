import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { PaymentStatusResDto } from "src/presentation/dto/res/order-respond.dto";
type StateProps = {
  paymentStatus: PaymentStatusResDto | null,
  status: 'pending' | 'failed' | 'success' | 'idle'

}
const initialState: StateProps = {
  paymentStatus: null,
  status: 'idle'
}
export const checkOrder = createAsyncThunk<
  PaymentStatusResDto,
  string,
  { rejectValue: string }>(
    'order/check-order',
    async (paymentId, { rejectWithValue }) => {
      try {
        const res = await axiosInstance.get(`payment/payment-status/${paymentId}`,);
        console.log(res.data);
        return res.data.data as PaymentStatusResDto;
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
      }
    }
  )

const checkPaymentSlice = createSlice({
  name: 'check-payment',
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(checkOrder.fulfilled, (state, action) => {
      state.paymentStatus = action.payload,
        state.status = 'success'
    })

  }
});

export const {
  reset
} = checkPaymentSlice.actions;
export default checkPaymentSlice.reducer;
