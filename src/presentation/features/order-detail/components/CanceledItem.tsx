import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from 'shared/theme/colors';
import { Typography } from 'shared/components/Typography';
import { PriceFormatter } from 'app/utils/priceFormatter';

export type CanceledOrder = {
    _id: string;
    createdAt: string;
    productName: string;
    productDesc: string;
    quantity: number;
    totalPrice: number;
    image: string;
    canceledDate: string;
};

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;
};

export interface CanceledItemProps {
    order: CanceledOrder;
    onBuyAgain?: (order: CanceledOrder) => void;
}

const CanceledItem: React.FC<CanceledItemProps> = ({ order, onBuyAgain }) => {
    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.dot} />
                    <Typography variant="caption" color="textSecondary" style={styles.orderId}>
                        ORDER #{order._id}
                    </Typography>
                </View>
                <Text style={styles.date}>
                    {order.createdAt ? formatDateTime(order.createdAt) : ''}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Image source={{ uri: order.image }} style={styles.image} />
                <View style={styles.details}>
                    <Typography variant="body1" bold numberOfLines={1} style={styles.productName}>
                        {order.productName}
                    </Typography>
                    <Typography variant="caption" color="error" style={styles.canceledText}>
                        Đã hủy bởi người bán
                    </Typography>
                </View>
            </View>
            <View style={styles.secondaryContainer}>
                <Typography variant="caption" color="textSecondary" numberOfLines={1} style={styles.productDesc}>
                    {order.quantity} × Mặt hàng
                </Typography>
                <View style={styles.priceBlock}>
                    <Typography variant="h6" bold style={styles.price}>
                        {PriceFormatter.formatPrice(order.totalPrice)}
                    </Typography>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => onBuyAgain?.(order)}>
                    <Typography variant="body2" color="primary">Mua lại</Typography>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CanceledItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.grey[100],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
        marginRight: 6,
    },
    orderId: {
        fontWeight: 'bold',
    },
    date: {
        color: colors.grey[500],
        fontSize: 13,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 56,
        height: 56,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: colors.grey[200],
    },
    details: {
        flex: 1,
        minWidth: 0,
    },
    productName: {
        marginBottom: 2,
    },
    productDesc: {
        marginBottom: 2,
    },
    canceledText: {
        marginTop: 2,
        color: colors.error,
    },
    priceBlock: {
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.grey[200],
        marginTop: 10,
        paddingTop: 8,
    },
    secondaryContainer: {
        paddingTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});