import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { OrderListReqDto } from "src/presentation/dto/req/order.req.dto";
import { OrderListResDto } from "src/presentation/dto/res/order-respond.dto";

export const fetchOrders = createAsyncThunk<
  OrderListResDto,
  OrderListReqDto,
  { rejectValue: string }
>(
  'pickOrder/fetch',
  async (query, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', String(query.page));
      if (query.limit) params.append('limit', String(query.limit));
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);
      const res = await axiosInstance.get(`/order/my?${params.toString()}`);
      return res.data.data as OrderListResDto;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Lỗi không xác định');
    }
  }
);