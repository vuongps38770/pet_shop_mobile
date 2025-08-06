import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { colors } from "shared/theme/colors";
import IconBack from 'assets/icons/back.svg';
import { OrderSummary } from "../components/OrderSummary";
import { ShippingAddress } from "../components/ShippingAddress";
import { PaymentMethods } from "../components/PaymentMethods";
import { AddressModal } from "../components/AddressModal";
import { LoadingView } from "shared/components/LoadingView";
import { useOrder } from "../hooks/useOrder";
import { getMyAddresses } from "src/presentation/features/address/address.slice";
import { OrderGroupSummaryItem } from "../components/OrderGroupSummaryItem";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from "src/presentation/navigation/main-navigation/types";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/presentation/store/store";
import { OrderReqItem } from "src/presentation/dto/req/order.req.dto";
type OrderScreenRouteParams = {
  reOrderItems?: OrderReqItem[];
};

const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);
const SCREEN_HEIGHT = Dimensions.get('window').height

const OrderScreen = () => {
  const navigation = useMainNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'OrderScreen'>>();
  const dispatch = useDispatch<AppDispatch>();
  const reOrderItems = route.params?.reOrderItems;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [SCREEN_HEIGHT*0.5, SCREEN_HEIGHT*0.9], []);
  const [isAddressSheetOpen, setAddressSheetOpen] = useState(false);



  useFocusEffect(
    React.useCallback(() => {
      dispatch(getMyAddresses());
    }, [dispatch])
  );

  const {
    order,
    paymentGroup,
    setPaymentGroup,
    paymentType,
    shippingAddressId,
    selectedAddress,
    sortedAddresses,
    createOrderStatus,
    handleSelectAddress,
    handleSelectMethod,
    handlePay,
  } = useOrder(reOrderItems);

  const openModal = () => setAddressSheetOpen(true);
  const closeModal = () => setAddressSheetOpen(false);

  const handleCreateNewAddress = () => {
    closeModal();
    navigation.navigate('NewAddressScreen');
  };

  if (!order) {
    return <LoadingView />;
  }

  return (
    <>
      <View style={styles.container} >
        {/* Header */}
        <View style={styles.headerWrap}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toán đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ paddingHorizontal: 10 }} contentContainerStyle={{ paddingBottom: 160 }}>
          {/* Địa chỉ giao hàng */}
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <View style={styles.card}>
            <ShippingAddress
              selectedAddress={selectedAddress}
              onPress={openModal}
            />
          </View>

          {/* Thông tin đơn hàng */}
          <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
          <View style={styles.card}>
            {order.items.map((item, index) => (
              <React.Fragment key={item._id}>
                <OrderGroupSummaryItem group={item} />
                {index < order.items.length - 1 && <View style={styles.devider} />}
              </React.Fragment>
            ))}
          </View>

          {/* Chọn voucher */}
          <Text style={styles.sectionTitle}>Giảm giá</Text>
          <View style={styles.card}>
            {order?.discount && order.discount > 0 ? (
              <View style={styles.voucherAppliedContainer}>
                <View style={styles.voucherInfo}>
                  <Text style={styles.voucherCodeText}>Voucher đã áp dụng</Text>
                  <Text style={styles.discountAmountText}>
                    -{order.discount.toLocaleString('vi-VN')}đ
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changeVoucherButton}
                  onPress={() => navigation.navigate('PickVoucherScreen', { total: order.productTotal })}
                >
                  <Text style={styles.changeVoucherText}>Đổi voucher</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addVoucherButton}
                onPress={() => navigation.navigate('PickVoucherScreen', { total: order.finalTotal })}
              >
                <Text style={styles.addVoucherText}>+ Thêm voucher</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Phương thức thanh toán */}
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.card}>
            <PaymentMethods
              paymentGroup={paymentGroup}
              setPaymentGroup={setPaymentGroup}
              paymentType={paymentType}
              onSelectMethod={handleSelectMethod}
            />
          </View>

          {/* Tổng kết đơn hàng */}
          <Text style={styles.sectionTitle}>Tổng kết</Text>
          <View style={styles.card}>
            <OrderSummary
              subtotal={order.productTotal}
              delivery={order.shippingFee}
              total={order.finalTotal}
              discount={order.discount}
            />
          </View>
        </ScrollView>
      </View>

      {/* Sticky Footer */}
      <View style={styles.stickyFooterWrap}>
        <View style={styles.stickyFooterContent}>
          <Text style={styles.stickyFooterLabel}>Tổng cộng:</Text>
          <Text style={styles.stickyFooterTotal}>{order ? order.finalTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.stickyFooterButton}
          onPress={handlePay}
          disabled={createOrderStatus === 'pending'}
        >
          {createOrderStatus === 'pending' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.stickyFooterButtonText}>Đặt hàng</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* BottomSheet chọn địa chỉ */}
      <BottomSheet
        ref={bottomSheetRef}
        index={isAddressSheetOpen ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={closeModal}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
      >
        <BottomSheetView style={[{ flex: 1, padding: 16, paddingBottom: 16, minHeight: SCREEN_HEIGHT * 0.5 }]}>
          <View style={styles.addressSheetHeader}>
            <Text style={styles.addressSheetTitle}>Chọn địa chỉ giao hàng</Text>
            <TouchableOpacity
              onPress={handleCreateNewAddress}
              style={styles.addressSheetAddBtn}
            >
              <Text style={styles.addressSheetAddText}>+ Tạo địa chỉ mới</Text>
            </TouchableOpacity>
          </View>
          {sortedAddresses.length == 0
            ?
            <View style={{ width: '100%', height: 400, justifyContent: 'center', alignItems: 'center' }}>
              <Text >Bạn chưa có địa chỉ giao hàng nào!</Text>
            </View>
            :
            <BottomSheetFlatList
              data={sortedAddresses}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <Text style={{ marginBottom: 8 }}>Bạn chưa có địa chỉ nào.</Text>
              }
              ListFooterComponent={
                sortedAddresses.length > 0 && sortedAddresses.length < 3 ? (
                  <View style={{ height: 400 }} /> 
                ) : null
              }
              renderItem={({ item: address }) => (
                <TouchableOpacity
                  style={[
                    styles.addressCard,
                    shippingAddressId === address._id && styles.addressCardActive
                  ]}
                  onPress={() => {
                    handleSelectAddress(address._id);
                    closeModal();
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addressCardName}>{address.receiverFullname}</Text>
                    <Text style={styles.addressCardText}>
                      {address.streetAndNumber}, {address.ward}, {address.district}, {address.province}
                    </Text>
                    {address.isDefault && (
                      <Text style={styles.addressCardDefault}>Mặc định</Text>
                    )}
                    <Text style={styles.addressCardDate}>
                      Tạo: {new Date(address.createdDate).toLocaleString()}
                    </Text>
                  </View>
                  {shippingAddressId === address._id && (
                    <Text style={styles.addressCardChecked}>Đã chọn</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          }

        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: 0,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    marginBottom: 10,
  },
  headerBackBtn: {
    padding: 4,
  },
  headerBackIcon: {
    color: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: -24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
  devider: {
    height: 1,
    backgroundColor: colors.grey['200'],
    marginVertical: 8,
  },
  voucherAppliedContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.app.primary.main,
    marginBottom: 8,
    padding: 12,
  },
  voucherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherCodeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.app.primary.main,
  },
  discountAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  changeVoucherButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.app.primary.main,
    borderRadius: 8,
  },
  changeVoucherText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addVoucherButton: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.app.primary.main,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  addVoucherText: {
    color: colors.app.primary.main,
    fontWeight: 'bold',
    fontSize: 15,
  },
  stickyFooterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  stickyFooterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stickyFooterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  stickyFooterTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.app.primary.main,
  },
  stickyFooterButton: {
    backgroundColor: colors.app.primary.main,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  stickyFooterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  addressSheetAddBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: colors.app.primary.main,
    borderRadius: 16,
  },
  addressSheetAddText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addressCardActive: {
    borderColor: colors.app.primary.main,
    backgroundColor: '#FFF8E1',
    shadowColor: colors.app.primary.main,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  addressCardName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  addressCardText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: 2,
  },
  addressCardDefault: {
    color: colors.app.primary.main,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  addressCardDate: {
    color: '#888',
    fontSize: 11,
  },
  addressCardChecked: {
    color: colors.app.primary.main,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  addressSheetCloseBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#eee',
    borderRadius: 16,
  },
  addressSheetCloseText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
