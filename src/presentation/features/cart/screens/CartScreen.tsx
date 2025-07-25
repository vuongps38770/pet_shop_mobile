import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, ToastAndroid, Pressable, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { getCart, addToCart, removeFromCart, setSelectedIds, selectAll, deselectAll, clearCart } from '../cart.slice';
import CartItem from '../components/CartItem';
import { colors } from '../../../shared/theme/colors';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { useFocusEffect } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width
const CartScreen = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { items, selectedIds } = useSelector((state: RootState) => state.cart || []);
  const { getCartStatus} = useSelector((state: RootState) => state.cart);
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const debounceTimers = useRef<{ [id: string]: NodeJS.Timeout }>({});

  const handleOder = () => {
    navigation.navigate('OrderScreen');
  }

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearCart());
      dispatch(getCart());
      debounceTimers.current = {};
      return () => {
        Object.values(debounceTimers.current).forEach(timeout => {
          clearTimeout(timeout);
        });
        debounceTimers.current = {};
      };
    }, [dispatch])
  );

  useEffect(() => {
    const newQuantities: { [id: string]: number } = {};
    items.forEach(item => {
      newQuantities[item._id] = item.quantity;
    });
    setQuantities(newQuantities);
    dispatch(setSelectedIds([]));
  }, [items]);

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.product_id]) acc[item.product_id] = [];
    acc[item.product_id].push(item);
    return acc;
  }, {} as { [productId: string]: typeof items });


  const productIds = Object.keys(groupedItems);

  //todo thêm is active
  const selectableItems = items.filter(item => item.availableStock > 0 && item.quantity <= item.availableStock);
  const selectableItemIds = selectableItems.map(item => item._id);

  const subtotal = (items || []).reduce((sum, item) =>
    selectedIds.includes(item._id) ? sum + item.promotionalPrice * (quantities[item._id] ?? item.quantity) : sum, 0
  ) || 0;

  const selectedItemsCount = selectedIds.reduce((sum, id) => {
    const item = items.find(i => i._id === id);
    return sum + (item ? (quantities[id] ?? item.quantity) : 0);
  }, 0);

  const total = subtotal;

  const handleCheck = (id: string) => {
    if (selectedIds.includes(id)) {
      dispatch(setSelectedIds(selectedIds.filter(i => i !== id)));
    } else {
      dispatch(setSelectedIds([...selectedIds, id]));
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === selectableItemIds.length) {
      dispatch(deselectAll());
    } else {
      dispatch(selectAll());
    }
  };

  const handleIncrease = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    debounceUpdateQuantity(id, (quantities[id] || items.find(i => i._id === id)?.quantity || 0) + 1);
  };

  const handleDecrease = (id: string) => {
    if ((quantities[id] || items.find(i => i._id === id)?.quantity || 0) > 1) {
      setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      debounceUpdateQuantity(id, (quantities[id] || items.find(i => i._id === id)?.quantity || 0) - 1);
    }
  };

  const handleChangeQuantity = (id: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [id]: quantity }));
    debounceUpdateQuantity(id, quantity);
  };

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

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    dispatch(setSelectedIds(selectedIds.filter(i => i !== id)));
  };

  if (getCartStatus === 'loading') {
    return (
      <View style={styles.center}>
        <Text>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.insideContainer} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <Text style={styles.header}>Giỏ hàng</Text>

        {/* Nút chọn tất cả */}
        {items.length > 0 && (
          <TouchableOpacity style={styles.selectAllBtn} onPress={handleSelectAll}>
            <Text style={{ color: colors.app.primary.main, fontWeight: 'bold' }}>
              {selectedIds.length === selectableItemIds.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
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
                    onChangeQuantity={handleChangeQuantity} 
                  />
                ))}
              </View>
            ))}
          </View>
        )}

      </ScrollView>
      {/* Tổng kết*/}
      {(selectedIds.length > 0 &&
        <View style={styles.bottomBar}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryLabel}>Tạm tính ({selectedItemsCount} sản phẩm):</Text>
            <Text style={styles.summaryValue}>{PriceFormatter.formatPrice(total)}</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={handleOder}>
            <Text style={styles.payButtonText}>Đặt hàng</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </View>

  );
};

export default CartScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  payButton: {
    backgroundColor: colors.app.primary.main,
    borderRadius: 12,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    flex: 1,
    width:40
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
    gap: 12
  },
  summaryContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.app.primary.main,
  }
});