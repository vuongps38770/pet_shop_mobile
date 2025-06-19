import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WaitForPaymentItem from '../components/WaitForPaymentItem'
import { FlatList } from 'react-native'
import { spacing } from 'theme/spacing';


const orders = [
    {
      _id: "1",
      name: "Apple Watch Series 8",
      productCount: 10,
      totalPrice: 999,
      expiredAt: "2025-12-31T23:59:59.000Z",
      image: "https://www.anphatpc.com.vn/media/news/2509_Top10tainghepcgaming_2.jpg",
      attributes: "Black, GPS + Cellular",
      createdAt: "2025-01-15T10:00:00.000Z"
    },
    {
      _id: "2",
      name: "Samsung Galaxy Buds 2 Pro",
      productCount: 5,
      totalPrice: 49559,
      expiredAt: "2025-10-01T00:00:00.000Z",
      image: "https://www.anphatpc.com.vn/media/news/2509_Top10tainghepcgaming_2.jpg",
      attributes: "Graphite, Noise Canceling",
      createdAt: "2025-03-10T14:30:00.000Z"
    },
  ];
  
  


const WaitForPaymentScreen = () => {

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => <WaitForPaymentItem order={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}/>
    </View>
  )
}

export default WaitForPaymentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
    }
})