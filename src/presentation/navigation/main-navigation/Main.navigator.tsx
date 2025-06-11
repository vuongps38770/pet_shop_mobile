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

const Stack = createNativeStackNavigator<MainStackParamList>()


const MainNavigator = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getCart());
    }, []);
    return (
        <Stack.Navigator screenOptions={{ animation: 'fade' }} >
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
                name="ProductShow"
                component={ProductShow}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AllCategoriesScreen"
                component={AllCategoriesScreen}
                options={{ headerShown: false }}
            />


        </Stack.Navigator>
    )
}

export default MainNavigator;