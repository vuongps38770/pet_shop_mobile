import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
    Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "src/presentation/store/store";
import { updateVoucherStatus } from "../voucher.slice";
import { VoucherCard } from "../components/VoucherCard";
import { assets } from "../../../shared/theme/assets";
import { DropdownFilter } from "../components/DropdownFilter";
import { FilterTabItem } from "../components/FilterTabItem";
import { VoucherHeader } from "../components/VoucherHeader";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { StatGroup } from "../components/VoucherStatGroup";

export const MyVoucherScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
const navigation = useMainNavigation();
  const allVouchers = useSelector(
    (state: RootState) => state.voucher.allVouchers
  );
  const [filterStatus, setFilterStatus] = useState<
    "available" | "used" | "expired"
  >("available");
  const [filterType, setFilterType] = useState<"all" | "discount" | "freeship">(
    "all"
  );

  const filteredVouchers = allVouchers.filter(
    (v) =>
      (filterStatus === "available"
        ? v.status === "available"
        : filterStatus === "used"
        ? v.status === "used"
        : v.status === "expired") &&
      (filterType === "all" || v.type === filterType)
  );

  const availableCount = allVouchers.filter(
    (v) => v.status === "available"
  ).length;
    const usedCount = allVouchers.filter((v) => v.status === "used").length;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <VoucherHeader
        title="Voucher của tôi"
        subtitle="Quản lý và sử dụng voucher đã thu thập"
        onBack={() => navigation.goBack()}
      />

      {/* Summary boxes */}
      <StatGroup
        items={[
          {
            label: "Chưa sử dụng",
            value: availableCount,
            active: filterStatus === "available",
            onPress: () => setFilterStatus("available"),
          },
          {
            label: "Đã sử dụng",
            value: usedCount,
            active: filterStatus === "used",
            onPress: () => setFilterStatus("used"),
            valueColor: "#007AFF",
          },
        ]}
      />

      {/* Filters */}

      <View style={styles.filterTabs}>
        <FilterTabItem
          label="Chưa dùng"
          icon={assets.icons.voucher.confirmation}
          active={filterStatus === "available"}
          onPress={() => setFilterStatus("available")}
        />
        <FilterTabItem
          label="Đã dùng"
          icon={assets.icons.voucher.schedule}
          active={filterStatus === "used"}
          onPress={() => setFilterStatus("used")}
        />
        <FilterTabItem
          label="Hết hạn"
          icon={assets.icons.voucher.dangerous}
          active={filterStatus === "expired"}
          onPress={() => setFilterStatus("expired")}
        />
      </View>

      {/* Dropdowns */}

      <View style={styles.dropdownRow}>
        <DropdownFilter label="Tất cả loại" />
        <DropdownFilter label="Hạn sử dụng" />
      </View>

      {/* Voucher list */}
      {filteredVouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          title={voucher.title}
          discount={voucher.discount}
          condition={voucher.condition}
          expiry={voucher.expiry}
          type={voucher.type}
          actionLabel={
            voucher.status === "used"
              ? "Đã dùng"
              : voucher.status === "expired"
              ? "Hết hạn"
              : "Sử dụng"
          }
          actionIcon={assets.icons.voucher.shopping}
          actionTextColor="#FFA63D"
          onPress={() => {
            if (voucher.status === "available") {
              dispatch(updateVoucherStatus({ id: voucher.id, status: "used" }));
            }
          }}
        />
      ))}

      {/* Notice */}
      {filterStatus === "available" && (
        <View style={styles.noticeBox}>
          <View style={styles.noticeContent}>
            <Image
              source={assets.icons.voucher.contact}
              style={styles.noticeIcon}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeText}>
                Có {availableCount} voucher chưa sử dụng
              </Text>
              <Text style={styles.noticeSubText}>
                Hãy sử dụng voucher trước khi hết hạn
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff"
    },
  filterTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },

  noticeBox: {
    backgroundColor: "#E0F4FF",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },

  noticeContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  noticeIcon: {
    width: 30,
    height: 30,
    marginTop: -10,
    marginRight: 12,
  },

  noticeText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  noticeSubText: {
    color: "#007AFF",
    fontSize: 12,
    marginTop: 2,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

});
