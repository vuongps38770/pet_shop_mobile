import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { assets } from "../../../shared/theme/assets";

interface VoucherCardProps {
  title: string;
  discount: string;
  condition: string;
  expiry: string;
  type: "discount" | "freeship";
  actionLabel: string;
  actionIcon: any;
  actionTextColor?: string;
  onPress: () => void;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  title,
  discount,
  condition,
  expiry,
  type,
  actionLabel,
  actionIcon,
  actionTextColor,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={[
            styles.typeTag,
            {
              backgroundColor: type === "discount" ? "#D4ECFF" : "#C8FACC",
            },
          ]}
        >
          <Text
            style={{
              color: type === "discount" ? "#4B89FF" : "#06A94D",
              fontWeight: "600",
              fontSize: 12,
            }}
          >
            {type === "discount" ? "Shop" : "Miễn phí vận chuyển"}
          </Text>
        </View>
      </View>

      {/* Discount Box */}
      <View style={styles.discountBox}>
        <Text style={styles.discount}>{discount}</Text>
        <Image
          source={assets.icons.voucher.redeem}
          style={{ width: 24, height: 24, tintColor: "#FFA63D" }}
        />
      </View>

      {/* Điều kiện */}
      <Text style={styles.condition}>{condition}</Text>
      <Text style={styles.subCondition}>Áp dụng cho tất cả sản phẩm</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.expiryBox}>
          <Image
            source={assets.icons.voucher.calender}
            style={{ width: 16, height: 16, tintColor: "#888", marginTop: -35 }}
          />
          <Text style={styles.expiryText}> HSD: {expiry}</Text>
        </View>

        <View style={styles.actionColumn}>
          <View style={styles.statusBox}>
            <Image
              source={assets.icons.voucher.hourglass}
              style={{ width: 16, height: 16, tintColor: "#00B14F" }}
            />
            <Text style={styles.statusText}> Còn hạn</Text>
          </View>
          <TouchableOpacity onPress={onPress} style={styles.useBtn}>
            <Image
              source={actionIcon}
              style={{
                width: 16,
                height: 16,
                marginRight: 6,
                tintColor: actionTextColor ?? (actionLabel === "Sử dụng" ? "#FFA63D" : "#000"),
              }}
            />
            <Text
              style={[styles.useText, { color: actionTextColor || "#000" }]}
            >
              {actionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
    marginRight: 6,
    color: "#000",
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  discountBox: {
    backgroundColor: "#FFF2DC",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  discount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFA63D",
  },
  condition: {
    color: "#888",
    fontSize: 13,
    marginBottom: 2,
  },
  subCondition: {
    color: "#888",
    fontSize: 13,
    marginBottom: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expiryBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  expiryText: {
    color: "#888",
    marginTop: -35,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  statusText: {
    color: "#00B14F",
    fontSize: 12,
  },
  useBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  useText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
