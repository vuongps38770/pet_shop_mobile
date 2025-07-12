import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../shared/theme/colors';
import { Fonts } from '../../../shared/theme/fonts';
import NotificationItem from '../components/NotificationItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import {
  fetchNotifications,
  loadMoreNotifications,
  setFilterType,
  markAllAsRead,
  markAsRead,
  clearNotifications,
  markAsReadThunk
} from '../notification.slice';
import { NotificationRespondDto } from 'src/presentation/dto/res/notification-respond.dto';
import { useNavigation } from '@react-navigation/native';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';

const TAB_MAP = [
  { key: 'all', label: 'Tất cả', icon: undefined },
  { key: 'order', label: 'Đơn hàng', icon: 'shopping-cart' },
  { key: 'promo', label: 'Khuyến mãi', icon: 'local-offer' },
  { key: 'system', label: 'Hệ thống', icon: 'system-update' },
  { key: 'general', label: 'Khác', icon: 'notifications' },
];

const NotificationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useMainNavigation();
  const notificationState = useSelector((state: RootState) => state.notification);
  const { data, loading, error, page, hasNext, refreshing, filterType } = notificationState;

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 10, type: filterType === 'all' ? undefined : filterType }));
    return () => { dispatch(clearNotifications()); };
  }, [dispatch, filterType]);

  const handleTabChange = (tab: string) => {
    dispatch(setFilterType(tab));
  };

  const handleNotificationPress = (notification: NotificationRespondDto) => {
    dispatch(markAsRead(notification._id));
    dispatch(markAsReadThunk([notification._id]));
    console.log(notification);

    const route = notification.data && typeof notification.data === 'object' ? notification.data.route : undefined;
    switch (route) {
      case '/orders':
        navigation.navigate('MainScreen', { route: 'SearchTab' });
        break;
      default:
        break;
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
    dispatch(markAsReadThunk(data.map((item)=>item._id)));
  };

  const handleLoadMore = () => {
    console.log('onEndReached called', { loading, hasNext, page });
    if (!loading && hasNext) {
      dispatch(loadMoreNotifications({ page: page + 1, limit: 10, type: filterType === 'all' ? undefined : filterType }));
    }
  };

  const unreadCount = data.filter((item: NotificationRespondDto) => !item.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContentFixed}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thông báo</Text>
          </View>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
                <Icon name="done-all" size={20} color={colors.white} />
                <Text style={styles.markAllText}>Đánh dấu đã đọc</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {/* Tab Filter */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TAB_MAP.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, filterType === tab.key && styles.activeTab]}
              onPress={() => handleTabChange(tab.key)}
            >
              {tab.icon && (
                <Icon name={tab.icon} size={16} color={filterType === tab.key ? colors.white : colors.text.secondary} />
              )}
              <Text style={[styles.tabText, filterType === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Notification List */}
      <FlatList
        data={data}
        keyExtractor={(item: NotificationRespondDto) => item._id}
        renderItem={({ item }: { item: NotificationRespondDto }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Icon name="notifications-none" size={64} color={colors.grey[400]} />
              <Text style={styles.emptyTitle}>Không có thông báo</Text>
              <Text style={styles.emptyMessage}>
                Bạn sẽ nhận được thông báo khi có hoạt động mới
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && data.length > 0 ? (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="small" color={colors.app.primary.main} />
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => dispatch(fetchNotifications({ page: 1, limit: 10, type: filterType === 'all' ? undefined : filterType }))}
            tintColor={colors.app.primary.main}
          />
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    backgroundColor: colors.app.primary.main,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContentFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Fonts.roboto.bold,
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.app.primary.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markAllText: {
    fontSize: 12,
    fontFamily: Fonts.roboto.medium,
    color: colors.white,
    marginLeft: 4,
  },
  tabContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
    paddingVertical: 10,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: colors.grey[100],
  },
  activeTab: {
    backgroundColor: colors.app.primary.main,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  activeTabText: {
    color: colors.white,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});