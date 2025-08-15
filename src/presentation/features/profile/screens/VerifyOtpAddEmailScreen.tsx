import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/presentation/store/store';
import { verifyOtpAddEmail } from '../profile.slice';
import { colors } from 'src/presentation/shared/theme/colors';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';


const VerifyOtpAddEmailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  type RouteProps = RouteProp<MainStackParamList, 'VerifyOtpAddEmailScreen'>
  const route = useRoute<RouteProps>();
  const email = route.params.email
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigation = useMainNavigation()
  useEffect(() => {
    setCountdown(60);
    setOtp('');
    setError(null);
    setSuccess(false);
    if (!email) setError('Không tìm thấy email');
  }, [email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await dispatch(verifyOtpAddEmail({ email, otp })).unwrap();
      setSuccess(true);
    } catch (err: any) {
      if (err?.codeType === 'TOKEN_INVALID') {
        setError('OTP không hợp lệ hoặc đã hết hạn');
      } else if (err?.codeType === 'USER_NOT_FOUND') {
        setError('Không tìm thấy người dùng');
      } else {
        setError(err?.message || 'Xác thực OTP thất bại');
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực OTP Email</Text>
      <Text style={styles.label}>Email: <Text style={{ color: colors.app.primary.main }}>{email}</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />
      <Text style={styles.countdown}>Mã OTP sẽ hết hạn sau: <Text style={{ color: 'red' }}>{countdown}s</Text></Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>Xác thực thành công!</Text>}
      {success ?
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#ccc' }]}
          onPress={() => {navigation.pop(2)}}
          disabled={loading || !otp.trim()}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleVerify}
        disabled={loading || !otp.trim()}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác thực</Text>}
      </TouchableOpacity>  
    }
    </View>
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
  label: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 4,
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
  countdown: {
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default VerifyOtpAddEmailScreen; 