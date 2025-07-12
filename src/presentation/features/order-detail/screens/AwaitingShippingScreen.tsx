import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AwaitingShippingItem from '../components/AwaitingShippingItem';
import { spacing } from 'theme/spacing';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchDeliveredOrders, fetchDeliveredOrdersLoadMore } from '../slices/delivered.slice';

const AwaitingShippingScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError, loadMoreStatus } = useSelector((state: RootState) => state.orderDetail.delivered);
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    setPage(1);
    dispatch(fetchDeliveredOrders({ page: 1 })).then((res: any) => {
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
      <View style={styles.center}>
        <Text>Đang tải...</Text>
      </View>
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
        <Text style={{ color: '#888', fontSize: 16, marginTop: 20 }}>Không có đơn hàng nào đang giao</Text>
      </View>
    );
  }

  const handleContactSeller = (order: any) => {
    // Xử lý khi nhấn Contact Seller
    console.log('Contact Seller:', order._id);
  };
  const handlePressOrder = (order: any) => {
    // Xử lý khi nhấn vào đơn hàng
    console.log('Press Order:', order._id);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    (dispatch as any)(fetchDeliveredOrdersLoadMore({ page: nextPage })).then((res: any) => {
      setAllOrders(prev => [...prev, ...(res.payload?.data?.data || [])]);
      setPage(nextPage);
    });
  };

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={allOrders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <AwaitingShippingItem
            order={item}
            onContactSeller={handleContactSeller}
            onPress={handlePressOrder}
          />
        )}
        ListFooterComponent={
          data?.hasNext ? (
            <TouchableOpacity style={{ marginVertical: 16, alignSelf: 'center', padding: 12, backgroundColor: '#eee', borderRadius: 8 }} onPress={handleLoadMore} disabled={loadMoreStatus === 'loading'}>
              <Text style={{ color: '#333', fontWeight: 'bold' }}>{loadMoreStatus === 'loading' ? 'Đang tải...' : 'Tải thêm'}</Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={{ }}
      /> */}
    </View>
  );
};

export default AwaitingShippingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});