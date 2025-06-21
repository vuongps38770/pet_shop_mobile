import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RadioButton } from "react-native-paper";
import { RootState, AppDispatch } from "src/presentation/store/store";
import { setPaymentType, caculateOrder, resetOrder, setShippingAddressId, createOrder, setOrderItems } from "../order.slice";
import { getMyAddresses } from "../../address/address.slice";
import { PriceFormatter } from "app/utils/priceFormatter";
import { colors } from "shared/theme/colors";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { assets } from "shared/theme/assets";
import { OrderSummary } from "../components/OrderSummary";
import { PaymentCard } from "../components/PaymentCard";
import IconBack from 'assets/icons/back.svg'
import { OrderReqItem } from "src/presentation/dto/req/order.req.dto";
import { LoadingView } from "shared/components/LoadingView";
import { PaymentType } from "src/presentation/dto/res/order-respond.dto";
import { useNavigation } from '@react-navigation/native';
import { removeFromCart } from "../../cart/cart.slice";
import { showToast } from 'src/presentation/shared/utils/toast';

const OrderScreen = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { items, selectedIds, } = useSelector((state: RootState) => state.cart);
  const { myAddresses } = useSelector((state: RootState) => state.newAddress);
  const { caculateOrderReq, order, orderItems, paymentType, shippingAddressId, totalClientPrice, voucherCode, createOrderStatus } = useSelector(
    (state: RootState) => state.order
  );

  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height));

  // Sắp xếp địa chỉ: mặc định lên đầu, sau đó là mới nhất
  const sortedAddresses = [...myAddresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });

  const handleSelectAddress = (id: string) => {
    dispatch(setShippingAddressId(id));
    closeModal();
  };

  const handleCreateNewAddress = () => {
    closeModal();
    navigation.navigate('NewAddressScreen');
  };

  const selectedAddress = myAddresses.find(addr => addr._id === shippingAddressId) || sortedAddresses[0];

  const getSelectedProductsReq = (): OrderReqItem[] =>
    items
      .filter((item) => selectedIds.includes(item._id))
      .map((item) => ({
        variantId: item.productVariantId,
        quantity: item.quantity
      }));
  useEffect(() => {
    dispatch(caculateOrder({ orderItems: getSelectedProductsReq() }))
    dispatch(setOrderItems(getSelectedProductsReq()))
    dispatch(getMyAddresses())
    console.log(order);
    return () => {
      dispatch(resetOrder());
    };
  }, [])
  useEffect(() => {
    if (sortedAddresses && sortedAddresses.length > 0 && !shippingAddressId) {
      handleSelectAddress(sortedAddresses[0]._id);
    }
  }, [sortedAddresses]);

  useEffect(() => {
    if (createOrderStatus === 'success') {
      let slectedIdsClone = selectedIds
      for(let s in slectedIdsClone){
        dispatch(removeFromCart(slectedIdsClone[s]))
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainScreen' }],
      });
      showToast.success(
        'Đặt hàng thành công!',
        `Đã thanh toán ${PriceFormatter.formatPrice(totalClientPrice || 0)}`
      );
    }
  }, [createOrderStatus, totalClientPrice]);

  const handlePay = () => {
    console.log({
      orderItems: orderItems,
      paymentType: paymentType,
      shippingAddressId: shippingAddressId,
      totalClientPrice: order?.productTotal,
    });
    if (!orderItems || !paymentType || !shippingAddressId || !order) return
    dispatch(createOrder({
      orderItems: orderItems,
      paymentType: paymentType,
      shippingAddressId: shippingAddressId,
      totalClientPrice: order?.productTotal,
    }));


    // const productsToSend = getSelectedProducts().map(({ id, quantity }) => ({
    //   id,
    //   quantity,
    // }));
    // console.log("Sản phẩm đã chọn:", productsToSend);

    // Alert.alert(
    //   "Thanh toán thành công!",
    //   `Đã thanh toán ${PriceFormatter.formatPrice(total)}`,
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => navigation.navigate("PendingScreen" as never),
    //     },
    //   ]
    // );
  };

  const paymentMethods = [
    { key: PaymentType.VNPAY, title: "VNPay", icon: assets.icons.orderScreen.vnpay },
    { key: PaymentType.MOMO, title: "MoMo", icon: assets.icons.orderScreen.momo },
    { key: PaymentType.ZALOPAY, title: "ZaloPay", icon: assets.icons.orderScreen.momo },
  ] as const;

  // Thêm state để chọn loại thanh toán: 'cod' hoặc 'online'
  const [paymentGroup, setPaymentGroup] = useState(paymentType === PaymentType.COD ? 'cod' : 'online');

  useEffect(() => {
    // Nếu chọn COD thì set paymentType về COD
    if (paymentGroup === 'cod') {
      dispatch(setPaymentType(PaymentType.COD));
    } else {
      // Nếu đang là COD thì chuyển sang online mặc định là VNPAY
      if (paymentType === PaymentType.COD) {
        dispatch(setPaymentType(PaymentType.ZALOPAY));
      }
    }
  }, [paymentGroup]);

  const handleSelectMethod = (type: PaymentType) => {
    dispatch(setPaymentType(type));
    if (type === PaymentType.COD) setPaymentGroup('cod');
    else setPaymentGroup('online');
  };

  const openModal = () => {
    setAddressModalOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setAddressModalOpen(false));
  };

  if (!order) {
    return (
      <LoadingView />
    )
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconBack width={20} height={20} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <OrderSummary
        subtotal={order.productTotal}
        delivery={order.shippingFee}
        total={order.finalTotal}
      />

      <Text style={styles.title}>Địa chỉ giao hàng</Text>
      <TouchableOpacity
        style={styles.selectedAddressBox}
        onPress={openModal}
      >
        {selectedAddress ? (
          <>
            <Text style={{ fontWeight: 'bold' }}>{selectedAddress.receiverFullname}</Text>
            <Text numberOfLines={1} style={{ maxWidth: '90%' }}>{selectedAddress.streetAndNumber}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}</Text>
            {selectedAddress.isDefault && <Text style={styles.defaultLabel}>Mặc định</Text>}
          </>
        ) : (
          <Text>Chọn địa chỉ giao hàng</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.title}>Phương thức thanh toán</Text>
      <View style={styles.paymentGroupContainer}>
        <TouchableOpacity
          style={[styles.paymentGroupBtn, paymentGroup === 'cod' && styles.paymentGroupBtnActive]}
          onPress={() => setPaymentGroup('cod')}
        >
          <Text style={[styles.paymentGroupText, paymentGroup === 'cod' && styles.paymentGroupTextActive]}>Trả khi nhận hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentGroupBtn, paymentGroup === 'online' && styles.paymentGroupBtnActive]}
          onPress={() => setPaymentGroup('online')}
        >
          <Text style={[styles.paymentGroupText, paymentGroup === 'online' && styles.paymentGroupTextActive]}>Thanh toán online</Text>
        </TouchableOpacity>
      </View>
      {paymentGroup === 'cod' ? (
        <View style={styles.codBox}>
          <RadioButton
            value={PaymentType.COD}
            status={paymentType == PaymentType.COD ? "checked" : "unchecked"}
            onPress={() => handleSelectMethod(PaymentType.COD)}
            color={colors.app.primary.main}
            uncheckedColor="#000"
          />
          <Text style={{ fontWeight: 'bold', marginLeft: 8 }}>Trả khi nhận hàng (COD)</Text>
        </View>
      ) : (
        <View>
          {paymentMethods.map(({ key, title, icon }) => (
            <PaymentCard
              title={title}
              key={key}
              selected={paymentType == key}
              onSelect={() => handleSelectMethod(key)}
              icon={icon}
            />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handlePay} disabled={createOrderStatus === 'pending'}>
        {createOrderStatus === 'pending' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đặt hàng</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={isAddressModalOpen}
        animationType="none"
        transparent
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={styles.modalHandle} />
            </View>
            <Text style={styles.title}>Chọn địa chỉ giao hàng</Text>
            {sortedAddresses.length === 0 ? (
              <Text style={{ marginBottom: 8 }}>Bạn chưa có địa chỉ nào.</Text>
            ) : (
              sortedAddresses.map((address) => (
                <TouchableOpacity
                  key={address._id}
                  style={[
                    styles.addressItem,
                    shippingAddressId === address._id && styles.addressItemSelected,
                  ]}
                  onPress={() => handleSelectAddress(address._id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{address.receiverFullname}</Text>
                    <Text>{address.streetAndNumber}, {address.ward}, {address.district}, {address.province}</Text>
                    {address.isDefault && <Text style={styles.defaultLabel}>Mặc định</Text>}
                    <Text style={styles.dateLabel}>Tạo: {new Date(address.createdDate).toLocaleString()}</Text>
                  </View>
                  {shippingAddressId === address._id && (
                    <Text style={{ color: colors.app.primary.main, fontWeight: 'bold' }}>Đã chọn</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity style={styles.createAddressBtn} onPress={handleCreateNewAddress}>
              <Text style={styles.createAddressText}>+ Tạo địa chỉ mới</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeModalBtn} onPress={closeModal}>
              <Text style={styles.closeModalText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </ScrollView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#FFAF42",
    padding: 16,
    borderRadius: 20,
    marginTop: 32,
    marginBottom: 32,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addressItemSelected: {
    borderColor: colors.app.primary.main,
    backgroundColor: '#FFF8E1',
  },
  defaultLabel: {
    color: '#FFAF42',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateLabel: {
    color: '#888',
    fontSize: 11,
  },
  createAddressBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#FFAF42',
    borderRadius: 16,
  },
  createAddressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedAddressBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: 32,
    minHeight: 200,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  closeModalBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#eee',
    borderRadius: 16,
  },
  closeModalText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  paymentGroupContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 8,
    gap: 8,
  },
  paymentGroupBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paymentGroupBtnActive: {
    borderColor: colors.app.primary.main,
    backgroundColor: '#FFF8E1',
  },
  paymentGroupText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  paymentGroupTextActive: {
    color: colors.app.primary.main,
  },
  codBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 8,
  },
});
