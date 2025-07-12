import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainStackParamList } from "./types";
import TabNavigator from "./bottom-tabs-navigators/Main.tabs.navigatior";
import ProductDetailScreen from "../../features/product/screens/ProductDetailScreen";
import { ProductShow } from "src/presentation/features/product/screens/ProductShow";
import { AllCategoriesScreen } from "src/presentation/features/product/screens/AllCategoriesScreen";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/presentation/store/store";
import { useEffect } from "react";
import { getCart } from "src/presentation/features/cart/cart.slice";
import { getFavoriteListIds } from "src/presentation/features/favorite/favorite.slice";
import FavoriteScreen from "src/presentation/features/favorite/screens/FavoriteScreen";
import { NewAddressScreen } from "src/presentation/features/address/screens/NewAddressScreen";
import AddressPickScreen from "src/presentation/features/address/screens/AddressPickScreen";
import AllAddressesScreen from "src/presentation/features/address/screens/AllAddressesScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderScreen from "src/presentation/features/order/screens/OrderScreen";
import PendingScreen from "src/presentation/features/order/screens/PendingScreen";
import ProfileDetail from "src/presentation/features/profile/screens/ProfileDetail";
import OrderDetailScreen from "src/presentation/features/order-detail/screens/OrderDetailScreen";
import { VoucherScreen } from "src/presentation/features/voucher/screens/VoucherScreen";
import { MyVoucherScreen } from "src/presentation/features/voucher/screens/MyVoucherScreen";
import PickVoucherScreen from "src/presentation/features/order/screens/PickVoucherScreen";

import ReviewScreen from "src/presentation/features/review/screens/ReviewScreen";
import { usePushNotification } from "shared/hooks/useNotification";
import { useFCMListener } from "shared/hooks/useNotificationListener";
import { BadgeProvider } from "shared/context/BadgeContext";
import { useCheckPaymentQueue } from "shared/hooks/useCheckPaymentQueue";
import { useUserInfo } from "shared/hooks/useUserInfo";
import NotificationScreen from "src/presentation/features/notification/screens/NotificationScreen";
import ExploreScreen from "src/presentation/features/home/screens/ExploreScreen";

const Stack = createNativeStackNavigator<MainStackParamList>()


const MainNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getCart());
    dispatch(getFavoriteListIds());
  }, []);
  usePushNotification();
  useFCMListener()
  useCheckPaymentQueue()
  useUserInfo()
  return (
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ animation: "fade" }}>
          <Stack.Screen
            name="MainScreen"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileDetail"
            component={ProfileDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductShow"
            component={ProductShow}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllCategoriesScreen"
            component={AllCategoriesScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="FavouriteScreen"
            component={FavoriteScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NewAddressScreen"
            component={NewAddressScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AddressPickScreen"
            component={AddressPickScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AllAddressesScreen"
            component={AllAddressesScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="OrderScreen"
            component={OrderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PendingScreen"
            component={PendingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ScreenReviews"
            component={ReviewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VoucherScreen"
            component={VoucherScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyVoucherScreen"
            component={MyVoucherScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PickVoucherScreen"
            component={PickVoucherScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notification"
            component={NotificationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExploreScreen"
            component={ExploreScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaView>

  );
}

export default MainNavigator;