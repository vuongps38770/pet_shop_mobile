import { useEffect } from 'react';
import { Linking } from 'react-native';

export const useDeeplink = (onHandleUrl: (url: string) => void) => {
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      onHandleUrl(url);
    };

    const linkingListener = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      linkingListener.remove();
    };
  }, [onHandleUrl]);
};
