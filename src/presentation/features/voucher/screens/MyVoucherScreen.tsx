import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "src/presentation/store/store";
import { fetchUserVouchers, clearVouchers, incrementPage } from "../voucher.slice";
import { ButtonType, VoucherCard } from "../components/VoucherCard";
import { assets } from "../../../shared/theme/assets";
import { DropdownFilter } from "../components/DropdownFilter";
import { FilterTabItem } from "../components/FilterTabItem";
import { VoucherHeader } from "../components/VoucherHeader";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { StatGroup } from "../components/VoucherStatGroup";
import { VoucherApplyType } from "src/presentation/dto/res/voucher-respond";
import { useFocusEffect } from "@react-navigation/native";

export const MyVoucherScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useMainNavigation();
  const [filterStatus, setFilterStatus] = useState<
    'collected_unused' | 'collected_used' | 'expired_unused'
  >('collected_unused');
  const [filterType, setFilterType] = useState<'all' | 'discount' | 'freeship'>('all');

  const { data: vouchers, isLoading, error, hasNext, page } = useSelector((state: RootState) => state.voucher);


  useFocusEffect(
    useCallback(() => {
      dispatch(clearVouchers());
      dispatch(fetchUserVouchers({ status: filterStatus }));
      return () => {
        dispatch(clearVouchers());
      };
    }, [dispatch, filterStatus])
  );

  // const filteredVouchers = vouchers.filter(
  //   (v) =>
  //     (filterType === 'all' || v.discount_type === filterType) // discount_type: 'discount' | 'freeship'
  // );

  const unusedCount = vouchers.filter((v) => v.status === 'collected_unused').length;
  const usedCount = vouchers.filter((v) => v.status === 'collected_used').length;
  const expiredCount = vouchers.filter((v) => v.status === 'expired_unused').length;
  const handleLoadMore = () => {
    if (!isLoading && hasNext) {
      dispatch(incrementPage());
      dispatch(fetchUserVouchers({ status: filterStatus, page: page + 1 }));
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <VoucherHeader
        title="Voucher của tôi"
        subtitle="Quản lý và sử dụng voucher đã thu thập"
        onBack={() => navigation.goBack()}
        showLeft={false}
      />

      {/* StatGroup */}
      {/* <StatGroup
        items={[
          {
            label: "Chưa sử dụng",
            value: unusedCount,
            active: filterStatus === "collected_unused",
            onPress: () => setFilterStatus("collected_unused"),
          },
          {
            label: "Đã sử dụng",
            value: usedCount,
            active: filterStatus === "collected_used",
            onPress: () => setFilterStatus("collected_used"),
            valueColor: "#007AFF",
          },
          {
            label: "Hết hạn",
            value: expiredCount,
            active: filterStatus === "expired_unused",
            onPress: () => setFilterStatus("expired_unused"),
            valueColor: "#888",
          },
        ]}
      /> */}

      {/* Filter tabs */}
      <View style={styles.filterTabs}>
        <FilterTabItem
          label={(filterStatus != 'collected_unused') ? "Khả dụng" : `Khả dụng (${vouchers.length})`}
          icon={assets.icons.voucher.confirmation}
          active={filterStatus === "collected_unused"}
          onPress={() => setFilterStatus("collected_unused")}
        />
        <FilterTabItem
          label={(filterStatus != 'collected_used') ? "Đã dùng" : `Đã dùng (${vouchers.length})`}
          icon={assets.icons.voucher.schedule}
          active={filterStatus === "collected_used"}
          onPress={() => setFilterStatus("collected_used")}
        />
        <FilterTabItem
          label={(filterStatus != 'expired_unused') ? "Hết hạn" : `Hết hạn (${vouchers.length})`}
          icon={assets.icons.voucher.dangerous}
          active={filterStatus === "expired_unused"}
          onPress={() => setFilterStatus("expired_unused")}
        />
      </View>

      {/* Dropdowns */}
      {/* <View style={styles.dropdownRow}>
        <DropdownFilter label="Tất cả loại" />
        <DropdownFilter label="Hạn sử dụng" />
      </View> */}

      {/* Loading & Error */}
      {/* {isLoading && (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <ActivityIndicator size="large" color="#FFA63D" />
        </View>
      )} */}
      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{error}</Text>
      )}

      {/* Voucher list */}
      {/* {filteredVouchers.length === 0 && !isLoading && (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
          Không có voucher nào phù hợp
        </Text>
      )} */}
      <FlatList
        scrollEnabled={false}
        data={vouchers}
        keyExtractor={(item, index) => `_${index}`}
        renderItem={({ item,index }) => (
          <VoucherCard
            voucher={item}
            actionLabel={
              filterStatus === 'collected_used'
                ? 'Đã dùng'
                : filterStatus === 'expired_unused'
                  ? 'Hết hạn'
                  : 'Sử dụng'
            }
            actionTextColor="#FFA63D"
            onPress={() => {

            }}
            buttonType={
              filterStatus === 'collected_used'
                ? ButtonType.USED
                : filterStatus === 'expired_unused'
                  ? ButtonType.EXPIRED
                  : ButtonType.USE
            }
            showUsageBar={filterStatus === 'collected_unused'}
          />
        )}

        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
              Không có voucher khả dụng
            </Text>
          ) : null
        }
        ListFooterComponent={
          isLoading ? (
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#FFA63D" />
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.6}
      />


      {/* Notice */}
      {/* {filterStatus === "collected_unused" && (
        <View style={styles.noticeBox}>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeText}>
              Có {unusedCount} voucher chưa sử dụng
            </Text>
            <Text style={styles.noticeSubText}>
              Hãy sử dụng voucher trước khi hết hạn
            </Text>
          </View>
        </View>
      )} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
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
    flexDirection: "column",
    alignItems: "center",
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
