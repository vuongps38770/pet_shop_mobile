import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacing } from 'theme/spacing';
import { FlashList } from '@shopify/flash-list';
import AwaitingpickupItem from '../components/AwaitingpickupItem';

const awaitingpickupproduct = [
    {
        _id: "1",
        status: "Chờ lấy hàng",
        product: {
            name: "Hill's Prescription Diet Canine Gastrointestinal Health",
            variant: "Pink,38",
            quantity: 1,
            price: 11000,
            image: "https://ampet.vn/wp-content/uploads/2022/11/Thuc-an-cho-cho-13.jpg"
        },
        totalItems: 1,
        totalPrice: 11000,
        deliveryDeadline: "2020-03-15",
        orderCode: "200311H5RD78NR",
        button: "Vận chuyển"
    },
    {
        _id: "2",
        status: "Đang giao",
        product: {
            name: "Royal Canin Size Health Nutrition Maxi Adult Dog Food",
            variant: "Black,L",
            quantity: 55,
            price: 14900,
            image: "https://ampet.vn/wp-content/uploads/2022/11/Thuc-an-cho-cho-13.jpg"
        },
        totalItems: 44,
        totalPrice: 298800,
        deliveryDeadline: "2020-03-16",
        orderCode: "200312H5RD79AB",
        button: "Theo dõi"
    },
    {
        _id: "3",
        status: "Chờ xác nhận",
        product: {
            name: "Purina Pro Plan Savor Adult Shredded Blend Chicken & Rice Formula",
            variant: "Beige,Free size",
            quantity: 1,
            price: 89000,
            image: "https://ampet.vn/wp-content/uploads/2022/11/Thuc-an-cho-cho-13.jpg"
        },
        totalItems: 1,
        totalPrice: 89000,
        deliveryDeadline: "2020-03-17",
        orderCode: "200313H5RD80CD",
        button: "Xác nhận"
    }
];




const AwaitingpickupScreen = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={awaitingpickupproduct}
                renderItem={({ item }) => <AwaitingpickupItem orderPickup={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false} />
        </View>
    )
}

export default AwaitingpickupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
    }
})