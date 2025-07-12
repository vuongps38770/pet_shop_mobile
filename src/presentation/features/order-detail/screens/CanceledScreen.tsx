import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchCanceledOrders, fetchCanceledOrdersLoadMore } from '../slices/canceled.slice';
import CanceledItem from '../components/CanceledItem';
import OrderDetailModal from '../components/OrderDetailModal';
import { LoadingView } from 'shared/components/LoadingView';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { OrderReqItem } from 'src/presentation/dto/req/order.req.dto';

const CanceledScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError, loadMoreStatus } = useSelector((state: RootState) => state.orderDetail.canceled);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<OrderRespondDto[]>([]);
  const navigation = useMainNavigation()
  useEffect(() => {
    setPage(1);
    dispatch(fetchCanceledOrders({ page: 1 })).then((res: any) => {
      setAllOrders(res.payload?.data || []);
    });
  }, [dispatch]);

  useEffect(() => {
    if (data && data.data && page === 1) {
      setAllOrders(data.data);
    }
  }, [data, page]);

  if (fetchStatus === 'loading') {
    return <LoadingView />;
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
        <Text style={{ fontSize: 50, width: 70, height: 70 }}>❌</Text>
        <Text style={{ color: '#888', fontSize: 16, marginTop: 20 }}>Không có đơn hàng nào đã hủy</Text>
      </View>
    );
  }

  const handleBuyAgain = (order: OrderRespondDto) => {

    // Xử lý khi nhấn Mua lại
    console.log('Buy again:', order);
    navigation.navigate('OrderScreen', {
      reOrderItems: order.orderDetailItems.map((item ):OrderReqItem => ({
        quantity:item.quantity,
        variantId:item.variantId
      }))
    })
  };

  const handleItemPress = (item: any) => {
    setSelectedOrder(item);
    setModalVisible(true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    (dispatch as any)(fetchCanceledOrdersLoadMore({ page: nextPage })).then((res: any) => {
      setAllOrders(prev => [...prev, ...(res.payload?.data?.data || [])]);
      setPage(nextPage);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allOrders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <CanceledItem
            order={item}
            onBuyAgain={handleBuyAgain}
            onPress={() => handleItemPress(item)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
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
        statusColorMode="red"
      />
    </View>
  );
};

export default CanceledScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});