import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,

} from "react-native";

import { useFormik } from "formik";
import { verifyOTPSchema } from "app/utils/validation";


import { FormInput } from "shared/components/forms/FormInput";
import { useAuthNavigation } from "shared/hooks/navigation-hooks/useAuthNavigationHooks";
import { BORDER_RADIUS, SPACING } from "shared/theme/layout";
import { colors } from "shared/theme/colors";
import { typography } from "shared/theme/typography";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/presentation/store/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { setTempOtp, signUp } from '../auth.slice'
import Decor from "../components/DecorView";
import { spacing } from "shared/theme/spacing";
const VerifyScreen = () => {
  const navigation = useAuthNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userFormData = useSelector((state: RootState) => state.auth.signUpData)
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.auth.checkPhoneStatus)
  const signUpData = useSelector((state: RootState) => state.auth.signUpData)

  useEffect(() => {
    console.log(signUpData);

    if (status == 'not_match') {
      Alert.alert("sai ma otp")
    }
    else if (status == 'succsess') {
      Alert.alert(
        "Registration Successful",
        "You can now",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    }
    else if (status == 'failed') {
      Alert.alert("co loi ay ra vui long lam lai")
    }
    else if (status == 'expired') {
      Alert.alert("Ma het han")
    }
  }, [status])
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verifyOTPSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        dispatch(setTempOtp(values.otp))
        dispatch(signUp(userFormData))
        //todo 


      } catch (error: any) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Invalid OTP. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <View style={{ position: 'relative', flex: 1, backgroundColor: colors.background.default }}>
      {/** decoảtion view */}
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Decor />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require("../../../../../assets/icons/Vector9.png")} />
          </TouchableOpacity>



          <View style={{ height: spacing["5xl"] }} />

          <Text style={styles.header}>Verify OTP</Text>
          <Text style={styles.description}>
            Please enter the OTP sent to your phone number
          </Text>

          <FormInput
            label="Enter OTP"
            value={values.otp}
            onChangeText={(text: string) => handleChange("otp")(text)}
            onBlur={() => handleBlur("otp")}
            error={touched.otp ? errors.otp : undefined}
            keyboardType="numeric"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />

          <TouchableOpacity
            style={[styles.verifyButton, isSubmitting && styles.buttonDisabled]}
            onPress={() => handleSubmit()}
            disabled={isSubmitting}
          >
            <Text style={styles.verifyText}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={async () => {
              try {
                // await authApi.forgotPassword({ phone: route.params.phone });
                Alert.alert("Success", "OTP has been resent to your phone number");
              } catch (error: any) {
                Alert.alert(
                  "Error",
                  error.response?.data?.message || "Failed to resend OTP. Please try again."
                );
              }
            }}
          >
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>


  );
}

export default VerifyScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.transparent.invincible,
    padding: SPACING.L,
  },
  backButton: {
    marginBottom: -26,
    marginTop: SPACING.M,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: SPACING.L,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: SPACING.XXL,
    marginTop: SPACING.XXL,
  },
  header: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SPACING.M,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.grey[600],
    textAlign: "center",
    marginBottom: SPACING.XL,
    lineHeight: 20,
  },
  verifyButton: {
    backgroundColor: colors.buttun.primary,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginTop: SPACING.L,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: "700",
  },
  resendButton: {
    marginTop: SPACING.M,
    alignItems: "center",
  },
  resendText: {
    color: colors.buttun.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: "500",
  },
}); 