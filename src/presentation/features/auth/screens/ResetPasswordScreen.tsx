import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'shared/theme/colors';
import { SPACING, BORDER_RADIUS } from 'shared/theme/layout';
import { typography } from 'shared/theme/typography';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import { resetPasswordSchema } from 'app/utils/validation';

interface RouteParams {
  identifier: string;
}

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { identifier } = route.params as RouteParams;
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        // TODO: Gửi request đặt lại mật khẩu
        // TODO: Nếu mật khẩu trùng với mật khẩu cũ, hiển thị thông báo lỗi từ server
        // setErrors({ newPassword: 'Mật khẩu mới không được trùng với mật khẩu cũ' });
        // return;

        // Chuyển về màn hình đăng nhập
        (navigation as any).navigate('Login');
      } catch (error: any) {
        console.log("Reset password error: ", error.response || error.message || error);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.default }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={26} color={colors.text.primary} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập mật khẩu mới cho tài khoản của bạn
        </Text>
        
        <View style={[styles.inputContainer, touched.newPassword && errors.newPassword && styles.inputError]}>
          <Icon name="lock-closed-outline" size={22} color={colors.grey[600]} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            placeholderTextColor={colors.grey[400]}
            value={values.newPassword}
            onChangeText={handleChange('newPassword')}
            onBlur={handleBlur('newPassword')}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color={colors.grey[600]} 
            />
          </TouchableOpacity>
        </View>
        {touched.newPassword && errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}

        <View style={[styles.inputContainer, touched.confirmPassword && errors.confirmPassword && styles.inputError]}>
          <Icon name="lock-closed-outline" size={22} color={colors.grey[600]} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            placeholderTextColor={colors.grey[400]}
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon 
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color={colors.grey[600]} 
            />
          </TouchableOpacity>
        </View>
        {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

        <TouchableOpacity 
          style={[styles.button, isSubmitting && styles.buttonDisabled]} 
          onPress={() => handleSubmit()}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.L,
    backgroundColor: colors.background.default,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: '700',
    marginBottom: SPACING.L,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: SPACING.XL,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    marginBottom: SPACING.S,
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    paddingVertical: 6,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginBottom: SPACING.M,
    textAlign: 'left',
  },
  button: {
    backgroundColor: colors.app.primary.main,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: 'center',
    marginTop: SPACING.L,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
}); 