import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'shared/theme/colors';
import { SPACING, BORDER_RADIUS } from 'shared/theme/layout';
import { typography } from 'shared/theme/typography';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/presentation/store/store';
import axiosInstance from 'app/config/axios';
import { sendOtpResetPassword } from '../auth.slice';
import { useAuthNavigation } from 'shared/hooks/navigation-hooks/useAuthNavigationHooks';

const ForgotPasswordScreen = () => {
  const navigation = useAuthNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInput = (value: string) => {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!value.trim()) return 'Vui lòng nhập số điện thoại hoặc email';
    if (phoneRegex.test(value.trim())) return '';
    if (emailRegex.test(value.trim())) return '';
    return 'Vui lòng nhập đúng số điện thoại hoặc email';
  };

  const handleSubmit = async () => {
    const err = validateInput(input);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await dispatch(sendOtpResetPassword({ email: input.trim() })).unwrap();
      setLoading(false);
      navigation.navigate('VerifyOtpResetPassword',{email:input});
    } catch (err: any) {
      setLoading(false);
      if (err?.codeType === 'EMAIL_NOT_FOUND') {
        setError('Không tìm thấy email này');
      } else if (err?.codeType === 'OAUTH_ACCOUNT_ERR') {
        setError('Tài khoản này đăng nhập bằng Google/Apple, không thể đặt lại mật khẩu qua email');
      } else {
        setError(err?.message || 'Gửi OTP thất bại');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.default }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={26} color={colors.text.primary} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập số điện thoại hoặc email để tìm tài khoản của bạn
        </Text>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={22} color={colors.grey[600]} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại hoặc Email"
            placeholderTextColor={colors.grey[400]}
            value={input}
            onChangeText={text => {
              setInput(text);
              setError('');
            }}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Đang gửi...' : 'Tìm tài khoản'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ForgotPasswordScreen

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
    marginBottom: SPACING.M,
    borderWidth: 1,
    borderColor: colors.grey[200],
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
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.app.primary.main,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: 'center',
    marginTop: SPACING.L,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
});