// Error codes from API
export enum APIErrorCode {
  // Authentication errors (1000-1999)
  UNAUTHORIZED = 1000,
  INVALID_TOKEN = 1001,
  TOKEN_EXPIRED = 1002,
  INVALID_CREDENTIALS = 1003,
  ACCOUNT_LOCKED = 1004,
  ACCOUNT_DISABLED = 1005,

  // Validation errors (2000-2999)
  VALIDATION_ERROR = 2000,
  INVALID_INPUT = 2001,
  MISSING_REQUIRED_FIELD = 2002,
  INVALID_FORMAT = 2003,
  DUPLICATE_ENTRY = 2004,

  // Business logic errors (3000-3999)
  RESOURCE_NOT_FOUND = 3000,
  RESOURCE_ALREADY_EXISTS = 3001,
  OPERATION_NOT_ALLOWED = 3002,
  INSUFFICIENT_PERMISSIONS = 3003,
  QUOTA_EXCEEDED = 3004,

  // System errors (4000-4999)
  INTERNAL_SERVER_ERROR = 4000,
  SERVICE_UNAVAILABLE = 4001,
  DATABASE_ERROR = 4002,
  EXTERNAL_SERVICE_ERROR = 4003,
  RATE_LIMIT_EXCEEDED = 4004,
}

// Frontend error messages mapping
export const ErrorMessages: Record<APIErrorCode, string> = {
  // Authentication errors
  [APIErrorCode.UNAUTHORIZED]: 'Bạn cần đăng nhập để tiếp tục',
  [APIErrorCode.INVALID_TOKEN]: 'Phiên đăng nhập không hợp lệ',
  [APIErrorCode.TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn',
  [APIErrorCode.INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng',
  [APIErrorCode.ACCOUNT_LOCKED]: 'Tài khoản đã bị khóa',
  [APIErrorCode.ACCOUNT_DISABLED]: 'Tài khoản đã bị vô hiệu hóa',

  // Validation errors
  [APIErrorCode.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
  [APIErrorCode.INVALID_INPUT]: 'Dữ liệu đầu vào không hợp lệ',
  [APIErrorCode.MISSING_REQUIRED_FIELD]: 'Vui lòng điền đầy đủ thông tin',
  [APIErrorCode.INVALID_FORMAT]: 'Định dạng không hợp lệ',
  [APIErrorCode.DUPLICATE_ENTRY]: 'Dữ liệu đã tồn tại',

  // Business logic errors
  [APIErrorCode.RESOURCE_NOT_FOUND]: 'Không tìm thấy dữ liệu',
  [APIErrorCode.RESOURCE_ALREADY_EXISTS]: 'Dữ liệu đã tồn tại',
  [APIErrorCode.OPERATION_NOT_ALLOWED]: 'Không được phép thực hiện thao tác này',
  [APIErrorCode.INSUFFICIENT_PERMISSIONS]: 'Bạn không có quyền thực hiện thao tác này',
  [APIErrorCode.QUOTA_EXCEEDED]: 'Đã vượt quá giới hạn cho phép',

  // System errors
  [APIErrorCode.INTERNAL_SERVER_ERROR]: 'Đã xảy ra lỗi, vui lòng thử lại sau',
  [APIErrorCode.SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng',
  [APIErrorCode.DATABASE_ERROR]: 'Lỗi cơ sở dữ liệu',
  [APIErrorCode.EXTERNAL_SERVICE_ERROR]: 'Lỗi kết nối dịch vụ bên ngoài',
  [APIErrorCode.RATE_LIMIT_EXCEEDED]: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
};

// API Error Response type
export interface APIErrorResponse {
  code: APIErrorCode;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Frontend Error type
export interface AppError {
  code: APIErrorCode;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  isHandled: boolean;
}

// Error handler class
export class ErrorHandler {
  static convertAPIError(error: any): AppError {
    // Default error
    const defaultError: AppError = {
      code: APIErrorCode.INTERNAL_SERVER_ERROR,
      message: ErrorMessages[APIErrorCode.INTERNAL_SERVER_ERROR],
      timestamp: new Date().toISOString(),
      isHandled: false,
    };

    // If error is already an AppError, return it
    if (this.isAppError(error)) {
      return error;
    }

    // If error is from API response
    if (error.response?.data) {
      const apiError = error.response.data as APIErrorResponse;
      return {
        code: apiError.code,
        message: ErrorMessages[apiError.code] || apiError.message,
        details: apiError.details,
        timestamp: apiError.timestamp,
        isHandled: false,
      };
    }

    // If error is network error
    if (error.request) {
      return {
        code: APIErrorCode.SERVICE_UNAVAILABLE,
        message: ErrorMessages[APIErrorCode.SERVICE_UNAVAILABLE],
        timestamp: new Date().toISOString(),
        isHandled: false,
      };
    }

    return defaultError;
  }

  private static isAppError(error: any): error is AppError {
    return (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error &&
      'timestamp' in error &&
      'isHandled' in error
    );
  }
}










export enum ApiErrorStatus {
  PHONE_EXISTED = "PHONE_EXISTED",
  EMAIL_EXISTED = "EMAIL_EXISTED",
  EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
  INVALID_OTP = "INVALID_OTP",
  EXPIRED_OTP = "EXPIRED_OTP",
  EXPIRED_TOKEN = "EXPIRED_TOKEN",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  OTP_INVALID ="OTP_INVALID",
  TOKEN_INVALID="TOKEN_INVALID",
  OAUTH_ACCOUNT_ERR='AUTH_ACCOUNT_ERR'
  
}
export interface StandardApiRespondFailure {
  code: number
  errors: string[]
  path?: string;
  codeType?: ApiErrorStatus | undefined
}
export const mapErr = (err: any): StandardApiRespondFailure => {
  if (err?.response?.data?.errors) {
    return {
      errors: err.response.data.errors,
      code: err.response.data.code || 500,
      codeType: err.response.data.codeType,
      path: err.response.data.path,
    };
  } else if (typeof err === 'string') {
    return {
      errors: [err],
      code: 500,
    };
  } else if (err?.message) {
    return {
      errors: [err.message],
      code: 500,
    };
  } else {
    return {
      errors: ['Unknown error'],
      code: 500,
    };
  }
};