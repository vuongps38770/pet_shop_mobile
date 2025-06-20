import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, ToastAndroid, Pressable, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { getCart, addToCart, removeFromCart, setSelectedIds, selectAll, deselectAll } from '../cart.slice';
import CartItem from '../components/CartItem';
import { colors } from '../../../shared/theme/colors';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
const screenWidth = Dimensions.get('window').width
const CartScreen = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { items, selectedIds } = useSelector((state: RootState) => state.cart || []);

  // State lưu số lượng tạm thời để debounce
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const debounceTimers = useRef<{ [id: string]: NodeJS.Timeout }>({});

  const handleOder = () => {
    navigation.navigate('OrderScreen');
  }

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    // Khi items thay đổi, cập nhật số lượng tạm thời
    const newQuantities: { [id: string]: number } = {};
    items.forEach(item => {
      newQuantities[item._id] = item.quantity;
    });
    setQuantities(newQuantities);
    // Khi getCart thành công, selectedIds mặc định là []
    dispatch(setSelectedIds([]));
  }, [items]);

  // Group items theo product_id
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.product_id]) acc[item.product_id] = [];
    acc[item.product_id].push(item);
    return acc;
  }, {} as { [productId: string]: typeof items });


  const productIds = Object.keys(groupedItems);

  // Tính tổng tiền chỉ các item được chọn
  const subtotal = (items || []).reduce((sum, item) =>
    selectedIds.includes(item._id) ? sum + item.promotionalPrice * (quantities[item._id] ?? item.quantity) : sum, 0
  ) || 0;
  const tax = 2;
  const delivery = 3;
  const total = subtotal + tax + delivery;

  // Xử lý chọn/bỏ chọn item
  const handleCheck = (id: string) => {
    if (selectedIds.includes(id)) {
      dispatch(setSelectedIds(selectedIds.filter(i => i !== id)));
    } else {
      dispatch(setSelectedIds([...selectedIds, id]));
    }
  };

  // Chọn tất cả / bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      dispatch(deselectAll());
    } else {
      dispatch(selectAll());
    }
  };

  // Xử lý tăng số lượng (debounce, update UI ngay)
  const handleIncrease = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    debounceUpdateQuantity(id, (quantities[id] || items.find(i => i._id === id)?.quantity || 0) + 1);
  };

  // Xử lý giảm số lượng (debounce, update UI ngay)
  const handleDecrease = (id: string) => {
    if ((quantities[id] || items.find(i => i._id === id)?.quantity || 0) > 1) {
      setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      debounceUpdateQuantity(id, (quantities[id] || items.find(i => i._id === id)?.quantity || 0) - 1);
    }
  };

  // Debounce cập nhật số lượng
  const debounceUpdateQuantity = (id: string, quantity: number) => {
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    debounceTimers.current[id] = setTimeout(() => {
      const item = items.find(i => i._id === id);
      if (item && quantity !== item.quantity) {
        dispatch(addToCart({ productVariantId: item.productVariantId, quantity }));
      }
    }, 500);
  };

  // Xoá item
  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    dispatch(setSelectedIds(selectedIds.filter(i => i !== id)));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.insideContainer} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <Text style={styles.header}>Cart</Text>

        {/* Nút chọn tất cả */}
        {items.length > 0 && (
          <TouchableOpacity style={styles.selectAllBtn} onPress={handleSelectAll}>
            <Text style={{ color: colors.app.primary.main, fontWeight: 'bold' }}>
              {selectedIds.length === items.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Nếu giỏ hàng trống */}
        {items.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            {/* Có thể thay icon bằng hình ảnh hoặc icon vector */}
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống</Text>
          </View>
        ) : (
          <View style={styles.limitCartContainer}>
            {productIds.map(productId => (
              <View key={productId} style={styles.productGroupBlock}>
                {groupedItems[productId].map(item => (
                  <CartItem
                    key={item._id}
                    item={item}
                    checked={selectedIds.includes(item._id)}
                    onCheck={handleCheck}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                    quantities={quantities}
                  />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Promo code */}
        {items.length > 0 && (
          <View style={styles.promoContainer}>
            <TextInput
              placeholder="Promo code"
              style={styles.promoInput}
              placeholderTextColor={colors.text.secondary}
            />
            <TouchableOpacity style={styles.promoButton}>
              <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 20 }}>+</Text>
            </TouchableOpacity>
          </View>
        )}


      </ScrollView>
      {/* Tổng kết*/}
      {(selectedIds.length > 0 &&
        <View style={styles.outterButton}>
          <TouchableOpacity style={styles.payButton} onPress={handleOder}>
            <Text style={styles.payButtonText}>PROCEED PAY</Text>
          </TouchableOpacity>
        </View>

        // <>
        //   <View style={styles.summaryRow}>
        //     <Text style={styles.summaryLabel}>Subtotal</Text>
        //     <Text style={styles.summaryValue}>{PriceFormatter.formatPrice(subtotal)} </Text>
        //   </View>
        //   <View style={styles.summaryRow}>
        //     <Text style={styles.summaryLabel}>Tax and Services</Text>
        //     <Text style={styles.summaryValue}>{PriceFormatter.formatPrice(tax)} </Text>
        //   </View>
        //   <View style={styles.summaryRow}>
        //     <Text style={styles.summaryLabel}>Delivery</Text>
        //     <Text style={styles.summaryValue}>{PriceFormatter.formatPrice(delivery)} </Text>
        //   </View>
        //   <View style={styles.summaryRow}>
        //     <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total</Text>
        //     <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>{PriceFormatter.formatPrice(total)} </Text>
        //   </View>



        // </>
      )}
    </View>

  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: 16,
    position: 'relative'
  },
  insideContainer: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    alignSelf: 'center',
    marginVertical: 8,
  },
  selectAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    padding: 6,
  },
  addressContainer: {
    backgroundColor: colors.background.paper,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  addressLabel: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  addressValue: {
    color: colors.app.primary.main,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.app.primary.main,
    marginVertical: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  promoInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    padding: 8,
  },
  promoButton: {
    backgroundColor: colors.app.primary.main,
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.text.primary,
    fontSize: 15,
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: 15,
  },
  usd: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  outterButton: {
    position: 'absolute',
    paddingHorizontal: 14,
    width: screenWidth,
    left: 0,
    bottom: 0,
  },
  payButton: {
    backgroundColor: colors.app.primary.main,
    borderRadius: 12,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: '100%',
    borderColor: colors.app.primary.darker,
    borderWidth: 4,
    marginBottom: 10
  },
  payButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  limitCartContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.background.paper,
    padding: 8,
  },
  productGroupBlock: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
    paddingBottom: 8,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  emptyCartIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyCartText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontWeight: 'bold',
  },
});