import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { LocationDTO, NewAddressRespondDTO } from "../../dto/res/newaddress-respond.dto"


type AddressState = {
  provinces: LocationDTO[];
  districts: LocationDTO[];
  wards: LocationDTO[];
  fetchLocationStatus: "idle" | "pending" | "success" | "error";
  newAddressList: NewAddressRespondDTO[];
};

const initialState: AddressState = {
  provinces: [],
  districts: [],
  wards: [],
  fetchLocationStatus: "idle",
  newAddressList: [],
};

const SLICE_NAME = "new_address";

export const getProvinces = createAsyncThunk<LocationDTO[]>(
  "/getProvinces",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/address/all-province");
      return res.data.data as LocationDTO[];
      
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDistricts = createAsyncThunk<LocationDTO[], string>(
  "/getDistricts",
  async (provinceCode, { rejectWithValue }) => {
    try {

      const res = await axiosInstance.get(`/address/districts`, {
        params: { 'provice-code': provinceCode }, 
      });

      return res.data.data as LocationDTO[];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getWards = createAsyncThunk<LocationDTO[], string>(
  "/getWards",
  async (districtCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/address/wards`, {
        params: { 'districts-code': districtCode }, 
      });

      return res.data.data as LocationDTO[];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const newAddressSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProvinces.pending, (state) => {
        state.fetchLocationStatus = "pending";
      })
      .addCase(getProvinces.fulfilled, (state, action) => {
        state.provinces = action.payload;
        state.fetchLocationStatus = "success";
      })
      .addCase(getProvinces.rejected, (state) => {
        state.fetchLocationStatus = "error";
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
      })
      .addCase(getWards.fulfilled, (state, action) => {
        state.wards = action.payload;
      });
  },
});

export default newAddressSlice.reducer;

export const {} = newAddressSlice.actions;

