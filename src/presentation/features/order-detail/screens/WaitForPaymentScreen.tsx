import { StyleSheet, Text, View, ActivityIndicator, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import WaitForPaymentItem from '../components/WaitForPaymentItem'
import { FlatList } from 'react-native'
import { spacing } from 'theme/spacing';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWaitForPaymentOrders } from '../slices/waitForPayment.slice';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { OrderStatus } from 'app/types/OrderStatus';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';

const WaitForPaymentScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, data } = useSelector((state: RootState) => state.orderDetail.waitForPayment)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRespondDto | null>(null);

  useEffect(() => {
    dispatch(fetchWaitForPaymentOrders({ statuses: [OrderStatus.WAIT_FOR_PAYMENT] }));
  }, [dispatch]);

  const handleItemPress = (order: OrderRespondDto) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large"  />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data || []}
        renderItem={({ item }) => <WaitForPaymentItem order={item} onPress={() => handleItemPress(item)} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}/>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
              {selectedOrder && (
                <>
                  <Text style={styles.modalLabel}>Mã đơn: {selectedOrder._id}</Text>
                  <Text style={styles.modalLabel}>Người nhận: {selectedOrder.shippingAddress.receiverFullname}</Text>
                  <Text style={styles.modalLabel}>Địa chỉ: {selectedOrder.shippingAddress.streetAndNumber}, {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}</Text>
                  <Text style={styles.modalLabel}>Tổng tiền: {selectedOrder.totalPrice.toLocaleString()}đ</Text>
                  <Text style={styles.modalLabel}>Trạng thái: {selectedOrder.status}</Text>
                  <Text style={styles.modalLabel}>Phương thức: {selectedOrder.paymentType}</Text>
                  <Text style={styles.modalLabel}>Sản phẩm:</Text>
                  {selectedOrder.orderDetailItems.map((item) => (
                    <View key={item._id} style={{ marginBottom: 8, marginLeft: 8 }}>
                      <Text>- {item.productName} ({item.variantName}) x{item.quantity}</Text>
                    </View>
                  ))}
                </>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>Đóng</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default WaitForPaymentScreen

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
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 12,
      textAlign: 'center',
    },
    modalLabel: {
      fontSize: 15,
      marginBottom: 6,
    },
    closeBtn: {
      marginTop: 18,
      alignSelf: 'center',
      backgroundColor: '#FFAF42',
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 32,
    },
    closeBtnText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },
})