import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "src/presentation/navigation/auth-navigation/types";

export const useAuthNavigation = () => {
    return useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
};

export const useAuthRoute = <RouteName extends keyof AuthStackParamList>() => {
    return useRoute<RouteProp<AuthStackParamList, RouteName>>();
};