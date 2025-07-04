import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { OrderScreenTabParamList } from '../types/type';
import { colors } from 'theme/colors';
import WaitForPaymentScreen from './WaitForPaymentScreen';
import AwaitingConfirmationScreen from './AwaitingConfirmationScreen';
import AwaitingpickupScreen from './AwaitingpickupScreen';
import AwaitingShippingScreen from './AwaitingShippingScreen';
import DeliveredScreen from './DeliveredScreen';
import CanceledScreen from './CanceledScreen';

const Tab = createMaterialTopTabNavigator<OrderScreenTabParamList>();
const OrderDetailScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarActiveTintColor: colors.app.primary.main,       
                tabBarInactiveTintColor: colors.grey[500],     
                tabBarIndicatorStyle: {
                    backgroundColor: colors.app.primary.main,           
                    height: 3,
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: '600',
                },
                tabBarStyle: {
                    backgroundColor: colors.white,           
                    elevation: 0,                         
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                },
            }}
        >
            {/* <Tab.Screen name="WaitForPayment"
                options={{ tabBarLabel: 'Chờ thanh toán' }}
                component={WaitForPaymentScreen} /> */}

            <Tab.Screen name="AwaitingConfirm"
                options={{ tabBarLabel: 'Chờ xác nhận' }}
                component={AwaitingConfirmationScreen} />

            <Tab.Screen name="AwaitingPickup"
                options={{ tabBarLabel: 'Chờ lấy hàng' }}
                component={AwaitingpickupScreen} />

            {/* <Tab.Screen name="AwaitingShipping"
                options={{ tabBarLabel: 'Chờ giao hàng' }}
                component={AwaitingShippingScreen} /> */}

            <Tab.Screen name="Delivered"
                options={{ tabBarLabel: 'Đã giao' }}
                component={DeliveredScreen} />

            <Tab.Screen name="Canceled"
                options={{ tabBarLabel: 'Đã huỷ' }}
                component={CanceledScreen} />
        </Tab.Navigator>
    );
}

export default OrderDetailScreen

const styles = StyleSheet.create({})