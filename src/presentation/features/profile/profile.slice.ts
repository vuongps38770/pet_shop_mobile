import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';
import { UserInfoRespondDto } from 'src/presentation/dto/res/profile.respond.dto';

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

export const getUserInfo = createAsyncThunk<UserInfoRespondDto, void, { rejectValue: string }>(
  'user/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/users/me');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Fetch user info failed');
    }
  }
);

export const updateAvatar = createAsyncThunk<
  UserInfoRespondDto,
  { uri: string; type: string; name: string },
  { rejectValue: string }
>('user/updateAvatar', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const res = await axiosInstance.post('/users/update-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Upload avatar failed');
  }
});

export const updateProfile = createAsyncThunk<
  UserInfoRespondDto,
  Partial<Omit<UserInfoRespondDto, 'avatar' | 'createdAt'>>,
  { rejectValue: string }
>('user/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/users/update-info', payload);

    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Update profile failed');
  }
});

export const sendOtpAddEmail = createAsyncThunk<
  void,
  string,
  { rejectValue: { codeType?: string; message: string } }
>(
  'profile/sendOtpAddEmail',
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/send-otp-add-email', { email });
    } catch (error: any) {
      console.log(error);
      
      return rejectWithValue({
        codeType: error?.codeType,
        message: error?.errors?.[0] || error.message || 'Lỗi không xác định',
      });
    }
  }
);

export const verifyOtpAddEmail = createAsyncThunk<
  void,
  { email: string; otp: string },
  { rejectValue: { codeType?: string; message: string } }
>(
  'profile/verifyOtpAddEmail',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/verify-otp-add-email', { email, otp });
    } catch (error: any) {
      return rejectWithValue({
        codeType: error?.codeType,
        message: error?.errors?.[0] || error.message || 'Lỗi không xác định',
      });
    }
  }
);

const profileSlice = createSlice({
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
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default profileSlice.reducer;
