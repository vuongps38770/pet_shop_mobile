import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from 'theme/colors'
import { Fonts } from 'theme/fonts'
import { Ionicons } from '@expo/vector-icons';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { setCurrentSelectedOrderId } from '../slice/pick-order.slice';
import { fetchOrders } from '../slice/pick-order.thunk';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';

const PickOrderScreen = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.chat.pickOrder);

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSend = (orderId: string) => {
    dispatch(setCurrentSelectedOrderId(orderId));
    navigation.goBack();
  };

  const renderOrder = ({ item }: { item: OrderRespondDto }) => {
    const firstProduct = item.orderDetailItems[0];
    return (
      <View style={styles.orderCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: firstProduct?.image }} style={styles.orderImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.orderTitle} numberOfLines={1}>DH: {item.sku}</Text>
            {/* <Text style={styles.orderTitle} numberOfLines={1}>{firstProduct?.productName} - {firstProduct?.variantName}</Text> */}
            <Text style={styles.orderSub}>{item.orderDetailItems.length} sản phẩm, Tổng cộng: {item.totalPrice.toLocaleString('vi-VN')}₫</Text>
            <Text style={styles.orderStatus}></Text>
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend(item._id)}>
            <Text style={styles.sendBtnText}>Gửi</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orderTime}>{new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} {new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.app.primary.main} />
        </TouchableOpacity>
        <Ionicons name="cart-outline" size={24} color={colors.app.primary.main} style={{ marginLeft: 4 }} />
        <Text style={styles.headerTitle}>Chọn đơn hàng</Text>
      </View>
      {loading && <ActivityIndicator style={{ marginTop: 30 }} color={colors.app.primary.main} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && orders && (
        <FlatList
          data={orders.data}
          keyExtractor={item => item._id}
          renderItem={renderOrder}
          ListEmptyComponent={<Text style={styles.emptyText}>Không Có Đơn Hàng Khác</Text>}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

export default PickOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.app.primary.main,
    marginLeft: 8,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.grey[200],
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  orderSub: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  orderStatus: {
    fontSize: 13,
    color: colors.app.primary.main,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sendBtn: {
    borderWidth: 1,
    borderColor: colors.app.primary.main,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
  },
  sendBtnText: {
    color: colors.app.primary.main,
    fontWeight: 'bold',
  },
  orderTime: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: 40,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
});