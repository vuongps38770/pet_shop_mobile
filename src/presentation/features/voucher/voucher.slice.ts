import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { VoucherRespondDto, VoucherQueryDto } from "src/presentation/dto/res/voucher-respond";

interface VoucherState {
  data: VoucherRespondDto[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasNext: boolean;
  itemLoading: Record<string, boolean>;
}

const initialState: VoucherState = {
  data: [],
  isLoading: false,
  error: null,
  page: 1,
  hasNext: false,
  itemLoading: {},
};

export const fetchUserVouchers = createAsyncThunk<
  { data: VoucherRespondDto[]; hasNext: boolean },
  VoucherQueryDto,
  { rejectValue: string }
>(
  "voucher/fetchUserVouchers",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/voucher", { params });
      console.log(res.data.data);
      const page = res.data.data as { data: any, total: number, page: number, limit: number }
      return {
        data: res.data.data.data,
        hasNext: res.data.hasNext ?? false,
      };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Lấy voucher thất bại");
    }
  }
);

export const saveUserVouchers = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>(
  "voucher/saveUserVouchers",
  async (voucherId, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/voucher/save", { voucherId });
      return {
        id: voucherId
      };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Lấy voucher thất bại");
    }
  }
);


const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    clearVouchers() {
      return { ...initialState };
    },
    incrementPage(state) {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserVouchers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserVouchers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.page === 1) {
          state.data = action.payload.data;
        } else {
          state.data = [...state.data, ...action.payload.data];
        }
        state.hasNext = action.payload.hasNext;
      })
      .addCase(fetchUserVouchers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      })

      .addCase(saveUserVouchers.pending, (state, action) => {
        const id = action.meta.arg;
        state.itemLoading[id] = true;
      })
      .addCase(saveUserVouchers.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.itemLoading[id] = false;
        const index = state.data.findIndex(v => v._id === id);
        if (index !== -1) {
          state.data[index].is_collected = true;
        }
      })
      .addCase(saveUserVouchers.rejected, (state, action) => {
        const id = action.meta.arg;
        state.itemLoading[id] = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export const { clearVouchers, incrementPage } = voucherSlice.actions;
export default voucherSlice.reducer;
