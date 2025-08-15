import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "app/config/axios"
import { storageHelper } from "app/config/storage"
import { ApiErrorStatus, StandardApiRespondFailure } from "app/config/types/error"
import axios from "axios"
import { LoginReqDto } from "src/presentation/dto/req/login.req.dto"
import { SignUpReqDto } from "src/presentation/dto/req/signup.req.dto"

type AuthState = {
    isAuthenticated: boolean
    loginStatus: 'pending' | 'logged_in' | 'failed' | 'idle'
    signUptatus: 'pending' | 'succsess' | 'failed' | 'idle'
    checkPhoneStatus: 'pending' | 'succsess' | 'failed' | 'idle' | 'sent' | 'cannot_send' | 'expired' | 'not_match' | 'phone_exist'
    signUpData: SignUpReqDto
    appLoading: boolean;

}

const initialState: AuthState = {
    isAuthenticated: false,
    loginStatus: 'idle',
    signUptatus: 'idle',
    checkPhoneStatus: 'idle',
    appLoading: true,
    signUpData: { name: "", password: "", phone: "", surName: "", otpCode: "" },

}
const AUTH_SLICE_NAME = 'auth'




//ddawng nhaapj
export const login = createAsyncThunk(
    'auth/login',
    async ({ password, phone, userAgent }: LoginReqDto, { rejectWithValue }) => {
        try {
            const respond = await axiosInstance.post('auth/login-phone-or-email', {
                password, phone, userAgent
            })
            await storageHelper.setAccessToken(respond.data.data.accessToken)
            await storageHelper.setRefreshToken(respond.data.data.refreshToken)
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
)

interface LoginOAuthPayload {
  accessToken: string;
  refreshToken: string;
}
export const loginOAuth = createAsyncThunk(
    'auth/loginOauth',
    async ({ accessToken, refreshToken }:LoginOAuthPayload, { rejectWithValue }) => {
        try {
            await storageHelper.setAccessToken(accessToken)
            await storageHelper.setRefreshToken(refreshToken)
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
)


//dang ky
export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ password, name, surName, phone, otpCode }: SignUpReqDto, { rejectWithValue }) => {
        try {
            await axiosInstance.post('auth/signup', {
                password, phone, name, surName,otpCode
            })

        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
)


//dang xuat
export const logOut = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const userAgent = await storageHelper.getOrCreateMobileDeviceId()
            const token = await storageHelper.getAccessToken()
            console.log(userAgent, token);

            await axiosInstance.post('auth/logout', {
                userAgent: userAgent
            })
            await storageHelper.clearAll()
        } catch (error) {
            console.log("thuk err", error);
            return rejectWithValue(error);
        }
    }
)


// kiêm rtra sdt và gửi otp
export const checkPhone = createAsyncThunk(
    'auth/send-phone-otp',
    async (phone: string, { rejectWithValue }) => {
        try {
            await axiosInstance.post('auth/send-phone-otp', {
                phone: phone
            })
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
)

export const sendOtpResetPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: { codeType?: string; message: string } }
>(
  'auth/sendOtpResetPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/send-otp-reset-password', { email });
    } catch (error: any) {
        console.log(error);
        
      return rejectWithValue({
        
        codeType: error?.codeType,
        message: error?.errors?.[0] || error?.message || 'Lỗi không xác định',
      });
    }
  }
);

export const verifyOtpResetPassword = createAsyncThunk<
  { token: string },
  { email: string; otp: string },
  { rejectValue: { codeType?: string; message: string } }
>(
  'auth/verifyOtpResetPassword',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/verify-otp-reset-password', { email, otp });
      return { token: res.data.data.token };
    } catch (error: any) {
      return rejectWithValue({
        codeType: error?.codeType,
        message: error?.errors?.[0] || error.message || 'Lỗi không xác định',
      });
    }
  }
);

export const changePassword = createAsyncThunk<
  void,
  { email: string; password: string; token: string },
  { rejectValue: { codeType?: string; message: string } }
>(
  'auth/changePassword',
  async ({ email, password, token }, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/change-password', { email, password, token });
    } catch (error: any) {
      return rejectWithValue({
        codeType: error?.codeType,
        message: error?.errors?.[0] || error.message || 'Lỗi không xác định',
      });
    }
  }
);




export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            const accessToken = await storageHelper.getAccessToken();
            if (accessToken) {
                return true;
            } else {
                return rejectWithValue("No access token found in storage.");
            }
        } catch (error) {
            console.error("Error reading token from storage:", error);
            await storageHelper.clearAll();
            return rejectWithValue("Failed to check auth status from storage.");
        }
    }
);




const authSlice = createSlice({
    name: AUTH_SLICE_NAME,
    initialState,
    reducers: {
        setRegistrationInfo: (state, action: PayloadAction<SignUpReqDto>) => {
            state.signUpData.name = action.payload.name;
            state.signUpData.password = action.payload.password;
            state.signUpData.phone = action.payload.phone;
            state.signUpData.surName = action.payload.surName;
        },
        setTempOtp: (state, action: PayloadAction<string>) => {
            state.signUpData.otpCode = action.payload;
        },
        clearRegistrationInfo: (state) => {
            state.signUpData.name = '';
            state.signUpData.password = '';
            state.signUpData.phone = '';
            state.signUpData.surName = '';
        },
    },
    extraReducers: (builder) => {
        builder
            /** login */
            .addCase(login.pending, (state) => {
                state.loginStatus = 'pending'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginStatus = 'logged_in'
                state.isAuthenticated = true
            })
            .addCase(login.rejected, (state, action) => {
                state.loginStatus = 'failed'
            })

            /** loginOauth */
            .addCase(loginOAuth.pending, (state) => {
                state.loginStatus = 'pending'
            })
            .addCase(loginOAuth.fulfilled, (state, action) => {
                state.loginStatus = 'logged_in'
                state.isAuthenticated = true
            })
            .addCase(loginOAuth.rejected, (state, action) => {
                state.loginStatus = 'failed'
            })

            /** validate thông tin */
            .addCase(checkPhone.fulfilled, (state, action) => {
                state.checkPhoneStatus = 'sent'
            })

            .addCase(checkPhone.rejected, (state, action) => {
                if (action.payload && typeof action.payload === 'object') {
                    const res = action.payload as StandardApiRespondFailure
                    console.log("test", res.codeType);

                    switch (res.codeType) {
                        case ApiErrorStatus.PHONE_EXISTED:
                            state.checkPhoneStatus = 'phone_exist'
                            break
                        default:
                            state.checkPhoneStatus = 'cannot_send'
                    }
                } else {
                    state.checkPhoneStatus = "cannot_send";
                    console.log(action.payload);

                }
            })

            .addCase(checkPhone.pending, (state, action) => {
                state.checkPhoneStatus = 'pending'
            })





            /** signup và check otp sau khi validate ok */

            .addCase(signUp.rejected, (state, action) => {
                if (action.payload && typeof action.payload === 'object') {
                    const res = action.payload as StandardApiRespondFailure
                    console.log("test", res.codeType);

                    switch (res.codeType) {
                        case ApiErrorStatus.INVALID_OTP:
                            state.checkPhoneStatus = 'not_match'
                            break
                        case ApiErrorStatus.EXPIRED_OTP:
                            state.checkPhoneStatus = 'expired'
                        default:
                            state.checkPhoneStatus = 'failed'
                    }
                } else {
                    state.checkPhoneStatus = "failed";
                    console.log(action.payload);

                }
            })

            .addCase(signUp.fulfilled, (state, action) => {
                state.checkPhoneStatus = 'succsess'
            })













            /* dang cuất */

            .addCase(logOut.fulfilled, (state) => {
                state.isAuthenticated = false
            })


            .addCase(checkAuthStatus.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.appLoading = false;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isAuthenticated = false;
                state.appLoading = false;
            });
    }
})

export default authSlice.reducer

export const { clearRegistrationInfo, setRegistrationInfo, setTempOtp } = authSlice.actions