import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchAvailableVouchersForOrder, setSelectedVoucher, clearVouchers } from '../pick-voucher.slice';
import { setVoucherCode, caculateOrder } from '../order.slice';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { colors } from 'shared/theme/colors';
import { VoucherAvailableRes } from 'src/presentation/dto/res/voucher-respond';
import IconBack from 'assets/icons/back.svg';

interface PickVoucherScreenProps {
  route: {
    params: {
      total: number;
    };
  };
}

const PickVoucherScreen: React.FC<PickVoucherScreenProps> = ({ route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useMainNavigation();
  const { total } = route.params;

  const [isNavigating, setIsNavigating] = useState(false);
  const { availableVouchers, selectedVoucher, isLoading, error } = useSelector(
    (state: RootState) => state.pickVoucher
  );
  const { orderItems, shippingAddressId } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(fetchAvailableVouchersForOrder({ total }));

    return () => {
      dispatch(clearVouchers());
    };
  }, [dispatch, total]);

  const handleSelectVoucher = (voucher: VoucherAvailableRes) => {
    if (isNavigating) return;
    
    dispatch(setSelectedVoucher(voucher));
    Alert.alert(
      'Chọn voucher',
      `Bạn đã chọn voucher: ${voucher.code}`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: async () => {
            if (isNavigating) return;
            setIsNavigating(true);
            
            // Set voucher code vào order state
            dispatch(setVoucherCode(voucher.code));
            
            // Tính lại tiền đơn hàng với voucher
            if (orderItems && shippingAddressId) {
              await dispatch(caculateOrder({
                orderItems,
                shippingAddressId,
                voucherCode: voucher.code
              }));
            }
            
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleRemoveVoucher = () => {
    if (isNavigating) return;
    
    Alert.alert(
      'Xóa voucher',
      'Bạn có muốn xóa voucher đã chọn?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: async () => {
            if (isNavigating) return;
            setIsNavigating(true);
            
            // Xóa voucher code
            dispatch(setVoucherCode(''));
            
            // Tính lại tiền đơn hàng không có voucher
            if (orderItems && shippingAddressId) {
              await dispatch(caculateOrder({
                orderItems,
                shippingAddressId
              }));
            }
            
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderVoucherItem = ({ item }: { item: VoucherAvailableRes }) => {
    const discountText = item.discount_type === 'percent' 
      ? `Giảm ${item.discount_value}%` 
      : `Giảm ${item.discount_value.toLocaleString('vi-VN')}đ`;
    
    const isSelected = selectedVoucher?._id === item._id;

    return (
              <TouchableOpacity
          style={[
            styles.voucherItem,
            isSelected && styles.selectedVoucher
          ]}
          onPress={() => handleSelectVoucher(item)}
          disabled={isNavigating}
        >
        <View style={styles.voucherHeader}>
          <Text style={styles.voucherCode}>{item.code}</Text>
          <Text style={styles.discountText}>{discountText}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.minOrder}>
          Đơn hàng tối thiểu: {item.min_order_value.toLocaleString('vi-VN')}đ
        </Text>
        {item.max_discount && (
          <Text style={styles.maxDiscount}>
            Giảm tối đa: {item.max_discount.toLocaleString('vi-VN')}đ
          </Text>
        )}
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>Đã chọn</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.app.primary.main} />
        <Text style={styles.loadingText}>Đang tải voucher...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => !isNavigating && navigation.goBack()}>
          <IconBack width={20} height={20} style={[styles.backIcon, isNavigating && styles.disabledIcon]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn voucher</Text>
        <TouchableOpacity onPress={handleRemoveVoucher} disabled={isNavigating}>
          <Text style={[styles.removeText, isNavigating && styles.disabledText]}>Xóa voucher</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={availableVouchers}
        keyExtractor={(item) => item._id}
        renderItem={renderVoucherItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có voucher khả dụng</Text>
              <Text style={styles.emptySubText}>
                Tổng đơn hàng: {total.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default PickVoucherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backIcon: {
    width: 20,
    height: 20,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  removeText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  disabledIcon: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  voucherItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedVoucher: {
    borderColor: colors.app.primary.main,
    backgroundColor: '#FFF8E1',
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.app.primary.main,
  },
  discountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  minOrder: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  maxDiscount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});