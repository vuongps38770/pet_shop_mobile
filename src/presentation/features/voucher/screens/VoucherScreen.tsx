import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "src/presentation/store/store";
import { updateVoucherStatus } from "../voucher.slice";
import { VoucherCard } from "../components/VoucherCard";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { VoucherHeader } from "../components/VoucherHeader";
import { assets } from "../../../shared/theme/assets";
import { StatGroup } from "../components/VoucherStatGroup";

export const VoucherScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useMainNavigation();
  const [searchText, setSearchText] = useState("");
  const allVouchers = useSelector(
    (state: RootState) => state.voucher.allVouchers
  );

  const availableVouchers = allVouchers.filter(
    (v) =>
      v.status === "available" &&
      v.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const freeshipCount = availableVouchers.filter(
    (v) => v.type === "freeship"
  ).length;

  return (
    <ScrollView style={styles.container}>
      {/* Header component */}
      <VoucherHeader
        title="Voucher"
        subtitle="Thu thập voucher ưu đãi hàng ngày"
        onBack={() => navigation.goBack()}
      />

      {/* Search box */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={18}
          color="#FFA63D"
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Summary boxes */}
      <StatGroup
        items={[
          {
            label: "Voucher khả dụng",
            value: availableVouchers.length,
          },
          {
            label: "Miễn ship",
            value: freeshipCount,
            valueColor: "green",
          },
        ]}
      />

      {/* Vouchers */}
      {availableVouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          title={voucher.title}
          discount={voucher.discount}
          condition={voucher.condition}
          expiry={voucher.expiry}
          type={voucher.type}
          actionLabel="Thu thập"
          actionIcon={assets.icons.voucher.bookmark}
          onPress={() =>
            dispatch(updateVoucherStatus({ id: voucher.id, status: "used" }))
          }
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff"
    },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: "#000",
  },
});
