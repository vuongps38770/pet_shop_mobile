export interface NotificationRespondDto {
  _id: string;
  userId: string;
  isBroadcast: boolean;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'general' | string;
  data?: any;
  status: string;
  isRead: boolean;
  image_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
}

export interface NotificationListResponse {
  data: NotificationRespondDto[];
  pagination: NotificationPagination;
}

export interface GetUserNotificationDto {
  page?: number;
  limit?: number;
  type?: 'order' | 'promo' | 'system' | 'general' | string;
} 