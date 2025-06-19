import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "src/presentation/store/store";
import { setOrderMethod, setOrderItems } from "../order.slice";
import { PriceFormatter } from "app/utils/priceFormatter";
import { colors } from "../../../shared/theme/colors";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { assets } from "../../../shared/theme/assets";
import { OrderSummary } from "../components/OrderSummary";
import { PaymentCard } from "../components/PaymentCard";

const OrderScreen = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const { items, selectedIds } = useSelector((state: RootState) => state.cart);
  const { subtotal, tax, delivery, total, method } = useSelector(
    (state: RootState) => state.order
  );

  const getSelectedProducts = () =>
    items
      .filter((item) => selectedIds.includes(item._id))
      .map((item) => ({
        id: item._id,
        quantity: item.quantity,
        promotionalPrice: item.promotionalPrice,
      }));

  useEffect(() => {
    dispatch(setOrderItems(getSelectedProducts()));
  }, [items, selectedIds]);

  const handlePay = () => {
    dispatch(setOrderMethod(method));
    const productsToSend = getSelectedProducts().map(({ id, quantity }) => ({
      id,
      quantity,
    }));
    console.log("Sản phẩm đã chọn:", productsToSend);

    Alert.alert(
      "Thanh toán thành công!",
      `Đã thanh toán ${PriceFormatter.formatPrice(total)}`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("PendingScreen" as never),
        },
      ]
    );
  };

  const handleSelectMethod = (selected: "vnpay" | "momo") => {
    dispatch(setOrderMethod(selected));
  };

  const paymentMethods = [
    { type: "vnpay", icon: assets.icons.orderScreen.vnpay },
    { type: "momo", icon: assets.icons.orderScreen.momo },
  ] as const;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={assets.icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <OrderSummary
        subtotal={subtotal}
        tax={tax}
        delivery={delivery}
        total={total}
      />

      <Text style={styles.title}>Payment methods</Text>

      {paymentMethods.map(({ type, icon }) => (
        <PaymentCard
          key={type}
          type={type}
          selected={method === type}
          onSelect={() => handleSelectMethod(type)}
          icon={icon}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handlePay}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
