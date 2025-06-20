// components/OrderSummary.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PriceFormatter } from "app/utils/priceFormatter";
import { colors } from "shared/theme/colors";

interface OrderSummaryProps {
  subtotal: number;
  tax?: number;
  delivery: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,

  delivery,
  total,
}) => (
  <>
    <Text style={styles.title}>Order summary</Text>

    <View style={styles.row}>
      <Text style={styles.label}>Subtotal</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(subtotal)}</Text>
    </View>
    {/* <View style={styles.row}>
      <Text style={styles.label}>Tax and Services</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(tax)}</Text>
    </View> */}
    <View style={styles.row}>
      <Text style={styles.label}>Delivery</Text>
      <Text style={styles.value}>{PriceFormatter.formatPrice(delivery)}</Text>
    </View>
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          { fontWeight: "bold", color: colors.text.primary },
        ]}
      >
        Total :
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
    <View style={styles.row}>
      <Text style={styles.deliveryEstimate}>Estimated delivery time</Text>
      <Text style={styles.deliveryTime}>15 - 30 mins</Text>
    </View>
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
