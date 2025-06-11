import { Platform } from 'react-native';

// Time format options
export type TimeFormat = '12h' | '24h';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type DateTimeFormat = 'full' | 'short' | 'relative' | 'custom';

// Time units in milliseconds
const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// Vietnamese time units
const VI_TIME_UNITS = {
  now: 'vừa xong',
  second: 'giây',
  minute: 'phút',
  hour: 'giờ',
  day: 'ngày',
  week: 'tuần',
  month: 'tháng',
  year: 'năm',
  ago: 'trước',
  later: 'sau',
};

// Format options interface
interface FormatOptions {
  timeFormat?: TimeFormat;
  dateFormat?: DateFormat;
  showSeconds?: boolean;
  showTime?: boolean;
  showDate?: boolean;
  showYear?: boolean;
  showWeekday?: boolean;
  locale?: string;
  customFormat?: string;
}

/**
 * Convert timestamp to formatted date string
 */
export const formatDate = (
  timestamp: number | string | Date,
  options: FormatOptions = {}
): string => {
  const {
    timeFormat = '24h',
    dateFormat = 'DD/MM/YYYY',
    showSeconds = false,
    showTime = true,
    showDate = true,
    showYear = true,
    showWeekday = false,
    locale = 'vi-VN',
  } = options;

  const date = new Date(timestamp);
  
  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: showSeconds ? 'numeric' : undefined,
    hour12: timeFormat === '12h',
  };

  // Format date
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: showYear ? 'numeric' : undefined,
    weekday: showWeekday ? 'long' : undefined,
  };

  let result = '';

  if (showDate) {
    switch (dateFormat) {
      case 'DD/MM/YYYY':
        result += date.toLocaleDateString(locale, dateOptions);
        break;
      case 'MM/DD/YYYY':
        result += date.toLocaleDateString('en-US', dateOptions);
        break;
      case 'YYYY-MM-DD':
        result += date.toISOString().split('T')[0];
        break;
    }
  }

  if (showTime) {
    if (showDate) result += ' ';
    result += date.toLocaleTimeString(locale, timeOptions);
  }

  return result;
};

/**
 * Convert timestamp to relative time string (e.g., "2 giờ trước")
 */
export const getRelativeTime = (
  timestamp: number | string | Date,
  options: { locale?: string } = {}
): string => {
  const { locale = 'vi-VN' } = options;
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Future time
  if (diff < 0) {
    const absDiff = Math.abs(diff);
    if (absDiff < TIME_UNITS.MINUTE) {
      return `${Math.floor(absDiff / TIME_UNITS.SECOND)} ${VI_TIME_UNITS.second} ${VI_TIME_UNITS.later}`;
    }
    if (absDiff < TIME_UNITS.HOUR) {
      return `${Math.floor(absDiff / TIME_UNITS.MINUTE)} ${VI_TIME_UNITS.minute} ${VI_TIME_UNITS.later}`;
    }
    if (absDiff < TIME_UNITS.DAY) {
      return `${Math.floor(absDiff / TIME_UNITS.HOUR)} ${VI_TIME_UNITS.hour} ${VI_TIME_UNITS.later}`;
    }
    if (absDiff < TIME_UNITS.WEEK) {
      return `${Math.floor(absDiff / TIME_UNITS.DAY)} ${VI_TIME_UNITS.day} ${VI_TIME_UNITS.later}`;
    }
    if (absDiff < TIME_UNITS.MONTH) {
      return `${Math.floor(absDiff / TIME_UNITS.WEEK)} ${VI_TIME_UNITS.week} ${VI_TIME_UNITS.later}`;
    }
    if (absDiff < TIME_UNITS.YEAR) {
      return `${Math.floor(absDiff / TIME_UNITS.MONTH)} ${VI_TIME_UNITS.month} ${VI_TIME_UNITS.later}`;
    }
    return `${Math.floor(absDiff / TIME_UNITS.YEAR)} ${VI_TIME_UNITS.year} ${VI_TIME_UNITS.later}`;
  }

  // Past time
  if (diff < TIME_UNITS.MINUTE) {
    return VI_TIME_UNITS.now;
  }
  if (diff < TIME_UNITS.HOUR) {
    return `${Math.floor(diff / TIME_UNITS.MINUTE)} ${VI_TIME_UNITS.minute} ${VI_TIME_UNITS.ago}`;
  }
  if (diff < TIME_UNITS.DAY) {
    return `${Math.floor(diff / TIME_UNITS.HOUR)} ${VI_TIME_UNITS.hour} ${VI_TIME_UNITS.ago}`;
  }
  if (diff < TIME_UNITS.WEEK) {
    return `${Math.floor(diff / TIME_UNITS.DAY)} ${VI_TIME_UNITS.day} ${VI_TIME_UNITS.ago}`;
  }
  if (diff < TIME_UNITS.MONTH) {
    return `${Math.floor(diff / TIME_UNITS.WEEK)} ${VI_TIME_UNITS.week} ${VI_TIME_UNITS.ago}`;
  }
  if (diff < TIME_UNITS.YEAR) {
    return `${Math.floor(diff / TIME_UNITS.MONTH)} ${VI_TIME_UNITS.month} ${VI_TIME_UNITS.ago}`;
  }
  return `${Math.floor(diff / TIME_UNITS.YEAR)} ${VI_TIME_UNITS.year} ${VI_TIME_UNITS.ago}`;
};

/**
 * Format duration in milliseconds to human readable string
 */
export const formatDuration = (
  milliseconds: number,
  options: { showSeconds?: boolean; locale?: string } = {}
): string => {
  const { showSeconds = true, locale = 'vi-VN' } = options;
  
  const hours = Math.floor(milliseconds / TIME_UNITS.HOUR);
  const minutes = Math.floor((milliseconds % TIME_UNITS.HOUR) / TIME_UNITS.MINUTE);
  const seconds = Math.floor((milliseconds % TIME_UNITS.MINUTE) / TIME_UNITS.SECOND);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${VI_TIME_UNITS.hour}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${VI_TIME_UNITS.minute}`);
  }
  if (showSeconds && seconds > 0) {
    parts.push(`${seconds} ${VI_TIME_UNITS.second}`);
  }

  return parts.join(' ');
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date.getTime() < new Date().getTime();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date.getTime() > new Date().getTime();
};

/**
 * Get start and end of day
 */
export const getDayBounds = (date: Date = new Date()): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Add time to a date
 */
export const addTime = (
  date: Date,
  amount: number,
  unit: keyof typeof TIME_UNITS
): Date => {
  return new Date(date.getTime() + amount * TIME_UNITS[unit]);
};

/**
 * Subtract time from a date
 */
export const subtractTime = (
  date: Date,
  amount: number,
  unit: keyof typeof TIME_UNITS
): Date => {
  return new Date(date.getTime() - amount * TIME_UNITS[unit]);
}; 