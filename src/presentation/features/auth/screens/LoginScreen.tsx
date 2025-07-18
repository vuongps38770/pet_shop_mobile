import React from 'react'
import { useAuthNavigation } from '../../../shared/hooks/navigation-hooks/useAuthNavigationHooks';
import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Pressable,
  Linking,
} from "react-native";
import { FormInput } from '../../../shared/components/forms/FormInput';
import { BORDER_RADIUS, SPACING } from "../../../shared/theme/layout";
import { colors } from "../../../shared/theme";
import { typography } from "../../../shared/theme";
import { assets } from "../../../shared/theme/assets";
import { useFormik } from "formik";
import { loginSchema } from "../../../../app/utils/validation";
import { storageHelper } from 'app/config/storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { login, loginOAuth } from '../auth.slice';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import PawStep from 'assets/images/paw-step.svg';
import Bubbles from 'assets/images/bubbles.svg';
import Decor from '../components/DecorView';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDeeplink } from 'shared/hooks/useDeeplink';
import { useGoogleDeeplink } from '../hooks/useGoogleDeeplink';
import { useGoogleSignInLauncher } from '../hooks/useGoogleSignInLauncher';



const LoginScreen = () => {
  const authNav = useAuthNavigation()
  const [secureText, setSecureText] = useState(true);
  const dispatch = useDispatch<AppDispatch>()
  const loginStatus = useSelector((state: RootState) => state.auth.loginStatus)
  useEffect(() => {
    if (loginStatus == 'failed') {
      Alert.alert("Đăng nhập thất bại");
    }
  }, [loginStatus])
  useGoogleDeeplink(); // ✅ tự động xử lý deeplink

  const { launchGoogleSignIn } = useGoogleSignInLauncher();



  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setValues,
  } = useFormik({
    initialValues: {
      phone: "0812053515",
      password: "123123",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        let deviceId = "";
        if (Platform.OS === "web") {
          deviceId = storageHelper.getOrCreateWebDeviceId();
        } else {
          deviceId = await storageHelper.getOrCreateMobileDeviceId();
        }
        await dispatch(login({ password: values.password, phone: values.phone, userAgent: deviceId }))

      } catch (error: any) {
        console.log("Login error:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định";

      }
    },
  });



  return (
    <View style={{ position: 'relative', flex: 1, backgroundColor: colors.background.default }}>
      {/** decoảtion view */}
      <Decor />

      <View style={styles.container}>

        <View style={{ marginBottom: SPACING.XXL * 3 }} />
        <Text style={styles.title}>Đăng nhập</Text>
        <FormInput
          label="Số điện thoại"
          value={values.phone}
          onChangeText={(text: string) => handleChange("phone")(text)}
          onBlur={() => handleBlur("phone")}
          error={touched.phone ? errors.phone : undefined}
          touched={touched.phone}
          keyboardType="phone-pad"
          placeholder="Nhập số điện thoại của bạn"
          leftIcon={
            <Icon
              name="call-outline"
              size={20}
              color={colors.grey[600]}
            />
          }
        />
        <FormInput
          label="Mật khẩu"
          value={values.password}
          onChangeText={(text: string) => handleChange("password")(text)}
          onBlur={() => handleBlur("password")}
          error={touched.password ? errors.password : undefined}
          touched={touched.password}
          secureTextEntry={secureText}
          placeholder="Nhập mật khẩu của bạn"
          leftIcon={
            <Icon
              name="lock-closed-outline"
              size={20}
              color={colors.grey[600]}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Icon
                name={secureText ? "eye-off" : "eye"}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          style={styles.forgot}
          onPress={() => authNav.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <Pressable
          style={[styles.loginButton, isSubmitting && styles.buttonDisabled]}
          onPress={() => handleSubmit()}
          disabled={isSubmitting}
        >
          <Text style={styles.loginText}>
            {(isSubmitting || (loginStatus == 'pending')) ? "Đang đăng nhập..." : "Đăng nhập"}
          </Text>
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => authNav.navigate('Register')}>
            <Text style={styles.signupLink}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.orText}>hoặc</Text> */}

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.socialButton} onPress={() => { launchGoogleSignIn() }}>
            <Image source={assets.images.Google} style={styles.socialIcon} />
            <Text style={styles.socialText}>Tiếp tục với Google</Text>
          </TouchableOpacity>
        </View>


        {/* <Text style={styles.orText}>hoặc</Text>

        <TouchableOpacity>
          <Text style={styles.guestText}>Tiếp tục với tư cách khách</Text>
        </TouchableOpacity> */}
      </View>
    </View>

  );
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.transparent.invincible,
    padding: SPACING.L,
    justifyContent: "center",
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: "700",
    alignSelf: "flex-start",
    marginBottom: SPACING.XL,
  },
  prefixContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.S,
  },
  prefixText: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    marginRight: SPACING.XS,
  },
  arrowIcon: {
    width: 12,
    height: 8,
    marginLeft: SPACING.XS,
  },
  icon: {
    width: 23,
    height: 15,
    tintColor: colors.black,
  },
  forgot: {
    alignSelf: "flex-end",
    marginTop: SPACING.S,
  },
  forgotText: {
    color: colors.grey[800],
    fontSize: typography.fontSize.sm,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.buttun.primary,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginTop: SPACING.L,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: SPACING.M,
  },
  signupText: {
    color: colors.grey[600],
    fontSize: typography.fontSize.sm,
  },
  signupLink: {
    color: colors.black,
    fontWeight: "700",
    fontSize: typography.fontSize.sm,
  },
  orText: {
    textAlign: "center",
    color: colors.grey[600],
    marginVertical: SPACING.M,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey[600],
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    justifyContent: "center",
    marginVertical: SPACING.S,
    flex: 1
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: SPACING.S,
  },
  socialText: {
    fontSize: typography.fontSize.md,
    fontWeight: "500",
  },
  guestText: {
    textAlign: "center",
    color: colors.grey[600],
    textDecorationLine: "underline",
    fontSize: typography.fontSize.sm,
  },
});