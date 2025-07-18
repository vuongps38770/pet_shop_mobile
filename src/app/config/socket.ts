import { io } from 'socket.io-client';
import { storageHelper } from './storage';
import Constants from 'expo-constants';
const SOCKET_URL = Constants.expoConfig?.extra?.SOCKET_URL
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: {
    token: storageHelper.getAccessToken(), 
  },
});

export default socket;