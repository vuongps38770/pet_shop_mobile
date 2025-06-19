import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacing } from 'theme/spacing';
import { FlashList } from '@shopify/flash-list';
import AwaitingConfirmationItem from '../components/AwaitingConfirmationItem';

const orderawaiting = [
    {
      _id: "23859718",
      name: "Bàn phím không dây ErgoType",
      productCount: 1,
      totalPrice: 890.99,
      expiredAt: "2025-06-15T23:59:59.000Z",
      image: "https://wallpaperaccess.com/full/1910661.jpg", // thay bằng link thật nếu có
      attributes: "Xám không gian, Cơ khí",
      createdAt: "2025-06-14T10:00:00.000Z"
    },
    {
      _id: "23859698",
      name: "Chuột không dây UltraGlide",
      productCount: 1,
      totalPrice: 499.99,
      expiredAt: "2025-06-14T23:59:59.000Z",
      image: "https://wallpaperaccess.com/full/1910661.jpg", // thay bằng link thật nếu có
      attributes: "Đen, Công thái học",
      createdAt: "2025-06-13T10:00:00.000Z"
    }
  ];
  
const AwaitingConfirmationScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={orderawaiting}
        renderItem={({ item }) => <AwaitingConfirmationItem orderss={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}/>
    </View>
  )
}

export default AwaitingConfirmationScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal: spacing.md,
    }
})