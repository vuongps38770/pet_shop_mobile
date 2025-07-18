import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/presentation/store/store';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors } from 'shared/theme/colors';
import { AuthStackParamList } from 'src/presentation/navigation/auth-navigation/types';
import { verifyOtpResetPassword } from '../auth.slice';
import { useAuthNavigation } from 'shared/hooks/navigation-hooks/useAuthNavigationHooks';

const VerifyOtpResetPasswordScreen = () => {
    type RouteProps = RouteProp<AuthStackParamList, 'VerifyOtpResetPassword'>
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<RouteProps>();
    const email = route.params.email
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [token, setToken] = useState<string | null>(null);
    const navigation = useAuthNavigation();

    useEffect(() => {
        setCountdown(60);
        setOtp('');
        setError(null);
        setSuccess(false);
    }, [email]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (success && token) {
            navigation.navigate('ResetPassword', { identifier: token,email:email });
        }
    }, [success, token, navigation]);

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await dispatch(verifyOtpResetPassword({ email, otp })).unwrap();
            setToken(res.token);
            setSuccess(true);
            
        } catch (err: any) {
            if (err?.codeType === 'OTP_INVALID') {
                setError('Mã OTP không hợp lệ hoặc đã hết hạn');
            } else {
                setError(err?.message || 'Xác thực OTP thất bại');
            }
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background.default }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Xác thực OTP đặt lại mật khẩu</Text>
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
                {error && <Text style={styles.error}>{
                    typeof error === 'string' ? error : (error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Có lỗi xảy ra')
                }</Text>}
                {success && <Text style={styles.success}>Xác thực thành công!</Text>}
                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: '#ccc' }]}
                    onPress={handleVerify}
                    disabled={loading || !otp.trim()}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác thực</Text>}
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

export default VerifyOtpResetPasswordScreen; 