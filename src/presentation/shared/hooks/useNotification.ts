import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { updateFcmToken } from 'src/presentation/store/slices/fcm.slice';
import { storageHelper } from 'app/config/storage';
export const usePushNotification = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { status } = useSelector((state: RootState) => state.global.fcmReducer)
    const handleToken = async (newToken: string) => {
        const oldToken = await storageHelper.getFcmToken();

        if (oldToken === newToken) {
            console.log('FCM token chưa đổi');
            return;
        }

        const userAgent = await storageHelper.getOrCreateMobileDeviceId();
        await dispatch(updateFcmToken({ token: newToken, userAgent }));
        const resultAction = await dispatch(updateFcmToken({ token: newToken, userAgent }));

        if (updateFcmToken.rejected.match(resultAction)) {
            console.error('FCM token update failed');
            return;
        }
        await storageHelper.setFcmToken(newToken);
    };

    const requestAndroidNotificationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    useEffect(() => {
        const setup = async () => {
            try {
                let permissionGranted = true;

                if (Platform.OS === 'android') {
                    permissionGranted = await requestAndroidNotificationPermission();
                } else {
                    const authStatus = await messaging().requestPermission();
                    permissionGranted =
                        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
                }
                if (permissionGranted) {
                    console.log('Notification permission granted.');

                    // 2. Lấy FCM token
                    const token = await messaging().getToken();
                    console.log(' FCM Token:', token);

                    handleToken(token)


                } else {
                    console.warn('Notification permission denied.');
                }
            } catch (err) {
                console.error(' Lỗi khi setup notification:', err);
            }
        };

        setup();


    }, []);
};
