import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "src/presentation/store/store";
import { fetchUserVouchers, saveUserVouchers, clearVouchers, incrementPage } from "../voucher.slice";
import { ButtonType, VoucherCard } from "../components/VoucherCard";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { VoucherHeader } from "../components/VoucherHeader";
import { assets } from "../../../shared/theme/assets";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native";

export const VoucherScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useMainNavigation();
  const [searchText, setSearchText] = useState("");
  const { data: allVouchers, isLoading, error, itemLoading, hasNext, page } = useSelector(
    (state: RootState) => state.voucher
  );
  useFocusEffect(
    useCallback(() => {
      dispatch(clearVouchers());
      dispatch(fetchUserVouchers({ status: 'not_collected' }));
      return () => {
        dispatch(clearVouchers());
      };
    }, [dispatch])
  );
  const handleLoadMore = () => {
    if (!isLoading && hasNext) {
      dispatch(incrementPage());
      dispatch(fetchUserVouchers({ status: 'not_collected', page: page + 1 }));
    }
  };



  return (
    <ScrollView style={styles.container}>
      {/* Header component */}
      <VoucherHeader
        title="Voucher"
        subtitle="Thu thập voucher ưu đãi hàng ngày"
        onBack={() => navigation.goBack()}
        onGotoMy={() => navigation.navigate('MyVoucherScreen')}
      />

      {/* Search box */}
      {/* <View style={styles.searchBox}>
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
      </View> */}

      {/* Summary boxes */}
      {/* <StatGroup
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
      /> */}

      {/* Loading & Error */}
      <FlatList
        scrollEnabled={false}
        data={allVouchers}
        keyExtractor={(item) => item._id}
        extraData={allVouchers}
        renderItem={({ item }) => {
          const isButtonDisabled = item.is_collected || item.quantity === item.used;
          const buttonType = item.quantity === item.used ? ButtonType.NONE: (item.is_collected ? ButtonType.ADDED : ButtonType.ADD_TO_CART);
          const actionLabel = item.is_collected ? "Đã lưu" : "Thu thập";
          
          return (
            <VoucherCard
              voucher={item}
              actionLabel={actionLabel}
              onPress={() => {
                if (!isButtonDisabled) {
                  dispatch(saveUserVouchers(item._id));
                }
              }}
              isLoading={itemLoading[item._id]}
              buttonType={buttonType}
            />
          );
        }}

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
