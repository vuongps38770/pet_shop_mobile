import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from 'theme/colors';

function formatPrice(price: number) {
    return price.toLocaleString('vi-VN');
}

type AwaitingPickupProps = {
    orderPickup: {
        status: string;
        product: {
            name: string;
            variant: string;
            quantity: number;
            price: number;
            image: string;
        };
        totalItems: number;
        totalPrice: number;
        deliveryDeadline: string;
        orderCode: string;
        button: string;
    };
};


const AwaitingpickupItem: React.FC<AwaitingPickupProps> = ({ orderPickup }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }} />
                <Text style={styles.status}>{orderPickup.status}</Text>
            </View>
            {/* Product Row */}
            <View style={styles.productRow}>
                <Image source={{ uri: orderPickup.product.image }} style={styles.productImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.productName}>{orderPickup.product.name}</Text>
                    <View style={styles.variantRow}>
                        <Text style={styles.variant}>{orderPickup.product.variant}</Text>
                        <Text style={styles.quantity}>x{orderPickup.product.quantity}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.price}>đ{formatPrice(orderPickup.product.price)}</Text>
                    </View>

                </View>
            </View>
            {/* Tổng tiền */}
            <View style={styles.totalRow}>
                <Text style={styles.totalItems}>{orderPickup.totalItems} sản phẩm</Text>
                <View style={styles.totalRight}>
                    <Text style={styles.totalLabel}>Tổng Thanh toán:</Text>
                    <Text style={styles.totalPrice}>đ{formatPrice(orderPickup.totalPrice)}</Text>
                </View>
            </View>
            {/* Giao hàng trước + Button */}
            <View style={styles.deliveryRow}>
                <Text style={styles.deliveryText}>Giao hàng trước {orderPickup.deliveryDeadline} để đơn không bị huỷ.</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{orderPickup.button}</Text>
                </TouchableOpacity>
            </View>
            {/* Mã đơn hàng */}
            <View style={styles.codeRow}>
                <Text style={styles.codeLabel}>Mã đơn hàng</Text>
                <Text style={styles.codeValue}>{orderPickup.orderCode}</Text>
            </View>
        </View>
    )
}

export default AwaitingpickupItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 10,
        marginVertical: 10,
        padding: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    status: {
        color: colors.orange.dark,
        fontWeight: 'bold',
        fontSize: 15,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    productName: {
        fontWeight: 'bold',
        color: colors.black,
        fontSize: 15,
        marginBottom: 2,
    },
    variantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    variant: {
        color: colors.grey[600],
        fontSize: 14,
        marginRight: 8,
    },
    quantity: {
        color: colors.grey[600],
        fontSize: 14,
    },
    price: {
        color: colors.black,
        fontWeight: '500',
        fontSize: 14,
        marginTop: 2,
    },
    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 8,
        marginBottom: 8,
    },
    totalItems: {
        color: colors.grey[700],
        fontSize: 14,
    },
    totalRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        color: colors.grey[500],
        fontSize: 14,
        marginRight: 4,
    },
    totalPrice: {
        color: colors.orange.dark,
        fontWeight: 'bold',
        fontSize: 15,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    deliveryText: {
        color: colors.grey[500],
        fontSize: 13,
        flex: 1,
    },
    button: {
        backgroundColor: colors.app.primary.main,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 18,
        marginLeft: 8,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 15,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 8,
    },
    codeLabel: {
        color: colors.grey[500],
        fontSize: 14,
    },
    codeValue: {
        color: colors.black,
        fontSize: 14,
        fontWeight: '500',
    },
})