import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchDeliveredOrders, updateOrderStatus, resetStatus, fetchDeliveredOrdersLoadMore } from '../slices/delivered.slice';
import DeliveredItem from '../components/DeliveredItem';
import OrderDetailModal from '../components/OrderDetailModal';
import { LoadingView } from 'shared/components/LoadingView';
import { OrderStatus } from 'app/types/OrderStatus';
import AppModal from 'shared/components/modals/AppModal';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { useFocusEffect } from '@react-navigation/native';

const DeliveredScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError, updateStatus, updateStatusError, loadMoreStatus } = useSelector((state: RootState) => state.orderDetail.delivered);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [actionOrderId, setActionOrderId] = useState<string>('');
  const navigation = useMainNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    dispatch(fetchDeliveredOrders({ page: 1, limit: 10 })).then((res: any) => {
      setAllOrders(res.payload?.data || []);
      setRefreshing(false);
    });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    (dispatch as any)(fetchDeliveredOrdersLoadMore({ page: nextPage, limit: 10 })).then((res: any) => {
      setAllOrders((prev: any[]) => [...prev, ...(res.payload?.data?.data || [])]);
      setPage(nextPage);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchDeliveredOrders({ page: 1, limit: 10 }));
    }, [dispatch])
  );


  useEffect(() => {
    if (updateStatus === 'success') {
      dispatch(resetStatus());
      setModalVisible(false);
      setConfirmModalVisible(false);
      // Reload data
      dispatch(fetchDeliveredOrders({ page: 1, limit: 10 }));
    }
  }, [updateStatus, dispatch]);

  const handleItemPress = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleConfirmReceived = (orderId: string) => {
    setActionOrderId(orderId);
    setConfirmModalVisible(true);
  };

  const handleConfirmReceivedAction = () => {
    dispatch(updateOrderStatus({
      orderId: actionOrderId,
      nextStatus: OrderStatus.RECEIVED
    }));
  };

  const handleReview = (productId: string) => {
    navigation.navigate('ScreenReviews', { productId: productId })
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  if (fetchStatus === 'loading') {
    return <LoadingView />;
  }

  if (fetchStatus === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{fetchError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchDeliveredOrders({ page: 1, limit: 10 }))}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[
          allOrders.length === 0 && { flex: 1 },
          styles.listContainer,
        ]}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={allOrders}
        renderItem={({ item }) => (
          <DeliveredItem
            order={item}
            onPress={() => handleItemPress(item)}
            onConfirmReceived={handleConfirmReceived}
            onReview={handleReview}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          data?.hasNext ? (
            <TouchableOpacity style={{ marginVertical: 16, alignSelf: 'center', padding: 12, backgroundColor: '#eee', borderRadius: 8 }} onPress={handleLoadMore} disabled={loadMoreStatus === 'loading'}>
              <Text style={{ color: '#333', fontWeight: 'bold' }}>{loadMoreStatus === 'loading' ? 'Đang tải...' : 'Tải thêm'}</Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.errorContainer}>
            <Text style={{ fontSize: 50 }}>📦</Text>
            <Text style={{ color: '#888', fontSize: 16, marginTop: 20 }}>
              Không có đơn hàng nào đã giao/đã nhận
            </Text>
          </View>
        }
      />

      <OrderDetailModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        statusColorMode="green"
        onReview={handleReview}
      />

      <AppModal
        visible={confirmModalVisible}
        title="Xác nhận"
        content="Bạn có chắc chắn muốn xác nhận đã nhận hàng?"
        onPositivePress={handleConfirmReceivedAction}
        onNegativePress={() => setConfirmModalVisible(false)}
        positiveButtonText="Xác nhận"
        negativeButtonText="Hủy"
        onClose={() => setConfirmModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FFAF42',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DeliveredScreen;