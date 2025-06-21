import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from 'src/presentation/store/store';
import { AppNavigator } from 'src/presentation/navigation/App.navigator';
import SplashScreen from 'src/presentation/shared/components/SplashScreen';
import { useSplashScreen } from 'src/presentation/shared/hooks/useSplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import CustomToast from 'src/presentation/shared/components/CustomToast';

const toastConfig = {
  success: (props: any) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type="success"
    />
  ),
  error: (props: any) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type="error"
    />
  ),
  info: (props: any) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type="info"
    />
  ),
};

const AppContent = () => {
    const isReady = useSplashScreen(2500);

    if (!isReady) {
        return <SplashScreen />;
    }
    return (
        <AppNavigator />
    );
};

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Provider store={store}>
                    <AppContent />
                    <Toast config={toastConfig} />
                </Provider>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default App;
