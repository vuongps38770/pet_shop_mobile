export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Verify: undefined;
  ResetPassword: { identifier: string,email:string };
  VerifyOtpResetPassword:{
    email:string
  }
};
