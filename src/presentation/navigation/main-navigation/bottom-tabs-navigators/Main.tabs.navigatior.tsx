import { Animated, Image, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { assets } from "../../../shared/theme/assets";
import { colors, sizes } from "../../../shared/theme"
import HomeScreen from "../../../features/home/screens/HomeScreen";
import ProfileScreen from "../../../features/profile/screens/ProfileScreen";
import { MainBottomTabParamList, MainBottomTabRouteName } from "./types";
import CartScreen from "src/presentation/features/cart/screens/CartScreen";

import HomeIcon from 'assets/icons/home.svg'
import UserIcon from 'assets/icons/user.svg'
import CartIcon from 'assets/icons/cart.svg'
import SearchIcon from 'assets/icons/Search.svg'



const TabNavigator = () => {
  const labels: Record<MainBottomTabRouteName, string> = {
    HomeTab: "Trang Chủ",
    SearchTab: "Loại",
    CartTab: "Giỏ hàng",
    ProfileTab: "Cá nhân",
  };

  const Tab = createBottomTabNavigator<MainBottomTabParamList>();
  const animationRef = useRef(new Animated.Value(0)).current;

  const getTabIcon = (routeName: MainBottomTabRouteName, focused: boolean) => {
    return (
      <Animated.View
        style={focused ? { transform: [{ translateY: animationRef }] } : {}}
      >
        {routeName === "HomeTab" && (
          <HomeIcon width={28} height={28} fill={focused ? colors.white : colors.grey['500']} />
        )}
        {routeName === "SearchTab" && (
          <SearchIcon width={28} height={28} fill={focused ? colors.white : colors.grey['500']} />
        )}
        {routeName === "CartTab" &&
          <CartIcon width={28} height={28} fill={focused ? colors.white : colors.grey['500']} />
        }
        {routeName === "ProfileTab" &&
          <UserIcon width={28} height={28} fill={focused ? colors.white : colors.grey['500']} />
        }
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
      <Tab.Screen name="SearchTab" component={ProfileScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
      


    </Tab.Navigator>
  );
};

export default TabNavigator;
