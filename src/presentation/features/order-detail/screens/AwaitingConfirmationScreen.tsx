import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image, NativeModules, NativeEventEmitter } from 'react-native'
import React from 'react'
import { spacing } from 'theme/spacing';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchAwaitingConfirmOrders, updateOrderStatus, fetchAwaitingConfirmOrdersLoadMore } from '../slices/awaitingConfirmation.slice';
import { useEffect, useRef } from 'react';
import AwaitingConfirmationItem from '../components/AwaitingConfirmationItem';
import { OrderStatus } from 'app/types/OrderStatus';
import OrderDetailModal from '../components/OrderDetailModal';
import WaitForPaymentItem from '../components/WaitForPaymentItem';
import { useToast } from 'shared/components/CustomToast';
import { checkOrder } from '../slices/waitForPayment.slice';

const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

const AwaitingConfirmationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError, loadMoreStatus } = useSelector((state: RootState) => state.orderDetail.awaitingConfirmation);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const toast = useToast();
  const currentPaymentId = useRef<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [allOrders, setAllOrders] = React.useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    dispatch(fetchAwaitingConfirmOrders({ page: 1 })).then((res: any) => {
      setAllOrders(res.payload?.data || []);
      setRefreshing(false);
    });
  };

  

  React.useEffect(() => {
    setPage(1);
    dispatch(fetchAwaitingConfirmOrders({ page: 1 })).then((res: any) => {
      setAllOrders(res.payload?.data || []);
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (data && data.data && page === 1) {
      setAllOrders(data.data);
    }
  }, [data, page]);

  React.useEffect(() => {
    console.log(selectedOrder);
  }, [selectedOrder])

  // Lắng nghe sự kiện thanh toán ZaloPay
  React.useEffect(() => {
    const subscription = payZaloBridgeEmitter.addListener('EventPayZalo', (event) => {
      if (event.returnCode === '1' && currentPaymentId.current) {
        console.log("cur",currentPaymentId.current);
        
        dispatch(checkOrder(currentPaymentId.current)).then(() => {
          dispatch(fetchAwaitingConfirmOrders({}));
        });
        toast.show('success', 'Thanh toán thành công!');
      } else if (event.returnCode === '-1') {
        toast.show('error', 'Thanh toán thất bại');
      } else if (event.returnCode === '4') {
        toast.show('info', 'Thanh toán đã bị huỷ');
      }
    });
    return () => subscription.remove();
  }, [dispatch, toast]);

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

  // Callback để WaitForPaymentItem set paymentId khi gọi thanh toán
  const handleSetPaymentId = (paymentId: string) => {
    currentPaymentId.current = paymentId;
  };

  // Hàm tải thêm
  const handleLoadMore = () => {
    const nextPage = page + 1;
    (dispatch as any)(fetchAwaitingConfirmOrdersLoadMore({ page: nextPage })).then((res: any) => {
      setAllOrders(prev => [...prev, ...(res.payload?.data?.data || [])]);
      setPage(nextPage);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={allOrders}
        renderItem={({ item }) => {
          if (item.status === 'WAIT_FOR_PAYMENT') {
            return (
              <WaitForPaymentItem
                order={item}
                onItemPress={() => handleItemPress(item)}
                onSetPaymentId={handleSetPaymentId}
              />
            );
          }
          return (
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
          );
        }}
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