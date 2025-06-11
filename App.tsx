import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppNavigator } from './src/presentation/navigation/App.navigator';
import { store } from 'src/presentation/store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    /* todo: sau này thêm store */
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <AppNavigator />
        </GestureHandlerRootView>

      </SafeAreaView>
    </Provider>
  );
}
