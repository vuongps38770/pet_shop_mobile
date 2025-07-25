import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { LocationDTO, NewAddressRespondDTO } from "../../dto/res/newaddress-respond.dto"
import { AddressResDto, AddressSuggestionRespondDto } from "../../dto/res/address.respond.dto"

import Constants from 'expo-constants';
import { AddressReqDto } from "src/presentation/dto/req/address.req.dto";

const LOCATIONIQ_API_KEY = Constants.expoConfig?.extra?.LOCATIONIQ_API_KEY
type AddressState = {
  provinces: LocationDTO[];
  districts: LocationDTO[];
  wards: LocationDTO[];
  fetchLocationStatus: "idle" | "pending" | "success" | "error";
  newAddressList: NewAddressRespondDTO[];


  addressSuggestionList: AddressSuggestionRespondDto[],
  fetchAddressSuggestionStatus: "idle" | "pending" | "success" | "error";

  searchedLocation: AddressSuggestionRespondDto | null

  userAddressData: AddressReqDto | null
  createAddressStatus: "idle" | "pending" | "success" | "error";
  createAddressError: string | null;
  myAddresses: AddressResDto[];
  fetchMyAddressesStatus: "idle" | "pending" | "success" | "error";
  fetchMyAddressesError: string | null;
};

const initialState: AddressState = {
  provinces: [],
  districts: [],
  wards: [],
  fetchLocationStatus: "idle",
  newAddressList: [],
  addressSuggestionList: [],
  fetchAddressSuggestionStatus: 'idle',
  userAddressData: null,


  searchedLocation: null,
  createAddressStatus: "idle",
  createAddressError: null,
  myAddresses: [],
  fetchMyAddressesStatus: "idle",
  fetchMyAddressesError: null
};

const SLICE_NAME = "address";

export const getSuggestionPlace = createAsyncThunk<AddressSuggestionRespondDto[], { lat?: number; lon?: number; plainText: string }, { rejectValue: string }>(
  '/getSuggestPlace',
  async ({ lat, lon, plainText }, { rejectWithValue }) => {
    try {
      const viewbox =
        lat != null && lon != null
          ? `&viewbox=${lon - 0.1},${lat + 0.1},${lon + 0.1},${lat - 0.1}&bounded=1`
          : '';

      const proximity =
        lat != null && lon != null ? `&proximity=${lat},${lon}` : '';
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(plainText)}&limit=5&accept-language=vi${viewbox}${proximity}`
      );

      const json = await res.json() as AddressSuggestionRespondDto[]
      return json
    } catch (err) {
      console.error('Lỗi khi lấy gợi ý autocomplete:', err);
      return rejectWithValue('Lỗi khi lấy gợi ý autocomplete:');
    }
  }
)



export const searchPlace = createAsyncThunk<AddressSuggestionRespondDto[], { plainText: string }, { rejectValue: string }>(
  '/searchPlace',
  async ({ plainText }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(plainText)}&format=json`
      );
      console.log(res);
      
      const json = await res.json() as AddressSuggestionRespondDto[]
      console.log("data",json);
      return json
    } catch (err) {
      console.log('Lỗi khi lấy searrch:', err);
      return rejectWithValue('Lỗi khi lấy searrch:');
    }
  }
)








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

export const createAddress = createAsyncThunk<AddressResDto, AddressReqDto, { rejectValue: string }>(
  '/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/address/create-address', addressData);
      return response.data as AddressResDto;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo địa chỉ mới');
    }
  }
);

export const getMyAddresses = createAsyncThunk<AddressResDto[], void, { rejectValue: string }>(
  '/getMyAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/address/my');
      return response.data.data as AddressResDto[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách địa chỉ');
    }
  }
);

const newAddressSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clearSuggest(state) {
      state.addressSuggestionList = []
    },
    setUserAddressData(state, action: PayloadAction<AddressReqDto>) {
      state.userAddressData = action.payload
    },
    resetCreateAddressStatus(state) {
      state.createAddressStatus = "idle";
      state.createAddressError = null;
    },
    resetFetchMyAddressesStatus(state) {
      state.fetchMyAddressesStatus = "idle";
      state.fetchMyAddressesError = null;
    },
    resetUserAddressData(state) {
      state.userAddressData = null;
    }
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
      })






      .addCase(getSuggestionPlace.fulfilled, (state, action) => {
        state.fetchAddressSuggestionStatus = 'success'
        state.addressSuggestionList = action.payload
      })

      .addCase(getSuggestionPlace.pending, (state, action) => {
        state.fetchAddressSuggestionStatus = 'pending'
      })
      .addCase(getSuggestionPlace.rejected, (state, action) => {
        state.fetchAddressSuggestionStatus = 'error'
      })




      .addCase(searchPlace.fulfilled, (state, action) => {
        state.searchedLocation = action.payload[0] || null
      })

      .addCase(createAddress.pending, (state) => {
        state.createAddressStatus = "pending";
        state.createAddressError = null;
      })
      .addCase(createAddress.fulfilled, (state) => {
        state.createAddressStatus = "success";
        state.createAddressError = null;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.createAddressStatus = "error";
        state.createAddressError = action.payload || 'Lỗi không xác định';
      })






      
      .addCase(getMyAddresses.pending, (state) => {
        state.fetchMyAddressesStatus = "pending";
        state.fetchMyAddressesError = null;
      })
      .addCase(getMyAddresses.fulfilled, (state, action) => {
        state.fetchMyAddressesStatus = "success";
        state.fetchMyAddressesError = null;
        state.myAddresses = action.payload;
      })
      .addCase(getMyAddresses.rejected, (state, action) => {
        state.fetchMyAddressesStatus = "error";
        state.fetchMyAddressesError = action.payload || 'Lỗi không xác định';
      });
  },
});

export default newAddressSlice.reducer;

export const { clearSuggest, setUserAddressData, resetCreateAddressStatus, resetFetchMyAddressesStatus, resetUserAddressData } = newAddressSlice.actions;

