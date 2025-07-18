// hooks/useGoogleSignInLauncher.ts
import { Linking, Platform } from 'react-native';
import { storageHelper } from 'app/config/storage';
import Constants from 'expo-constants';
const OAUTH_URL = Constants.expoConfig?.extra?.OAUTH_URL
export const useGoogleSignInLauncher = () => {
  const launchGoogleSignIn = async () => {
    try {
      let deviceId = '';
      if (Platform.OS === 'web') {
        deviceId = storageHelper.getOrCreateWebDeviceId();
      } else {
        deviceId = await storageHelper.getOrCreateMobileDeviceId();
      }

      await Linking.openURL(`${OAUTH_URL}?state=${deviceId}`);
    } catch (error) {
      console.log('Google Sign-In error:', error);
    }
  };

  return {
    launchGoogleSignIn,
  };
};
