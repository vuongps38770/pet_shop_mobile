import React, { useState } from "react";
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
import { useToast } from "shared/components/CustomToast";
import { storageHelper } from "app/config/storage";


const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);


const OrderScreen = () => {
  const navigation = useMainNavigation();
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height));

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
  } = useOrder();

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

  const handleCreateNewAddress = () => {
    closeModal();
    navigation.navigate('NewAddressScreen');
  };

  if (!order) {
    return <LoadingView />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconBack width={20} height={20} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <ShippingAddress
        selectedAddress={selectedAddress}
        onPress={openModal}
      />


      <OrderSummary
        subtotal={order.productTotal}
        delivery={order.shippingFee}
        total={order.finalTotal}

      />

      

      <PaymentMethods
        paymentGroup={paymentGroup}
        setPaymentGroup={setPaymentGroup}
        paymentType={paymentType}
        onSelectMethod={handleSelectMethod}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlePay}
        disabled={createOrderStatus === 'pending'}
      >
        {createOrderStatus === 'pending' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đặt hàng</Text>
        )}
      </TouchableOpacity>

      <AddressModal
        isVisible={isAddressModalOpen}
        onClose={closeModal}
        addresses={sortedAddresses}
        selectedAddressId={shippingAddressId}
        onSelectAddress={handleSelectAddress}
        onCreateNewAddress={handleCreateNewAddress}
        slideAnim={slideAnim}
      />
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
});
