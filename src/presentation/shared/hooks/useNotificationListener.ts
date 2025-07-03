import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, NotificationAndroid } from '@notifee/react-native';
import { useEffect } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const useFCMListener = (navigation?: NavigationContainerRef<any>) => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Tạo channel cho Android 8->
      await notifee.createChannel({
        id: 'default',
        name: 'Thông báo chung',
        importance: AndroidImportance.HIGH,
      });

      // 1. App đang mở (foreground)
      const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
        const { notification, data} = remoteMessage;
        console.log(notification);
        const imageUrl = notification?.android?.imageUrl;
        const androidOptions: NotificationAndroid = {
          channelId: 'default',
          ...(imageUrl
            ? {
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: imageUrl,
              },
            }
            : {}),
        }
        console.log('Foreground message:', remoteMessage);

        // TODO: Hiển thị local notification
        await notifee.displayNotification({
          title: notification?.title,
          body: notification?.body,
          android: androidOptions

        });
      });

      // 2. App background và người dùng nhấn vào thông báo
      const unsubscribeOnOpen = messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('🚀 Background: User tapped notification', remoteMessage);
        // TODO: Điều hướng đến màn hình chi tiết
        if (remoteMessage?.data?.orderId && navigation) {
          navigation.navigate('OrderDetail', { id: remoteMessage.data.orderId });
        }
      });

      // 3. App bị kill và mở lại bằng notification
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log('🧊 Cold start: App opened from notification', remoteMessage);
            // TODO: Điều hướng hoặc xử lý tương tự
            if (remoteMessage?.data?.orderId && navigation) {
              navigation.navigate('OrderDetail', { id: remoteMessage.data.orderId });
            }
          }
        });

      return () => {
        unsubscribeOnMessage();
        unsubscribeOnOpen();
      };
    };

    let unsubscribe: (() => void) | undefined;

    setupNotifications().then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
};
