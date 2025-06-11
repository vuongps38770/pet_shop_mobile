import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActivityIndicator, View } from 'react-native';
import { AppStackParamList } from './types';
import MainNavigator from './main-navigation/Main.navigator';
import { AuthNavigator } from './auth-navigation/Auth.navigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';

import {checkAuthStatus} from '../features/auth/auth.slice'

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {appLoading,isAuthenticated} = useSelector((state:RootState)=> state.auth)

  // const isAuthenticated = false

  useEffect(() => {
    const init = async () => {
      dispatch(checkAuthStatus())
    };
    init();
  }, [dispatch,isAuthenticated]);

  if (appLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
