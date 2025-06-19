import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CanceledItem, { CanceledOrder } from '../components/CanceledItem';

const canceledOrders: CanceledOrder[] = [
  {
    _id: '23859595',
    createdAt: '2025-06-06T10:00:00.000Z',
    productName: 'CableKeep Organizer Set',
    productDesc: 'Multi-color, 5-Pack',
    quantity: 1,
    totalPrice: 1999,
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg',
    canceledDate: '6 tháng 6 năm 2025',
  },
  // Thêm các đơn hàng bị hủy khác nếu muốn
];

const CanceledScreen = () => {
  const handleBuyAgain = (order: CanceledOrder) => {
    // Xử lý khi nhấn Mua lại
    console.log('Buy again:', order._id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={canceledOrders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <CanceledItem
            order={item}
            onBuyAgain={handleBuyAgain}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default CanceledScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});