import { useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
  SignInResponse,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';

type GoogleUser = {
  id: string;
  name: string;
  email: string;
  photo: string;
};

type ServerResponse = {
  token: string;
  userId: string;
  [key: string]: any;
};

export const useGoogleSignIn = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await GoogleSignin.hasPlayServices();
      const userInfo: SignInResponse = await GoogleSignin.signIn();
      const { idToken, accessToken } = await GoogleSignin.getTokens();
      console.log(userInfo);

      
      if ('user' in userInfo && userInfo.user) {
        const user = userInfo.user as any;
        
        
        setUser({
          id: user.id ?? user.user?.id ?? '',
          name: user.name ?? user.user?.name ?? '',
          email: user.email ?? user.user?.email ?? '',
          photo: user.photo ?? user.user?.photo ?? '',
        });
      }

    //   return response.data;
    } catch (err: any) {
      console.log(err);
      console.log(err.code);
      console.log(JSON.stringify(err));
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Bạn đã huỷ đăng nhập');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError('Đăng nhập đang được xử lý');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Thiếu Google Play Services');
      } else {
        setError(err?.message || 'Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    user,
    isLoading,
    error,
  };
};
