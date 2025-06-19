import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from 'shared/theme/colors';
import { Typography } from 'shared/components/Typography';
import { PriceFormatter } from 'app/utils/priceFormatter';

export type DeliveredOrder = {
    _id: string;
    createdAt: string;
    productName: string;
    productDesc: string;
    quantity: number;
    totalPrice: number;
    image: string;
    deliveredDate: string;

};

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;
};
export interface DeliveredItemProps {
    order: DeliveredOrder;
    onBuyAgain?: (order: DeliveredOrder) => void;
    onWriteReview?: (order: DeliveredOrder) => void;
}

const DeliveredItem: React.FC<DeliveredItemProps> = ({ order, onBuyAgain, onWriteReview }) => {
    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.dot} />
                    <Typography variant="caption" color="textSecondary" style={styles.orderId}>
                        ĐẶT HÀNG #{order._id}
                    </Typography>
                </View>
                {/* <Typography variant="caption" color="textSecondary">Ngày {order.date}</Typography> */}
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

                    <Typography variant="caption" color="success" style={styles.deliveredText}>
                        Đã giao ngày {order.deliveredDate}
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
                    <Typography variant="body2" color="textSecondary">Mua lại</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewBtn} onPress={() => onWriteReview?.(order)}>
                    <Typography variant="body2" bold style={styles.reviewText}>Viết Đánh giá</Typography>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DeliveredItem;

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
        backgroundColor: colors.green.main,
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
    deliveredText: {
        marginTop: 2,
        color: colors.green.main,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.grey[200],
        marginTop: 10,
        paddingTop: 8,
    },
    reviewBtn: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: colors.app.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    reviewText: {
        color: colors.white,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    secondaryContainer: {
        paddingTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    }
});