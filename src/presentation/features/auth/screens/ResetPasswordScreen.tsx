import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/presentation/store/store';
import { changePassword } from '../auth.slice';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuthNavigation } from 'shared/hooks/navigation-hooks/useAuthNavigationHooks';
import { colors } from 'shared/theme/colors';
import { AuthStackParamList } from 'src/presentation/navigation/auth-navigation/types';

const ResetPasswordScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useAuthNavigation();
  type RouteProps = RouteProp<AuthStackParamList, 'ResetPassword'>
  const route = useRoute<RouteProps>();
  const identifier = route.params.identifier
  const email = route.params.email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await dispatch(changePassword({ email, password, token: identifier })).unwrap();
      setSuccess(true);
    } catch (err: any) {
      if (err?.codeType === 'TOKEN_INVALID') {
        setError('Token không hợp lệ hoặc đã hết hạn');
      } else {
        setError(err?.message || 'Đặt lại mật khẩu thất bại');
      }
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.default }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>Đặt lại mật khẩu thành công!</Text>}
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#ccc' }]}
          onPress={success ? handleBackToLogin : handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{success ? 'Quay lại đăng nhập' : 'Đặt lại mật khẩu'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.app.primary.main,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.app.primary.main,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default ResetPasswordScreen; 