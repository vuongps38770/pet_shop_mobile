import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { spacing } from 'theme/spacing';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchAwaitingPickupOrders, fetchAwaitingPickupOrdersLoadMore } from '../slices/awaitingPickup.slice';
import AwaitingpickupItem from '../components/AwaitingpickupItem';
import { OrderStatus } from 'app/types/OrderStatus';
import OrderDetailModal from '../components/OrderDetailModal';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { LoadingView } from 'shared/components/LoadingView';

const AwaitingpickupScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError, loadMoreStatus } = useSelector((state: RootState) => state.orderDetail.awaitingPickup);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    setPage(1);
    dispatch(fetchAwaitingPickupOrders({ page: 1 })).then((res: any) => {
      setAllOrders(res.payload?.data || []);
    });
  }, [dispatch]);

  useEffect(() => {
    if (data && data.data && page === 1) {
      setAllOrders(data.data);
    }
  }, [data, page]);

  if (fetchStatus === 'loading') {
    return (
      <LoadingView/>
    );
  }

  if (fetchStatus === 'failed') {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{fetchError}</Text>
      </View>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 50, width: 70, height: 70 }}>📦</Text>
        <Text style={{ color: '#888', fontSize: 16, marginTop: 20 }}>Không có đơn hàng nào đang xử lý</Text>
      </View>
    );
  }

  const handleContactSeller = (order: any) => {
    // Xử lý khi nhấn liên hệ người bán
    console.log('Contact seller for order:', order._id);
  };

  const handleItemPress = (item: any) => {
    setSelectedOrder(item);
    setModalVisible(true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    (dispatch as any)(fetchAwaitingPickupOrdersLoadMore({ page: nextPage })).then((res: any) => {
      setAllOrders(prev => [...prev, ...(res.payload?.data?.data || [])]);
      setPage(nextPage);
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPED':
        return 'Đã giao cho vận chuyển';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'yellow';
      case 'SHIPPED':
        return 'blue';
      default:
        return 'yellow';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allOrders}
        renderItem={({ item }) => (
          <AwaitingpickupItem
            order={item}
            onPress={() => handleItemPress(item)}
            onContactSeller={() => handleContactSeller(item)}
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
      />
      <OrderDetailModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={() => setModalVisible(false)}
        statusColorMode={'blue'}
      />
    </View>
  )
}

export default AwaitingpickupScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})