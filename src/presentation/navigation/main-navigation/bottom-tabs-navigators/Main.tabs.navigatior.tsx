import { Animated, Image, Text, View } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { assets } from "../../../shared/theme/assets";
import { colors, sizes } from "../../../shared/theme"
import HomeScreen from "../../../features/home/screens/HomeScreen";
import ProfileScreen from "../../../features/profile/screens/ProfileScreen";
import { MainBottomTabParamList, MainBottomTabRouteName } from "./types";
import CartScreen from "src/presentation/features/cart/screens/CartScreen";

import HomeIcon from 'assets/icons/bottomTab/home-active.svg'
import UserIcon from 'assets/icons/bottomTab/user-active.svg'
import CartIcon from 'assets/icons/bottomTab/cart-active.svg'
import OrderIcon from "assets/icons/bottomTab/order-active.svg"
import HomeIconUnactive from 'assets/icons/bottomTab/home-unactive.svg'
import UserIconUnactive from 'assets/icons/bottomTab/user-unactive.svg'
import CartIconUnactive from 'assets/icons/bottomTab/cart-unactive.svg'
import OrderIconUnactive from "assets/icons/bottomTab/order-unactive.svg"
import OrderDetailScreen from "src/presentation/features/order-detail/screens/OrderDetailScreen";
import { useBadgeContext } from "shared/context/BadgeContext";
import { useRoute } from "@react-navigation/native";



const TabNavigator = () => {
  const route = useRoute();
  const labels: Record<MainBottomTabRouteName, string> = {
    HomeTab: "Trang Chủ",
    SearchTab: "Đơn hàng",
    CartTab: "Giỏ hàng",
    ProfileTab: "Cá nhân",
  };

  const Tab = createBottomTabNavigator<MainBottomTabParamList>();
  const animationRef = useRef(new Animated.Value(0)).current;

  // Lấy route từ params để focus vào tab cụ thể
  const getInitialRouteName = (): MainBottomTabRouteName => {
    const params = route.params as { route?: MainBottomTabRouteName };
    if (params?.route) {
      return params.route;
    }
    return 'HomeTab';
  };

  const getTabIcon = (routeName: MainBottomTabRouteName, focused: boolean) => {
    const { badgeTabs } = useBadgeContext();
    const showBadge = badgeTabs.includes(routeName);
    return (
      <Animated.View
        style={focused ? { transform: [{ translateY: animationRef }] } : {}}
      >
        {routeName === "HomeTab" && (
          (focused ? <HomeIcon width={20} height={20} /> : <HomeIconUnactive width={20} height={20} />)
        )}
        {routeName === "SearchTab" && (
          (focused ? <OrderIcon width={20} height={20} /> : <OrderIconUnactive width={20} height={20} />)
        )}
        {routeName === "CartTab" &&
          (focused ? <CartIcon width={30} height={30} /> : <CartIconUnactive width={30} height={30} />)
        }
        {routeName === "ProfileTab" &&
          (focused ? <UserIcon width={28} height={28} fill={colors.white} /> : <UserIconUnactive width={28} height={28} fill={colors.black} />)
        }
        {showBadge && (
          <View
            style={{
              position: "absolute",
              top: -1,
              right: 2,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "red",
            }}
          />
        )}
      </Animated.View>
    );
  };

  useEffect(() => {
    if (animationRef) {
      Animated.spring(animationRef, {
        toValue: -1,
        friction: 3,
        tension: 40,
        useNativeDriver: false,
      }).start(() => {
        animationRef.setValue(0);
      });
    }
  }, [animationRef]);

  return (
    <Tab.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.app.primary.main,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          height: 70,
          paddingTop: 10,
          gap: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
          marginHorizontal: 5
        },
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => {
          if (focused) {
            animationRef.setValue(0);
            Animated.spring(animationRef, {
              toValue: -10,
              friction: 3,
              tension: 40,
              useNativeDriver: false,
            }).start();
          }
          return getTabIcon(route.name as MainBottomTabRouteName, focused);
        },
        tabBarLabel: ({ focused }) => {
          return (
            <Text
              style={{
                fontSize: 10,
                fontWeight: focused ? "bold" : "normal",
                color: focused ? colors.white : colors.black,
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {labels[route.name as MainBottomTabRouteName]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="SearchTab" component={OrderDetailScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
