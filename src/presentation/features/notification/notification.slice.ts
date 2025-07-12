import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/config/axios';
import { NotificationRespondDto, NotificationListResponse, GetUserNotificationDto } from 'src/presentation/dto/res/notification-respond.dto';

interface NotificationState {
  data: NotificationRespondDto[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasNext: boolean;
  refreshing: boolean;
  total: number;
  filterType: string;
}

const initialState: NotificationState = {
  data: [],
  loading: false,
  loadingMore: false, 
  error: null,
  page: 1,
  hasNext: true,
  refreshing: false,
  total: 0,
  filterType: 'all',
};

export const fetchNotifications = createAsyncThunk<NotificationListResponse, GetUserNotificationDto>(
  'notification/fetchNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get('/notification', { params });
      const response = res.data?.data || {};
      return {
        data: response.data || [],
        pagination: response.pagination || response.data?.pagination || { page: 1, limit: 10, total: 0 },
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi tải thông báo');
    }
  }
);

export const loadMoreNotifications = createAsyncThunk<NotificationListResponse, GetUserNotificationDto>(
  'notification/loadMoreNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get('/notification', { params });
      const response = res.data?.data || {};
      return {
        data: response.data || [],
        pagination: response.pagination || response.data?.pagination || { page: 1, limit: 10, total: 0 },
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi tải thêm thông báo');
    }
  }
);

export const markAsReadThunk = createAsyncThunk<void, string[]>(
  'notification/markAsReadThunk',
  async (notificationIds, { rejectWithValue }) => {
    try {
      await axios.post('/notification/read', { notificationIds });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi khi đánh dấu đã đọc');
    }
  }
);


const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setFilterType(state, action) {
      state.filterType = action.payload;
      state.page = 1;
      state.hasNext = true;
      state.data = [];
    },
    markAllAsRead(state) {
      state.data = state.data.map(n => ({ ...n, isRead: true }));
    },
    markAsRead(state, action) {
      state.data = state.data.map(n => n._id === action.payload ? { ...n, isRead: true } : n);
    },
    clearNotifications(state) {
      state.data = [];
      state.page = 1;
      state.hasNext = true;
      state.total = 0;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.loadingMore = false; // reset
        state.error = null;
        state.refreshing = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.data = action.payload.data;
        state.page = action.payload.pagination.page;
        state.hasNext = (action.payload.data.length === action.payload.pagination.limit);
        state.total = action.payload.pagination.total;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      .addCase(loadMoreNotifications.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreNotifications.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.refreshing = false;
        state.data = [...state.data, ...action.payload.data];
        state.page = action.payload.pagination.page;
        state.hasNext = (action.payload.data.length === action.payload.pagination.limit);
        state.total = action.payload.pagination.total;
      })
      .addCase(loadMoreNotifications.rejected, (state, action) => {
        state.loadingMore = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });
  }
});

export const { setFilterType, markAllAsRead, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 