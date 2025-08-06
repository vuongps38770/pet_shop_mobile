import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { Platform } from 'react-native';
import { storageHelper } from './storage';
import { APIErrorCode, ErrorHandler, mapErr } from './types/error';
import Constants from 'expo-constants';
const BASE_API_URL = Constants.expoConfig?.extra?.BASE_URL
// export const BASE_URL = 'http://192.168.2.107:3000';

// Base URL configuration
export const BASE_URL = Platform.select({
  ios: BASE_API_URL,
  android: BASE_API_URL,
  default: BASE_API_URL,
});

// export const BASE_URL = Platform.select({
//   ios: 'https://pet-shop-api-server.onrender.com',
//   android: 'https://pet-shop-api-server.onrender.com',
//   default: 'https://pet-shop-api-server.onrender.com',
// });






// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from MMKV storage
      const token = await storageHelper.getAccessToken();

      // If token exists, add to headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(ErrorHandler.convertAPIError(error));
  }
);


// Response interceptor
axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response) {
      console.log('Mã lỗi:', error.response.status);
      console.log('Dữ liệu lỗi:', error.response.data)

    } else if (error.request) {
      console.error('Lỗi không có phản hồi từ server:', error.request);
    } else {
      console.error('Lỗi khác:', error.message);
    }
    // Handle 401 Unauthorized error
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Get refresh token from MMKV
        const refreshToken = await storageHelper.getRefreshToken();

        if (refreshToken) {
          // Call refresh token API
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
            userAgent: await storageHelper.getOrCreateMobileDeviceId()
          });

          const { accessToken, newRefreshToken } = response.data;
          console.log(accessToken);

          // Save new tokens to MMKV
          storageHelper.setAccessToken(accessToken);
          storageHelper.setRefreshToken(newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        storageHelper.clearAll();
        return Promise.reject(ErrorHandler.convertAPIError({
          code: APIErrorCode.TOKEN_EXPIRED,
          message: 'Phiên đăng nhập đã hết hạn',
          timestamp: new Date().toISOString(),
        }));
      }
    }

    return Promise.reject(mapErr(error));
  }

);




export default axiosInstance; 