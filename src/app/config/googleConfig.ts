import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  try {
    GoogleSignin.configure({
      webClientId: '',
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: false,
    });
    console.log('GoogleSignin configured successfully!');
  } catch (error) {
    console.error('Error configuring GoogleSignin:', error);
  }
};
