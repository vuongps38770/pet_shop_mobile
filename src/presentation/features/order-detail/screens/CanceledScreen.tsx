import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Modal, Image, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchCanceledOrders, fetchCanceledOrdersLoadMore, fetchRebuyItemsByOrderId } from '../slices/canceled.slice';
import CanceledItem from '../components/CanceledItem';
import OrderDetailModal from '../components/OrderDetailModal';
import { LoadingView } from 'shared/components/LoadingView';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { OrderReqItem } from 'src/presentation/dto/req/order.req.dto';
import { RebuyItemDto } from 'src/presentation/dto/res/order-respond.dto';
import { Checkbox } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const CanceledScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, fetchStatus, fetchError, loadMoreStatus } = useSelector((state: RootState) => state.orderDetail.canceled);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<OrderRespondDto[]>([]);
  const [rebuyModalVisible, setRebuyModalVisible] = useState(false);
  const [rebuyItems, setRebuyItems] = useState<RebuyItemDto[]>([]);
  const [rebuyQuantities, setRebuyQuantities] = useState<{ [id: string]: number }>({});
  const [rebuyLoading, setRebuyLoading] = useState(false);
  const [rebuySelectedIds, setRebuySelectedIds] = useState<string[]>([]);
  const navigation = useMainNavigation()
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    dispatch(fetchCanceledOrders({ page: 1 })).then((res: any) => {
      setAllOrders(res.payload?.data || []);
      setRefreshing(false);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
      dispatch(fetchCanceledOrders({ page: 1 })).then((res: any) => {
        setAllOrders(res.payload?.data || []);
      });
    }, [dispatch])
  );


  useEffect(() => {
    if (data && data.data && page === 1) {
      setAllOrders(data.data);
    }
  }, [data, page]);

  // Khi mở modal, mặc định chọn hết các sản phẩm
  useEffect(() => {
    if (rebuyModalVisible && rebuyItems.length > 0) {
      setRebuySelectedIds(rebuyItems.map(item => item._id));
    }
  }, [rebuyModalVisible]);

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

  const handleBuyAgain = async (order: OrderRespondDto) => {
    setRebuyLoading(true);
    try {
      const items = await dispatch(fetchRebuyItemsByOrderId(order._id)).unwrap();
      if (items && items.length > 0) {
        setRebuyItems(items);
        const initialQuantities: { [id: string]: number } = {};
        items.forEach((item) => {
          initialQuantities[item._id] = item.quantity || 1;
        });
        setRebuyQuantities(initialQuantities);
        setRebuyModalVisible(true);
      } else {
        Alert.alert('Không tìm thấy sản phẩm để mua lại');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lấy sản phẩm mua lại');
    }
    setRebuyLoading(false);
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
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={[
          allOrders.length === 0 ? { flex: 1 } : { padding: 16 },
        ]}
        data={allOrders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <CanceledItem
            order={item}
            onBuyAgain={handleBuyAgain}
            onPress={() => handleItemPress(item)}
          />
        )}
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
      {/* Modal chọn sản phẩm mua lại */}
      <Modal
        visible={rebuyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRebuyModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%', maxWidth: 400 }}>
            {rebuyItems.length > 0 && rebuyItems.map((item, idx) => (
              <View key={item._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Checkbox
                  status={rebuySelectedIds.includes(item._id) ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setRebuySelectedIds(ids =>
                      ids.includes(item._id)
                        ? ids.filter(id => id !== item._id)
                        : [...ids, item._id]
                    );
                  }}
                  color={rebuySelectedIds.includes(item._id) ? '#FFAF42' : undefined}
                />
                <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.productName}</Text>
                  {item.variantName ? <Text style={{ color: '#888', fontSize: 14 }}>{item.variantName}</Text> : null}
                  <Text style={{ color: '#FFAF42', fontWeight: 'bold', fontSize: 16 }}>{item.promotionalPrice?.toLocaleString()}đ</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ fontSize: 15, marginRight: 8 }}>Số lượng:</Text>
                    <TouchableOpacity
                      style={{ backgroundColor: '#eee', borderRadius: 8, padding: 6, marginRight: 6 }}
                      onPress={() => setRebuyQuantities(q => ({ ...q, [item._id]: Math.max(1, (q[item._id] || 1) - 1) }))}
                      disabled={rebuyQuantities[item._id] <= 1}
                    >
                      <Text style={{ fontSize: 18, color: rebuyQuantities[item._id] <= 1 ? '#ccc' : '#333' }}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, width: 48, textAlign: 'center', fontSize: 16, marginRight: 6 }}
                      value={rebuyQuantities[item._id]?.toString()}
                      keyboardType="numeric"
                      onChangeText={txt => {
                        let val = parseInt(txt.replace(/[^0-9]/g, ''), 10);
                        if (isNaN(val)) val = 1;
                        setRebuyQuantities(q => ({ ...q, [item._id]: val }));
                      }}
                      onBlur={() => {
                        if (rebuyQuantities[item._id] < 1) setRebuyQuantities(q => ({ ...q, [item._id]: 1 }));
                        if (rebuyQuantities[item._id] > item.availableStock) setRebuyQuantities(q => ({ ...q, [item._id]: item.availableStock }));
                      }}
                    />
                    <TouchableOpacity
                      style={{ backgroundColor: '#eee', borderRadius: 8, padding: 6 }}
                      onPress={() => setRebuyQuantities(q => ({ ...q, [item._id]: Math.min(item.availableStock, (q[item._id] || 1) + 1) }))}
                      disabled={rebuyQuantities[item._id] >= item.availableStock}
                    >
                      <Text style={{ fontSize: 18, color: rebuyQuantities[item._id] >= item.availableStock ? '#ccc' : '#333' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ marginTop: 2, color: '#888', fontSize: 13 }}>(Còn {item.availableStock} sản phẩm)</Text>
                  {rebuyQuantities[item._id] > item.availableStock && (
                    <Text style={{ color: 'red', marginTop: 2 }}>Số lượng vượt quá tồn kho!</Text>
                  )}
                </View>
              </View>
            ))}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, marginRight: 8 }}
                onPress={() => setRebuyModalVisible(false)}
              >
                <Text style={{ color: '#888', fontWeight: 'bold' }}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: rebuyItems.some(item => rebuyQuantities[item._id] > item.availableStock || !rebuySelectedIds.includes(item._id)) ? '#ccc' : '#FFAF42', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 }}
                disabled={rebuyItems.some(item => rebuyQuantities[item._id] > item.availableStock || !rebuySelectedIds.includes(item._id))}
                onPress={() => {
                  setRebuyModalVisible(false);
                  navigation.navigate('OrderScreen', {
                    reOrderItems: rebuyItems
                      .filter(item => rebuySelectedIds.includes(item._id) && rebuyQuantities[item._id] > 0 && rebuyQuantities[item._id] <= item.availableStock)
                      .map(item => ({
                        variantId: item.productVariantId,
                        quantity: rebuyQuantities[item._id],
                      }))
                  });
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Mua</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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