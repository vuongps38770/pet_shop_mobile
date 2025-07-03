import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const STORAGE_KEYS = {
  AUTH: 'auth',
  USER: 'user',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  SETTINGS: 'settings',
  CART: 'cart',
  FAVORITES: 'favorites',
  USER_AGENT: 'user_agent',
  PAYMENT_QUEUE: 'payment_queue',
  FCM_TOKEN:'fcm_token'
} as const;

const isWeb = Platform.OS === 'web';

export const storageHelper = {
  setAccessToken: async (token: string) => {
    if (isWeb) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  },
  getAccessToken: async () => {
    if (isWeb) {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    }
  },
  setRefreshToken: async (token: string) => {
    if (isWeb) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  },
  getRefreshToken: async () => {
    if (isWeb) {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },
  setUserData: async (data: any) => {
    const stringified = JSON.stringify(data);
    if (isWeb) {
      localStorage.setItem(STORAGE_KEYS.USER, stringified);
    } else {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, stringified);
    }
  },
  getUserData: async () => {
    const data = isWeb
      ? localStorage.getItem(STORAGE_KEYS.USER)
      : await SecureStore.getItemAsync(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  clearAll: async () => {
    if (isWeb) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER),
      ]);
    }
  },
  getOrCreateWebDeviceId() {
    let deviceId = localStorage.getItem(STORAGE_KEYS.USER_AGENT);
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.USER_AGENT, deviceId);
    }
    return deviceId;
  },


  async getOrCreateMobileDeviceId() {
    let deviceId = await SecureStore.getItemAsync(STORAGE_KEYS.USER_AGENT);
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      SecureStore.setItemAsync(STORAGE_KEYS.USER_AGENT, deviceId);
    }
    return deviceId;
  },

  async getFcmToken(){
    return storage.getString(STORAGE_KEYS.FCM_TOKEN)
  },
  async setFcmToken(token:string){
    await storage.set(STORAGE_KEYS.FCM_TOKEN,token)
  },


  async addToPaymentQueue(paymentId: string) {
    await storage.set(STORAGE_KEYS.PAYMENT_QUEUE, paymentId);
  },
  async getPaymentQueue() {
    return await storage.getString(STORAGE_KEYS.PAYMENT_QUEUE)
  },
  async clearPaymentQueue(){
    await storage.delete(STORAGE_KEYS.PAYMENT_QUEUE)
  }
};



export const storage = {
  set: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  getString: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },
  delete: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
