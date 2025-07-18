// hooks/useGoogleDeeplink.ts
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginOAuth } from '../auth.slice';
import { AppDispatch } from 'src/presentation/store/store';

export const useGoogleDeeplink = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [handledUrl, setHandledUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url || url === handledUrl) return;

      if (url.startsWith('petshop://login')) {
        const parsed = new URL(url);
        const accessToken = parsed.searchParams.get('accessToken');
        const refreshToken = parsed.searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
          try {
            await dispatch(loginOAuth({ accessToken, refreshToken }));
            setHandledUrl(url);
          } catch (error: any) {
            console.log('Login error:', error);
          }
        }
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    Linking.getInitialURL().then(handleUrl);

    return () => {
      subscription.remove();
    };
  }, [handledUrl, dispatch]);
};
