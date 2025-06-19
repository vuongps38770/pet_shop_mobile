import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blue } from 'react-native-reanimated/lib/typescript/Colors'
import { Typography } from 'shared/components/Typography';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { colors } from 'theme/colors';

type WaitForPaymentItemProps = {
    order: {
        _id: string,
        name: string,
        productCount: number,
        totalPrice: number,
        expiredAt: string, // ISO string
        image: string,
        attributes?: string, // VD: "Black, GPS + Cellular"
        createdAt?: string, // ISO string
    }
}

const formatCountdown = (expiredAt: string) => {
    const now = new Date().getTime();
    const expire = new Date(expiredAt).getTime();
    let diff = Math.max(0, Math.floor((expire - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

//giờ phút 
const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;
};


const WaitForPaymentItem: React.FC<WaitForPaymentItemProps> = ({ order }) => {
    const [countdown, setCountdown] = useState(formatCountdown(order.expiredAt));

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(formatCountdown(order.expiredAt));
        }, 1000);
        return () => clearInterval(timer);
    }, [order.expiredAt]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.dot} />
                <Text style={styles.orderId}>ORDER #{order._id}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.date}>
                    {order.createdAt ? formatDateTime(order.createdAt) : ''}
                </Text>

            </View>
            <View style={styles.itemcontainer}>
                <Image source={{ uri: order.image }} style={styles.productImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.productName}>{order.name}</Text>
                    <Text style={styles.productAttr}>{order.attributes}</Text>
                    <Text style={styles.countdown}>Thời hạn thanh toán còn lại <Text style={{ color: '#2979FF' }}>{countdown}</Text></Text>
                </View>
            </View>
            <View style={styles.itembox}>
                <Text>x{order.productCount} Sản Phẩm</Text>
                <Text style={styles.price}>{PriceFormatter.formatPrice(order.totalPrice)}</Text>
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity>
                    <Text style={styles.cancelText}>Cancel Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.payNowBtn}>
                    <Text style={styles.payNowText}>Thanh Toán Ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default WaitForPaymentItem

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.white,
        marginTop: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    orderId: {
        color: colors.grey[500],
        fontSize: 13,
        fontWeight: '500',
    },
    date: {
        color: colors.grey[500],
        fontSize: 13,
    },
    itemcontainer: {
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    productAttr: {
        color: '#555',
        fontSize: 14,
        marginBottom: 2,
    },
    countdown: {
        color: '#888',
        fontSize: 13,
        marginBottom: 2,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    cancelText: {
        color: '#888',
        fontSize: 15,
    },
    payNowBtn: {
        backgroundColor: colors.app.primary.main,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    payNowText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 15,
    },
    itembox: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.app.primary.main,
        marginRight: 6,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
})