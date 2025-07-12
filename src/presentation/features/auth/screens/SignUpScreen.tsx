
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Button, Keyboard, ActivityIndicator, Animated } from "react-native";

import { FormInput } from "src/presentation/shared/components/forms/FormInput";
import { SPACING, BORDER_RADIUS } from "../../../shared/theme/layout";
import { colors } from "shared/theme/colors";
import { typography } from "shared/theme/typography";
import { useFormik } from "formik";
import { registerSchema } from "app/utils/validation";
import { useAuthNavigation } from "shared/hooks/navigation-hooks/useAuthNavigationHooks";
import { setRegistrationInfo, checkPhone } from "../auth.slice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/presentation/store/store";
import { SafeAreaView } from "react-native-safe-area-context";
import AvoidKeyboardDummyView from "shared/components/AvoidKeyboardDummyView";
import PawStep from 'assets/images/paw-step.svg';
import Bubbles from 'assets/images/bubbles.svg';
import Decor from "../components/DecorView";
import Icon from 'react-native-vector-icons/Ionicons';


const SignUpScreen = () => {
  const navigation = useAuthNavigation()
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const dispatch = useDispatch<AppDispatch>()
  const phoneStatus = useSelector((state: RootState) => state.auth.checkPhoneStatus)


  useEffect(() => {
    if (phoneStatus == 'phone_exist') {
      Alert.alert("Số điện thoại này đã tồn tại")
    }
    else if (phoneStatus == 'sent') {
      navigation.navigate('Verify')
    } else if (phoneStatus == 'cannot_send') {
      Alert.alert("Lỗi không thể gửi mã xác thực")
    }
    else if (phoneStatus == 'pending') {
      Alert.alert("Đang tải, vui lòng đợi")
    }
    console.log(phoneStatus);

  }, [phoneStatus])
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      surName: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setRegistrationInfo({ name: values.name, password: values.password, phone: values.phone, surName: values.surName }))

        dispatch(checkPhone(values.phone))
        navigation.navigate('Verify')



      } catch (error: any) {
        console.log("Register error dong 54: ", error.response || error.message || error);
        Alert.alert(
          "Đăng ký thất bại",
          error.response?.data?.message || "Vui lòng thử lại sau"
        );
      }
    },
  });
  const pawAnim = useRef(new Animated.Value(-150)).current; 
  const bubblesAnim = useRef(new Animated.Value(-250)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pawAnim, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.spring(bubblesAnim, {
        toValue: -20,
        useNativeDriver: false,
      }),
    ]).start();
    return () => {
      Animated.parallel([
        Animated.timing(pawAnim, {
          toValue: -150,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(bubblesAnim, {
          toValue: -250,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    };
  }, []);
  return (
    <View style={{ position: 'relative', flex: 1, backgroundColor: colors.background.default }}>
      {/** decoảtion view */}
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Decor/>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={styles.container}>
            {(isSubmitting || phoneStatus == "pending") && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 100,
                }}
                pointerEvents="auto"
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}


            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Đăng ký</Text>

              <FormInput
                label="Họ"
                value={values.surName}
                onChangeText={(text: string) => handleChange("surName")(text)}
                onBlur={() => handleBlur("surName")}
                touched={touched.surName}
                error={touched.surName ? errors.surName : undefined}
                placeholder="Nhập họ của bạn"
                leftIcon={
                  <Icon
                    name="person-outline"
                    size={20}
                    color={colors.grey[600]}
                  />
                }
              />

              <FormInput
                label="Tên"
                value={values.name}
                onChangeText={(text: string) => handleChange("name")(text)}
                onBlur={() => handleBlur("name")}
                touched={touched.name}
                error={touched.name ? errors.name : undefined}
                placeholder="Nhập tên đầy đủ của bạn"
                leftIcon={
                  <Icon
                    name="person-outline"
                    size={20}
                    color={colors.grey[600]}
                  />
                }
              />

              <FormInput
                label="Email"
                value={values.email}
                onChangeText={(text: string) => handleChange("email")(text)}
                onBlur={() => handleBlur("email")}
                error={touched.email ? errors.email : undefined}
                touched={touched.email}
                keyboardType="email-address"
                placeholder="Nhập email của bạn"
                autoCapitalize="none"
                leftIcon={
                  <Icon
                    name="mail-outline"
                    size={20}
                    color={colors.grey[600]}
                  />
                }
              />

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

              <FormInput
                label="Xác nhận mật khẩu"
                value={values.confirmPassword}
                onChangeText={(text: string) => handleChange("confirmPassword")(text)}
                onBlur={() => handleBlur("confirmPassword")}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                touched={touched.confirmPassword}
                secureTextEntry={secureConfirmText}
                placeholder="Xác nhận mật khẩu của bạn"
                leftIcon={
                  <Icon
                    name="lock-closed-outline"
                    size={20}
                    color={colors.grey[600]}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setSecureConfirmText(!secureConfirmText)}
                  >
                    <Icon
                      name={secureConfirmText ? "eye-off" : "eye"}
                      size={20}
                      color={colors.black}
                    />
                  </TouchableOpacity>
                }
              />

              <TouchableOpacity
                style={[styles.registerButton, isSubmitting && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <Text style={styles.registerText}>
                  {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>


              <AvoidKeyboardDummyView />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </View>





  );
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.transparent.invincible,
    paddingHorizontal: SPACING.L,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: SPACING.XL,
    marginTop:SPACING.XL,
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
  registerButton: {
    backgroundColor: colors.buttun.primary,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginTop: SPACING.L,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.M,
  },
  loginText: {
    color: colors.grey[600],
    fontSize: typography.fontSize.sm,
  },
  loginLink: {
    color: colors.black,
    fontWeight: "700",
    fontSize: typography.fontSize.sm,
  },
});