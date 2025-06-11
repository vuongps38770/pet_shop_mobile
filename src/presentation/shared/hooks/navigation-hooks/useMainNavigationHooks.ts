import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "src/presentation/navigation/main-navigation/types";

export const useMainNavigation = () => {
    return useNavigation<NativeStackNavigationProp<MainStackParamList>>();
};

export const useMainRoute = <RouteName extends keyof MainStackParamList>() => {
    return useRoute<RouteProp<MainStackParamList, RouteName>>();
};
