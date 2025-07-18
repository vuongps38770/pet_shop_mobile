import React, { use, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/presentation/store/store';
import { sendOtpAddEmail } from '../profile.slice';
import { colors } from 'src/presentation/shared/theme/colors';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';

const AddEmailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigation = useMainNavigation();
  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Vui lòng nhập email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email không hợp lệ';
    return null;
  };
  
  const handleSendOtp = async () => {
    const errMsg = validateEmail(email);
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await dispatch(sendOtpAddEmail(email)).unwrap();
      setSuccess(true);
      
    } catch (err: any) {
      console.log("err", err);

      if (err?.codeType === 'EMAIL_EXISTED') {
        setError('Email đã tồn tại');
      } else {
        setError(err?.message || 'Gửi OTP thất bại');
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigation.navigate('VerifyOtpAddEmailScreen',{email});
      }, 1000);
    }
  }, [success, navigation, email]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm email mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email mới"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>Đã gửi OTP tới email!</Text>}
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gửi OTP</Text>}
      </TouchableOpacity>
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

export default AddEmailScreen; 