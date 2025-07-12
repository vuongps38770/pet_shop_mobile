import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'shared/theme/colors';
import { SPACING, BORDER_RADIUS } from 'shared/theme/layout';
import { typography } from 'shared/theme/typography';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validateInput = (value: string) => {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!value.trim()) return 'Vui lòng nhập số điện thoại hoặc email';
    if (phoneRegex.test(value.trim())) return '';
    if (emailRegex.test(value.trim())) return '';
    return 'Vui lòng nhập đúng số điện thoại hoặc email';
  };

  const handleSubmit = () => {
    const err = validateInput(input);
    if (err) {
      setError(err);
      return;
    }
    
    // TODO: Gửi request tìm tài khoản
    // TODO: Nếu không tìm thấy tài khoản, hiển thị thông báo lỗi
    // setError('Không tìm thấy tài khoản với thông tin này');
    // return;
    
    setError('');
    // Chuyển đến màn hình nhập mật khẩu mới
    (navigation as any).navigate('ResetPassword', { identifier: input.trim() });
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Tìm tài khoản</Text>
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