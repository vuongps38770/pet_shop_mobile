import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from 'src/presentation/store/store';
import { AppNavigator } from 'src/presentation/navigation/App.navigator';
import SplashScreen from 'src/presentation/shared/components/SplashScreen';
import { useSplashScreen } from 'src/presentation/shared/hooks/useSplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';

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
                </Provider>
            </SafeAreaView>
        </GestureHandlerRootView>



    );
};

export default App;
