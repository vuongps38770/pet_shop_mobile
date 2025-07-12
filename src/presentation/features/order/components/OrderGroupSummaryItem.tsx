import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PriceFormatter } from "app/utils/priceFormatter";
import { GroupedProductSummary } from "src/presentation/dto/res/order-respond.dto";



interface Props {
  group: GroupedProductSummary;
}

export const OrderGroupSummaryItem: React.FC<Props> = ({ group }) => {
  const { productName, variants } = group;
  const totalPrice = variants.reduce((sum, variant) => {
    return sum + variant.promotionalPrice * variant.quantity;
  }, 0);
  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{productName}</Text>
      {variants.length === 1 && variants[0].name === "" ? (
        <View style={styles.row}>
          <Text/>
          <Text style={styles.quantity}>×{variants[0].quantity}</Text>
        </View>
      ) : (
        <View style={styles.variantList}>
          {variants.map((v, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.variantName}>{v.name}</Text>
              <Text style={styles.quantity}>×{v.quantity}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.total}>Tổng: {PriceFormatter.formatPrice(totalPrice)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,



  },
  productName: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  variantList: {
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  variantName: {
    color: "#333",
    fontSize: 14,
  },
  quantity: {
    color: "#888",
    fontSize: 14,
  },
  total: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#FFAF42",
    fontSize: 15,
    alignSelf: "flex-end",
  },
}); 