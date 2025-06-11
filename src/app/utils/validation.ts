import * as Yup from 'yup';

const patterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[0-9]{10}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};

const messages = {
  required: 'Trường này là bắt buộc',
  email: 'Email không hợp lệ',
  phone: 'Số điện thoại không hợp lệ',
  password: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số',
  minLength: (field: string, length: number) => `${field} phải có ít nhất ${length} ký tự`,
  maxLength: (field: string, length: number) => `${field} không được vượt quá ${length} ký tự`,
};

export const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(3, 'Password must be at least 3 characters'),
});

export const registerSchema = Yup.object().shape({
  surName: Yup.string()
    .required('Surname is required')
    .min(2, 'Surname must be at least 2 characters'),
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const forgotPasswordSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
});

export const verifyOTPSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits'),
});

export const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

// Profile form validation
export const profileSchema = Yup.object().shape({
  fullName: Yup.string()
    .required(messages.required)
    .min(2, messages.minLength('Họ tên', 2))
    .max(50, messages.maxLength('Họ tên', 50)),
  email: Yup.string()
    .required(messages.required)
    .matches(patterns.email, messages.email),
  phone: Yup.string()
    .required(messages.required)
    .matches(patterns.phone, messages.phone),
  address: Yup.string()
    .required(messages.required)
    .min(5, messages.minLength('Địa chỉ', 5)),
});

// Change password validation
export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required(messages.required),
  newPassword: Yup.string()
    .required(messages.required)
    .matches(patterns.password, messages.password),
  confirmPassword: Yup.string()
    .required(messages.required)
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
}); 