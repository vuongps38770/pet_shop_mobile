import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { storageHelper } from 'app/config/storage';
import { NativeModules } from 'react-native';
import { CalculateOrderPriceReqDto, OrderCreateReqDto, OrderReqItem } from 'src/presentation/dto/req/order.req.dto';
import { CalculateOrderPriceResDto, OrderCheckoutResDto, OrderRespondDto, PaymentStatusResDto, PaymentType } from 'src/presentation/dto/res/order-respond.dto';
const { PayZaloBridge } = NativeModules;
type StateProps = {
  order: CalculateOrderPriceResDto | null,
  caculateOrderReq: CalculateOrderPriceReqDto | null,



  shippingAddressId?: string;
  orderItems?: OrderReqItem[];
  voucherCode?: string;
  totalClientPrice?: number;
  paymentType?: PaymentType;

  orderCheckoutData: OrderCheckoutResDto | null
  createOrderStatus: 'pending' | 'failed' | 'success' | 'idle'
  paymentStatus: PaymentStatusResDto | null
}
const initialState: StateProps = {
  order: null,
  caculateOrderReq: null,
  createOrderStatus: 'idle',
  orderCheckoutData: null,
  paymentStatus: null
}

export const caculateOrder = createAsyncThunk<
  CalculateOrderPriceResDto,
  CalculateOrderPriceReqDto,
  { rejectValue: string }>(
    'order/calculate-price',
    async (orderItemReqDto, { rejectWithValue }) => {
      try {
        const res = await axiosInstance.post(`order/calculate-price`, orderItemReqDto);
        return res.data.data as CalculateOrderPriceResDto;
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
      }
    }
  )


export const createOrder = createAsyncThunk<
  OrderCheckoutResDto,
  OrderCreateReqDto,
  { rejectValue: string }>(
    'order/create-order',
    async (orderItemReqDto, { rejectWithValue }) => {
      try {
        const res = await axiosInstance.post(`order/create-order`, orderItemReqDto);
        const data = res.data.data as OrderCheckoutResDto;
        
        
        if(data.payment?._id){
          await storageHelper.addToPaymentQueue(data.payment._id)
          console.log("debug", data.payment._id);
        }
        return data
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
      }
    }
  )
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



export const payOrderWithZalopay = (trans_token: string) => {
  PayZaloBridge.payOrder(trans_token)
}


const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: () => initialState,
    setShippingAddressId(state, action: PayloadAction<string>) {
      state.shippingAddressId = action.payload;
    },
    setOrderItems(state, action: PayloadAction<OrderReqItem[]>) {
      state.orderItems = action.payload;
    },
    setVoucherCode(state, action: PayloadAction<string>) {
      state.voucherCode = action.payload;
    },
    setTotalClientPrice(state, action: PayloadAction<number>) {
      state.totalClientPrice = action.payload;
    },
    setPaymentType(state, action: PayloadAction<PaymentType>) {
      state.paymentType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(caculateOrder.fulfilled, (state, action) => {
      state.order = action.payload
    })

    builder.addCase(caculateOrder.rejected, (state, action) => {
      console.log(action.payload);
    })

    builder.addCase(createOrder.rejected, (state, action) => {
      state.createOrderStatus = 'failed'
    })
    builder.addCase(createOrder.pending, (state, action) => {
      state.createOrderStatus = 'pending'
    })
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.createOrderStatus = 'success'
      state.orderCheckoutData = action.payload
      if (action.payload.payment?._id) {
        storageHelper.addToPaymentQueue(action.payload.payment?._id)
      }
    })
    builder.addCase(checkOrder.fulfilled, (state, action) => {
      state.paymentStatus = action.payload
    })

  }
});

export const {
  resetOrder,
  setShippingAddressId,
  setOrderItems,
  setVoucherCode,
  setTotalClientPrice,
  setPaymentType,
} = orderSlice.actions;
export default orderSlice.reducer;
