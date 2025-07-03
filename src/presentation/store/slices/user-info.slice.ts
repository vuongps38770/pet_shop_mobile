import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "app/config/axios";
import { UserInfoRespondDto } from "src/presentation/dto/res/profile.respond.dto";

export const getUserInfo = createAsyncThunk<UserInfoRespondDto, void, { rejectValue: string }>(
  'userInfo/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/users/me');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Fetch user info failed');
    }
  }
);

interface ProfileState {
  data: UserInfoRespondDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
};
const userInfoSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error';
      })
  },
});

export default userInfoSlice.reducer;
