import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchCanceledOrders } from '../slices/canceled.slice';
import CanceledItem from '../components/CanceledItem';
import OrderDetailModal from '../components/OrderDetailModal';
import { LoadingView } from 'shared/components/LoadingView';

const CanceledScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError } = useSelector((state: RootState) => state.orderDetail.canceled);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchCanceledOrders({}));
  }, [dispatch]);

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

  const handleBuyAgain = (order: any) => {
    // Xử lý khi nhấn Mua lại
    console.log('Buy again:', order._id);
  };

  const handleItemPress = (item: any) => {
    setSelectedOrder(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data.data}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <CanceledItem
            order={item}
            onBuyAgain={handleBuyAgain}
            onPress={() => handleItemPress(item)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
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