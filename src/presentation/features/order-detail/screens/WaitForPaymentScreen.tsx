import { StyleSheet, Text, View, ActivityIndicator, Modal, TouchableOpacity, ScrollView, Linking, Image, NativeModules, NativeEventEmitter } from 'react-native'
import React, { useEffect, useState } from 'react'
import WaitForPaymentItem from '../components/WaitForPaymentItem'
import { FlatList } from 'react-native'
import { spacing } from 'theme/spacing';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWaitForPaymentOrders, updateOrderStatus, resetStatus, handlePayment, checkOrder } from '../slices/waitForPayment.slice';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { OrderStatus } from 'app/types/OrderStatus';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingView } from 'shared/components/LoadingView';
import { useToast } from 'shared/components/CustomToast';

const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

const WaitForPaymentScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { loading, error, data } = useSelector((state: RootState) => state.orderDetail.waitForPayment)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRespondDto | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);

  const { payUrl, getUrlStatus, updateStatus, updateStatusError } = useSelector((state: RootState) => state.orderDetail.waitForPayment)

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchWaitForPaymentOrders({ statuses: [OrderStatus.WAIT_FOR_PAYMENT] }));
    }, [dispatch])
  );

  // Lắng nghe sự kiện từ ZaloPay
useFocusEffect(
  React.useCallback(() => {
    const subscription = payZaloBridgeEmitter.addListener('EventPayZalo', (event) => {
      console.log('ZaloPay Event:', event);
      setCheckingPayment(true);
      if (event.returnCode === '1' && currentPaymentId) {
        dispatch(checkOrder(currentPaymentId));
      }
      switch (event.returnCode) {
        case '1':
          console.log('Thanh toán thành công');
          toast.show('success', 'Thanh toán thành công!');
          dispatch(fetchWaitForPaymentOrders({ statuses: [OrderStatus.WAIT_FOR_PAYMENT] }));
          break;
        case '-1':
          console.log('Thanh toán thất bại');
          toast.show('error', 'Thanh toán thất bại');
          break;
        case '4':
          console.log('Thanh toán bị huỷ');
          toast.show('info', 'Thanh toán đã bị huỷ');
          break;
        default:
          console.log('Không xác định:', event);
      }
      setCheckingPayment(false);
    });

    // Cleanup khi màn hình bị blur
    return () => {
      subscription.remove();
      console.log('🧹 Removed ZaloPay listener');
    };
  }, [currentPaymentId])
);


  useEffect(() => {
    if (getUrlStatus === 'success' && payUrl) {
      console.log(payUrl);
      Linking.openURL(payUrl);
    }
  }, [getUrlStatus, payUrl]);

  const handleItemButtonPress = (order: OrderRespondDto, paymentType: string) => {
    // Kiểm tra hết hạn thanh toán
    if (order.expiredDate && new Date(order.expiredDate).getTime() < Date.now()) {
      toast.show('error', 'Đơn hàng đã hết hạn thanh toán, vui lòng đặt lại đơn mới.');
      return;
    }
    dispatch(handlePayment({ orderId: order._id, paymentType }))
      .then((res: any) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.success) {
            if (res.payload.paymentType === 'ZALOPAY') {
              setCurrentPaymentId(res.payload.paymentId);
              toast.show('info', 'Đang mở ZaloPay...');
            }
          } else {
            toast.show('info', res.payload.message || 'Phương thức thanh toán chưa được hỗ trợ');
          }
        } else {
          toast.show('error', res.payload || 'Có lỗi xảy ra khi thanh toán');
        }
      });
  };

  const handleItemPress = (item: OrderRespondDto) => {
    setSelectedOrder(item)
    setModalVisible(true)
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      dispatch(updateOrderStatus({ orderId: selectedOrder._id, nextStatus: OrderStatus.CANCELLED }))
        .then((res: any) => {
          if (res.meta.requestStatus === "fulfilled") {
            setTimeout(() => {
              setModalVisible(false);
              dispatch(resetStatus());
              // Refresh danh sách sau khi huỷ
              dispatch(fetchWaitForPaymentOrders({ statuses: [OrderStatus.WAIT_FOR_PAYMENT] }));
            }, 1200);
          }
        });
    }
  };

  const handlePayInModal = () => {
    if (selectedOrder) {
      handleItemButtonPress(selectedOrder, selectedOrder.paymentType);
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <LoadingView />
    );
  }
  if (!loading && (!data || !data.data || data.data.length === 0)) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 50, width: 70, height: 70 }}>🛒</Text>
        <Text style={{ color: '#888', fontSize: 16, marginTop: 20 }}>Không có đơn hàng nào chờ thanh toán</Text>
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
        renderItem={({ item }) => <WaitForPaymentItem order={item}
          onItemPress={() => handleItemPress(item)} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          dispatch(resetStatus());
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentNew}>
            <ScrollView>
              <Text style={styles.modalTitleNew}>Order Details</Text>
              <View style={styles.orderInfoRow}>
                <Text style={styles.orderId}>DH: {selectedOrder?.sku || ''}</Text>
                <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>Pending Payment</Text></View>
              </View>
              <Text style={styles.orderDate}>Placed on {selectedOrder ? new Date(selectedOrder.createdAt).toLocaleDateString() : ''}</Text>
              <View style={styles.sectionDivider} />
              <Text style={styles.sectionTitle}>Các sản phẩm</Text>
              {selectedOrder && selectedOrder.orderDetailItems.map((item) => (
                <View key={item._id} style={styles.productRow}>
                  <View style={styles.productImageBox}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} resizeMode='cover' style={styles.image} />
                    ) : (
                      <View style={styles.fakeImage} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.productDesc}>{item.variantName}</Text>
                    <Text style={styles.productQty}>sl: {item.quantity}</Text>
                  </View>
                  <Text style={styles.productPrice}>{PriceFormatter.formatPrice(item.promotionalPrice)}</Text>
                </View>
              ))}
              <View style={styles.sectionDivider} />
              <Text style={styles.sectionTitle}>Payment Information</Text>
              <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Giá sản phẩm</Text><Text style={styles.paymentValue}>{PriceFormatter.formatPrice(selectedOrder?.productPrice || 0)}</Text></View>
              <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Phí vận chuyển</Text><Text style={styles.paymentValue}>{PriceFormatter.formatPrice(selectedOrder?.shippingFree || 0)}</Text></View>
              <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Giảm giá</Text><Text style={styles.paymentValue}>{PriceFormatter.formatPrice(0)}</Text></View>
              <View style={styles.paymentRow}><Text style={[styles.paymentLabel, { fontWeight: 'bold' }]}>Thành tiền</Text><Text style={[styles.paymentValue, { fontWeight: 'bold' }]}>{PriceFormatter.formatPrice(selectedOrder?.totalPrice || 0)}</Text></View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { opacity: updateStatus === "loading" ? 0.6 : 1 }]}
                  onPress={handleCancelOrder}
                  disabled={updateStatus === "loading"}
                >
                  <Text style={styles.cancelBtnText}>{updateStatus === "loading" ? "Đang huỷ..." : "Huỷ đơn hàng"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.payBtn, { opacity: updateStatus === "loading" ? 0.6 : 1 }]}
                  onPress={handlePayInModal}
                  disabled={updateStatus === "loading"}
                >
                  <Text style={styles.payBtnText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
              {updateStatus === "success" && (
                <Text style={{ color: 'green', textAlign: 'center', marginTop: 8 }}>Huỷ đơn thành công!</Text>
              )}
              {updateStatus === "failed" && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{updateStatusError}</Text>
              )}
              <TouchableOpacity style={styles.closeBtnNew} onPress={() => {
                setModalVisible(false);
                dispatch(resetStatus());
              }}>
                <Text style={styles.closeBtnTextNew}>Đóng</Text>
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
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    color: '#888',
    fontSize: 13,
  },
  statusBadge: {
    backgroundColor: '#FFE5C2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusBadgeText: {
    color: '#FFAF42',
    fontWeight: 'bold',
    fontSize: 13,
  },
  orderDate: {
    color: '#888',
    fontSize: 13,
    marginBottom: 10,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  productImageBox: {
    width: 48,
    height: 48,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeImage: {
    width: 32,
    height: 32,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  image: {
    width: 35,
    height: 35,
    backgroundColor: '#ccc',
    borderRadius: 6,

  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  productDesc: {
    color: '#888',
    fontSize: 13,
  },
  productQty: {
    color: '#888',
    fontSize: 13,
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paymentLabel: {
    color: '#888',
    fontSize: 15,
  },
  paymentValue: {
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#FF4D4F',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  payBtn: {
    backgroundColor: '#FFAF42',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginLeft: 8,
  },
  payBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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