import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, Image, StatusBar, Linking } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/presentation/store/store'
import { fetchDetails } from '../slices/orderAlldetail.slice'
import { fetchOrderLogs, translateOrderAction } from '../slices/orderLog.slice';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types'
import { colors } from 'src/presentation/shared/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OrderStatus } from 'src/presentation/dto/res/order-respond.dto';


const OrderAllDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.orderDetail.allDetails);
  const { data: logs, loading: logLoading, error: logError } = useSelector((state: RootState) => state.orderDetail.orderLog);
  const route = useRoute<RouteProp<MainStackParamList, 'AllDetails'>>()
  const orderId = route.params?.orderId || '6879057564b6cdffe0025477'
  console.log("orderId", orderId);

  useEffect(() => {
    dispatch(fetchDetails(orderId));
    dispatch(fetchOrderLogs(orderId));
  }, [dispatch]);

  const orderData = data;


  const order = orderData ? {
    id: orderData._id,
    recipient: {
      name: orderData.shippingAddress?.receiverFullname || '',
      phone: '',
      address: `${orderData.shippingAddress?.streetAndNumber || ''}, ${orderData.shippingAddress?.ward || ''}, ${orderData.shippingAddress?.district || ''}, ${orderData.shippingAddress?.province || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, ''),
    },
    total: orderData.productPrice,
    discount: orderData.discount ?? 0,
    finalTotal: orderData.totalPrice,
    paymentMethod: orderData.paymentType,
    sku: orderData.sku
  } : null;

  // Hàm dịch trạng thái đơn hàng từ enum OrderStatus sang tiếng Việt
  const translateOrderStatus = (status: OrderStatus | string) => {
    switch (status) {
      case OrderStatus.NEWORDER:
        return 'Chờ xác nhận';
      case OrderStatus.CONFIRMED:
        return 'Đã xác nhận';
      case OrderStatus.WAIT_FOR_PAYMENT:
        return 'Chờ thanh toán';
      case OrderStatus.PAYMENT_SUCCESSFUL:
        return 'Đã thanh toán';
      case OrderStatus.PROCESSING:
        return 'Đang xử lý';
      case OrderStatus.SHIPPED:
        return 'Đã giao cho vận chuyển';
      case OrderStatus.DELIVERED:
        return 'Đã giao hàng';
      case OrderStatus.RECEIVED:
        return 'Đã nhận hàng';
      case OrderStatus.CANCELLED:
        return 'Đã huỷ';
      case OrderStatus.RETURNED:
        return 'Đã trả hàng';
      case OrderStatus.FAILED:
        return 'Giao thất bại';
      case OrderStatus.REFUNDED:
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />
      <View style={styles.headerCustom}>
        <TouchableOpacity style={styles.backButtonCustom} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitleCustom}>Chi tiết đơn hàng</Text>
        <View style={{ width: 32 }} />
      </View>
      {loading && <ActivityIndicator size="large" color="#FFAF42" style={{ marginVertical: 20 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {/* Tag trạng thái đơn hàng */}
        {orderData?.status && (
          <View style={{ alignSelf: 'center', marginBottom: 20, borderRadius: 8, backgroundColor: '#FFE5C2', paddingHorizontal: 32, paddingVertical: 12, width: '100%' }}>
            <Text style={{ color: '#FFAF42', fontWeight: 'bold', fontSize: 18, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>
              {translateOrderStatus(orderData.status)}
            </Text>
          </View>
        )}
        <View style={styles.recipientBlock}>
          <Text>
            <Text style={styles.orderId}>Người nhận: </Text>
            <Text style={styles.paymentMethod}>{order?.recipient?.name}</Text>
          </Text>
          <Text>
            <Text style={styles.orderId}>SĐT: </Text>
            <Text style={styles.paymentMethod}>{order?.recipient?.phone}</Text>
          </Text>
          <Text>
            <Text style={styles.orderId}>Địa chỉ: </Text>
            <Text style={styles.paymentMethod}>{order?.recipient?.address}</Text>
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        {orderData && orderData.orderDetailItems && orderData.orderDetailItems.length > 0 ? (
          Object.values(
            orderData.orderDetailItems.reduce((acc: any, item: any) => {
              const productId = item.productId;
              if (!acc[productId]) {
                acc[productId] = {
                  productId,
                  productName: item.productName,
                  image: item.image,
                  variants: [],
                };
              }
              acc[productId].variants.push(item);
              return acc;
            }, {})
          ).map((product: any) => (
            <View key={product.productId} style={styles.productItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                {product.image ? (
                  <Image source={{ uri: product.image }} style={{ width: 80, height: 80, borderRadius: 6, marginHorizontal: 10 }} />
                ) : null}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.productName}>{product.productName}</Text>
                </View>
              </View>
              {product.variants.map((variant: any) => (
                <View key={variant._id} style={{ marginLeft: 10, marginBottom: 2 }}>
                  {variant.variantName ? (
                    <Text style={styles.productInfo}>Phân loại: {variant.variantName}</Text>
                  ) : null}
                  <Text style={styles.productInfo}>Số lượng: {variant.quantity}</Text>
                  <Text style={styles.productInfo}>Giá: {(variant.promotionalPrice || variant.sellingPrice).toLocaleString()}đ</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.productInfo}>Không có sản phẩm</Text>
        )}
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Tổng giá trị:</Text>
          <Text style={styles.priceValue}>{order?.total?.toLocaleString()}đ</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Giảm giá:</Text>
          <Text style={styles.priceValue}>-{order?.discount?.toLocaleString()}đ</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.priceLabel, { fontWeight: 'bold' }]}>Thành tiền:</Text>
          <Text style={[styles.priceValue, { fontWeight: 'bold', color: '#4CAF50' }]}>{order?.finalTotal?.toLocaleString()}đ</Text>
        </View>
        {/* Hỗ trợ khách hàng */}
        <Text style={styles.sectionTitle}>Bạn cần hỗ trợ?</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:19001234')}>
          <Text style={{ color: '#1976D2', fontSize: 13, textAlign: 'left', marginBottom: 8, marginTop: 2, textDecorationLine: 'underline', fontWeight: 'bold' }}>
            Liên hệ shop
          </Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Thông tin</Text>
        {/* Mã đơn hàng và nút sao chép */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
          <Text>
            <Text style={styles.orderId}>Mã đơn: </Text>
            <Text style={styles.paymentMethod}>{order?.sku}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (order?.sku) {
                Clipboard.setString(`DH: ${order.sku}`);
              }
            }}
            style={{ marginLeft: 8, padding: 4 }}
          >
            <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>Sao chép</Text>
          </TouchableOpacity>
        </View>
        <Text>
          <Text style={styles.orderId}>Phương thức thanh toán: </Text>
          <Text style={styles.paymentMethod}>{order?.paymentMethod}</Text>
        </Text>
        <Text style={styles.sectionTitle}>Lịch sử cập nhật</Text>
        {logLoading && <ActivityIndicator size="small" color="#FFAF42" style={{ marginVertical: 10 }} />}
        {logError && <Text style={{ color: 'red', marginBottom: 10 }}>{logError}</Text>}
        <FlatList
          data={logs}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyStatus}>{translateOrderAction(item.action)}</Text>
              <Text style={styles.historyTime}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  )
}

export default OrderAllDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  headerCustom: {
    backgroundColor: colors.app.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    marginBottom: 8,
  },
  backButtonCustom: {
    padding: 8,
  },
  headerTitleCustom: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 12,
    paddingLeft: 0,
  },
  backText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFAF42',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFAF42',
  },
  orderId: {
    fontSize: 14,
    marginBottom: 12,
    color: '#888',
  },
  paymentMethod: {
    fontSize: 14,
    marginBottom: 8,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  recipientBlock: {
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  recipientLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  recipientValue: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  productItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  productInfo: {
    fontSize: 13,
    color: '#555',
  },
  priceBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#333',
  },
  priceValue: {
    fontSize: 14,
    color: '#222',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  historyStatus: {
    fontSize: 13,
    color: '#444',
  },
  historyTime: {
    fontSize: 13,
    color: '#888',
  },
})