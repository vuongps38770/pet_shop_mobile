// components/OrderSummary.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PriceFormatter } from "app/utils/priceFormatter";
import { colors } from "shared/theme/colors";
import { GroupedProductSummary } from "src/presentation/dto/res/order-respond.dto";
import { OrderGroupSummaryItem } from "./OrderGroupSummaryItem";

interface OrderSummaryProps {
  subtotal: number;
  tax?: number;
  delivery: number;
  total: number;
  discount:number
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  delivery,
  total,
  discount
}) => (
  <>
    <Text style={styles.title}>Chi tiết thanh toán</Text>
    
    <View style={styles.row}>
      <Text style={styles.label}>Tạm tính</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(subtotal)}</Text>
    </View>
    {/* <View style={styles.row}>
      <Text style={styles.label}>Thuế và dịch vụ</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(tax)}</Text>
    </View> */}
    <View style={styles.row}>
      <Text style={styles.label}>Phí giao hàng</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(delivery)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Giảm giá:</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(discount)}</Text>
    </View>
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          { fontWeight: "bold", color: colors.text.primary },
        ]}
      >
        Tổng cộng :
      </Text>
      <Text
        style={[
          styles.value,
          { fontWeight: "bold", color: colors.text.primary },
        ]}
      >
        {PriceFormatter.formatPrice(total)}
      </Text>
    </View>
    {/* <View style={styles.row}>
      <Text style={styles.deliveryEstimate}>Thời gian giao hàng dự kiến</Text>
      <Text style={styles.deliveryTime}>15 - 30 phút</Text>
    </View> */}
  </>
);


const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginHorizontal: 15,
  },
  label: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  value: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  deliveryEstimate: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text.primary,
  },
  deliveryTime: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },

});
