import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import AwaitingShippingItem, { AwaitingShippingOrder } from '../components/AwaitingShippingItem';
import { SPACING } from 'theme/layout';
import { spacing } from 'theme/spacing';

const orders: AwaitingShippingOrder[] = [
  {
    _id: '23859712',
    createdAt: "2025-01-15T10:00:00.000Z",
    productName: 'SmartBell Video Doorbell',
    quantity: 1,
    totalPrice: 1499909,
    status: 'Xử lý để vận chuyển',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg',
  },
  {
    _id: '23859713',
    createdAt: "2025-01-15T10:00:00.000Z",
    productName: 'SecureView Pro Camera',
    quantity: 2,
    totalPrice: 7999,
    status: 'Chuẩn bị vận chuyển',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg',
  },
  {
    _id: '23859714',
    createdAt: "2025-01-15T10:00:00.000Z",
    productName: 'Pet Feeder Auto',
    quantity: 1,
    totalPrice: 99990,
    status: 'Xử lý kho',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg',
  },
  {
    _id: '23859714',
    createdAt: "2025-01-15T10:00:00.000Z",
    productName: 'Pet Feeder Auto',
    quantity: 1,
    totalPrice: 99990,
    status: 'Xử lý kho',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg',
  },
];

const AwaitingShippingScreen = () => {
  const handleContactSeller = (order: AwaitingShippingOrder) => {
    // Xử lý khi nhấn Contact Seller
    console.log('Contact Seller:', order._id);
  };
  const handlePressOrder = (order: AwaitingShippingOrder) => {
    // Xử lý khi nhấn vào đơn hàng
    console.log('Press Order:', order._id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <AwaitingShippingItem
            order={item}
            onContactSeller={handleContactSeller}
            onPress={handlePressOrder}
          />
        )}
        contentContainerStyle={{ }}
      />
    </View>
  );
};

export default AwaitingShippingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  
  },
});