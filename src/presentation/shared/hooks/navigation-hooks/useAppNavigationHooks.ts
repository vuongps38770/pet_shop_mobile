import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "src/presentation/navigation/types";

export const useAppNavigation = () => {
    return useNavigation<NativeStackNavigationProp<AppStackParamList>>();
};

export const useAuthRoute = <RouteName extends keyof AppStackParamList>() => {
    return useRoute<RouteProp<AppStackParamList, RouteName>>();
};