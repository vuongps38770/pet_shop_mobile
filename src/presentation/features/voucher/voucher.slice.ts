import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Voucher, VoucherStatus } from "../../dto/res/voucher-respond.dto";


interface VoucherState {
  allVouchers: Voucher[];
}

const initialState: VoucherState = {
  allVouchers: [
    {
      id: "v1",
      title: "Giảm 50k cho đơn hàng từ 300k",
      discount: "50.000đ",
      condition: "Đơn từ 300.000đ",
      expiry: "2025-12-31",
      type: "discount",
      status: "available",
    },
    {
      id: "v2",
      title: "Miễn phí vận chuyển",
      discount: "Miễn phí ship",
      condition: "Đơn từ 100.000đ",
      expiry: "2025-12-31",
      type: "freeship",
      status: "available",
    },
  ],
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    updateVoucherStatus: (
      state,
      action: PayloadAction<{ id: string; status: VoucherStatus }>
    ) => {
      const voucher = state.allVouchers.find((v) => v.id === action.payload.id);
      if (voucher) {
        voucher.status = action.payload.status;
      }
    },
  },
});

export const { updateVoucherStatus } = voucherSlice.actions;
export default voucherSlice.reducer;
