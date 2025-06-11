import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import LoginScreen from "../../features/auth/screens/LoginScreen";
import SignUpScreen from "../../features/auth/screens/SignUpScreen";
import ForgotPasswordScreen from "../../features/auth/screens/ForgotPasswordScreen";
import VerifyScreen from "../../features/auth/screens/VerifyScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      

    </Stack.Navigator>
  );
}; 