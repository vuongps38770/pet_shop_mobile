import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../shared/theme/colors';
import { Fonts } from '../../../shared/theme/fonts';
import { NotificationRespondDto } from 'src/presentation/dto/res/notification-respond.dto';

export interface NotificationItemProps {
  item: NotificationRespondDto;
  onPress: (notification: NotificationRespondDto) => void;
}

const ORDER_STATUS_MAP: Record<string, { icon: string; color: string; message: string }> = {
  PENDING: { icon: 'hourglass-empty', color: colors.orange.main, message: 'Đơn hàng của bạn đã được đặt thành công' },
  CONFIRMED: { icon: 'check-circle', color: colors.green.main, message: 'Đơn hàng của bạn đã được xác nhận' },
  PROCESSING: { icon: 'autorenew', color: colors.blue.main, message: 'Đơn hàng của bạn đang được xử lý' },
  SHIPPING: { icon: 'local-shipping', color: colors.blue.main, message: 'Đơn hàng của bạn đang được giao' },
  DELIVERED: { icon: 'done-all', color: colors.green.main, message: 'Đơn hàng của bạn đã được giao thành công' },
  CANCELLED: { icon: 'cancel', color: colors.red.main, message: 'Đơn hàng của bạn đã bị hủy' },
  REFUNDED: { icon: 'undo', color: colors.purple.main, message: 'Đơn hàng của bạn đã được hoàn tiền' },
  PAYMENT_SUCCESSFUL: { icon: 'payments', color: colors.green.main, message: 'Bạn đã thanh toán thành công đơn hàng' },
  SHIPPED: { icon: 'local-shipping', color: colors.blue.main, message: 'Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển' },
};

const TYPE_ICON_MAP: Record<string, { icon: string; color: string }> = {
  order: { icon: 'shopping-cart', color: colors.blue.main },
  promo: { icon: 'local-offer', color: colors.red.main },
  system: { icon: 'system-update', color: colors.orange.main },
  general: { icon: 'notifications', color: colors.app.primary.main },
};

function getOrderStatusInfo(item: NotificationRespondDto) {
  if (item.type === 'order' && item.data && item.data.orderStatus) {
    const status = item.data.orderStatus;
    if (ORDER_STATUS_MAP[status]) {
      return ORDER_STATUS_MAP[status];
    }
  }
  return null;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress }) => {
  let icon = 'notifications';
  let iconColor = colors.app.primary.main;
  let message = item.message;

  const orderStatusInfo = getOrderStatusInfo(item);
  if (orderStatusInfo) {
    icon = orderStatusInfo.icon;
    iconColor = orderStatusInfo.color;
    message = orderStatusInfo.message;
  } else if (TYPE_ICON_MAP[item.type]) {
    icon = TYPE_ICON_MAP[item.type].icon;
    iconColor = TYPE_ICON_MAP[item.type].color;
  }


  const route = item.data && typeof item.data === 'object' ? item.data.route : undefined;

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}> 
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {message}
          </Text>
          <Text style={styles.notificationTime}>{item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : ''}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.app.primary.main,
    backgroundColor: colors.app.primary.lightest,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.hint,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.app.primary.main,
    marginTop: 4,
  },
});

export default NotificationItem; 