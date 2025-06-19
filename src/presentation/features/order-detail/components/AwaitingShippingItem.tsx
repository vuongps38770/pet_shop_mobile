import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { colors } from 'shared/theme/colors';
import { Typography } from 'shared/components/Typography';
import { PriceFormatter } from 'app/utils/priceFormatter';

export type AwaitingShippingOrder = {
    _id: string;
    createdAt: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    status: string;
    image: string;
};

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;
};

export interface AwaitingShippingItemProps {
    order: AwaitingShippingOrder;
    onContactSeller?: (order: AwaitingShippingOrder) => void;
    onPress?: (order: AwaitingShippingOrder) => void;
}


const AwaitingShippingItem: React.FC<AwaitingShippingItemProps> = ({ order, onContactSeller, onPress }) => {
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
                {/* <Typography variant="caption" color="textSecondary">{order.date}</Typography> */}
                <Text style={styles.date}>
                    {order.createdAt ? formatDateTime(order.createdAt) : ''}
                </Text>
            </View>

            {/* Content */}
            <TouchableOpacity style={styles.content} activeOpacity={0.8} onPress={() => onPress?.(order)}>
                <Image source={{ uri: order.image }} style={styles.image} />
                <View style={styles.details}>
                    <Typography variant="body1" bold numberOfLines={1} style={styles.productName}>
                        {order.productName}
                    </Typography>


                    <Typography variant="caption" color="primary" style={styles.status}>
                        {order.status}
                    </Typography>
                </View>
            </TouchableOpacity>
            <View style={styles.secondaryContainer}>
                <Text style={styles.description}>x{order.quantity} sản phẩm</Text>
                <Text style={styles.price}>{PriceFormatter.formatPrice(order.totalPrice)}</Text>
            </View>

            {/* Contact Seller Button */}
            {/* <TouchableOpacity onPress={() => onContactSeller?.(order)}>
        <Typography variant="caption" color="primary" style={styles.contact}>
          Liên hệ với người bán
        </Typography>
      </TouchableOpacity> */}

        </View>
    );
};

export default AwaitingShippingItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        elevation: 3,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,

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
        backgroundColor: colors.blue.main,
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
    description: {
        marginBottom: 2,
        fontSize: 12
    },
    status: {
        marginTop: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    contact: {
        marginTop: 10,
        textAlign: 'right'
    },
    secondaryContainer: {
        paddingTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    }
});