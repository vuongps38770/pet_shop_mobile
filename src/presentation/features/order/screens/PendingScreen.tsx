import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, NativeModules, NativeEventEmitter } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useOrder } from "../hooks/useOrder";
import { storageHelper } from "app/config/storage";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { useToast } from "shared/components/CustomToast";
const { PayZaloBridge } = NativeModules;
const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);



const PendingScreen = () => {
  const {
    checkPaymentStatus,
    paymentStatus,
  } = useOrder();
  const navigation = useMainNavigation();
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();
  React.useEffect(() => {
    const subscription = payZaloBridgeEmitter.addListener('EventPayZalo', (event) => {
      console.log('ZaloPay Event:', event);
      checkPaymentStatus()
      switch (event.returnCode) {
        case '1':
          console.log('Thanh toán thành công');
          setIsSuccess(true);
          break;
        case '-1':
          console.log('Thanh toán thất bại');
          break;
        case '4':
          console.log('Thanh toán bị huỷ');
          break;
        default:
          console.log('Không xác định:', event);
      }
      setCheckingPayment(true);
      checkPaymentStatus();
    });
    return () => subscription.remove();
  }, []);
  React.useEffect(() => {
    if (checkingPayment && paymentStatus) {
      console.log(paymentStatus);

      if (paymentStatus.return_code == 1) {
        storageHelper.clearPaymentQueue();
        navigation.navigate('MainScreen');
        toast.show('success', 'Bạn đã đặt hàng thành công');
      } else if (paymentStatus.return_code == 2) {
        toast.show('error', 'Thanh toán thất bại, thanh toán lại ở lịch sử mua hàng');
      }
      setCheckingPayment(false);
    }
  }, [paymentStatus, checkingPayment]);
  return (
    <View style={[styles.container, isSuccess && { backgroundColor: '#4CAF50' }]}>
      <Text style={styles.status}>
        {isSuccess ? 'Thanh toán thành công' : 'Đang chờ thanh toán'}
      </Text>
      <Text style={styles.warning}>
      {isSuccess ? 'Đơn hàng đã được thanh toán thành công' : 'Đơn hàng của bạn đang chờ thanh toán'}
        {/* <Text style={styles.bold}>KHÔNG CHUYỂN TIỀN TRƯỚC</Text> cho Shipper khi
        đơn hàng chưa được giao tới với bất kỳ lý do gì */}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("MainScreen" as never)}
        >
          <Text style={styles.backText}>Trở về</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderButton}
        >
          <Text style={styles.orderText}>Đơn mua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PendingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFAF42",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 24,
  },
  warning: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  backButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 12,
  },
  backText: {
    width: 60,
    textAlign: "center",
    color: "#FFAF42",
    fontWeight: "bold",
  },
  orderButton: {
    borderColor: "#fff",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  orderText: {
    width: 60,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
