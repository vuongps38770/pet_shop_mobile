import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import DeliveredItem, { DeliveredOrder } from '../components/DeliveredItem';

const deliveredOrders: DeliveredOrder[] = [
  {
    _id: '23859640',
    createdAt: "2025-01-15T10:00:00.000Z",
    productName: 'Giá đỡ máy tính bảng FlexiStand',
    productDesc: 'Bạc, Có thể điều chỉnh',
    quantity: 1,
    totalPrice: 2999,
    image: 'https://cdn.tgdd.vn/Products/Images/54/303949/tai-nghe-bluetooth-true-wireless-anker-soundcore-r50i-thumb-1-600x600.jpg',
    deliveredDate: '13 tháng 6 năm 2025',
    
  },
  {
    _id: '23859641',
    createdAt: "2025-01-15T10:00:00.000Z",
    productName: 'Bàn phím Bluetooth SlimKey',
    productDesc: 'Đen, Bluetooth 5.0',
    quantity: 2,
    totalPrice: 5998,
    image: 'https://cdn.tgdd.vn/Products/Images/54/303949/tai-nghe-bluetooth-true-wireless-anker-soundcore-r50i-thumb-1-600x600.jpg',
    deliveredDate: '15 tháng 6 năm 2025',
   
  },
];

const DeliveredScreen = () => {
  const handleBuyAgain = (order: DeliveredOrder) => {
    // Xử lý khi nhấn Mua lại
    console.log('Buy again:', order._id);
  };
  const handleWriteReview = (order: DeliveredOrder) => {
    // Xử lý khi nhấn Viết Đánh giá
    console.log('Write review:', order._id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveredOrders}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <DeliveredItem
            order={item}
            onBuyAgain={handleBuyAgain}
            onWriteReview={handleWriteReview}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default DeliveredScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});