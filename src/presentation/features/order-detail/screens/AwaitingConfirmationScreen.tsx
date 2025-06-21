import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image } from 'react-native'
import React from 'react'
import { spacing } from 'theme/spacing';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchAwaitingConfirmOrders, updateOrderStatus } from '../slices/awaitingConfirmation.slice';
import { useEffect } from 'react';
import AwaitingConfirmationItem from '../components/AwaitingConfirmationItem';
import { OrderStatus } from 'app/types/OrderStatus';
import OrderDetailModal from '../components/OrderDetailModal';

const AwaitingConfirmationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError } = useSelector((state: RootState) => state.orderDetail.awaitingConfirmation);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);

  useEffect(() => {
    dispatch(fetchAwaitingConfirmOrders({}));
  }, [dispatch]);
  useEffect(() => {
    console.log(selectedOrder);
  }, [selectedOrder])

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
        <Text style={{ fontSize: 50, width: 70, height: 70 }}>🛒</Text>
        <Text style={{ color: '#888', fontSize: 16, marginTop: 20 }}>Không có đơn hàng nào chờ xác nhận</Text>
      </View>
    );
  }

  const handleCancelOrder = (orderId: string) => {
    dispatch(updateOrderStatus({ orderId, nextStatus: OrderStatus.CANCELLED }))
      .then((res: any) => {
        if (res.meta.requestStatus === "fulfilled") {
          setModalVisible(false);
          setTimeout(() => {
            dispatch(fetchAwaitingConfirmOrders({}));
          }, 300);
        }
      });
  };

  const handleItemPress = (item: any) => {
    setSelectedOrder(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data.data}
        renderItem={({ item }) => (
          <AwaitingConfirmationItem
            orderss={{
              sku: item.sku,
              name: item.orderDetailItems[0]?.productName || '',
              productCount: item.orderDetailItems.length,
              totalPrice: item.totalPrice,
              image: item.orderDetailItems[0]?.image || '',
              attributes: item.orderDetailItems[0]?.variantName,
              createdAt: item.createdAt
            }}
            statusLabel={item.status === OrderStatus.PAYMENT_SUCCESSFUL ? 'Đã thanh toán, chờ xác nhận' : undefined}
            onPress={() => handleItemPress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false} />
      <OrderDetailModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={() => setModalVisible(false)}
        showCancelButton={true}
        onCancel={selectedOrder ? () => handleCancelOrder(selectedOrder._id) : undefined}
      />
    </View>
  )
}

export default AwaitingConfirmationScreen

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentNew: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '92%',
    maxHeight: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitleNew: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 15,
    marginBottom: 6,
  },
  closeBtnNew: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  closeBtnTextNew: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
})