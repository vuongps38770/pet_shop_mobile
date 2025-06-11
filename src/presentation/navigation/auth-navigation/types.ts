export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Verify:undefined
  ResetPassword: { phone: string; otp: string };
};
