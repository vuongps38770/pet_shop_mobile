import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from 'shared/theme/colors';
import { Typography } from 'shared/components/Typography';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';
import { formatDateTimeVN } from 'app/utils/time';
import { OrderStatus } from 'app/types/OrderStatus';

export interface DeliveredItemProps {
    order: OrderRespondDto;
    onPress?: () => void;
    onConfirmReceived?: (orderId: string) => void;
    onReview?: (orderId: string) => void;
}

const DeliveredItem: React.FC<DeliveredItemProps> = ({ 
    order, 
    onPress, 
    onConfirmReceived, 
    onReview 
}) => {
    const firstItem = order.orderDetailItems[0];
    const name = firstItem?.productName || '';
    const image = firstItem?.image || '';
    const productCount = order.orderDetailItems.length;
    const variantName = firstItem?.variantName || '';
    const quantity = firstItem?.quantity || 0;
    const sellingPrice = firstItem?.sellingPrice || 0;
    const totalPrice = order.totalPrice || 0;
    const status = order.status;
    const createdAt = order.createdAt;

    const isDelivered = status === OrderStatus.DELIVERED;
    const isReceived = status === OrderStatus.RECEIVED;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.header}>
                <View style={styles.orderInfo}>
                    <Typography variant="body2" color="textPrimary">
                        DH: {order.sku}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {formatDateTimeVN(createdAt)}
                    </Typography>
                </View>
                <View style={[
                    styles.statusTag,
                    { backgroundColor: isDelivered ? colors.warning : colors.success }
                ]}>
                    <Text style={[styles.statusText, { color: colors.white }]}>
                        {isDelivered ? 'Đã giao hàng' : 'Đã nhận hàng'}
                    </Text>
                </View>
            </View>

            <View style={styles.productInfo}>
                <Image source={{ uri: image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Typography variant="body1" color="textPrimary" numberOfLines={2}>
                        {name}
                    </Typography>
                    {variantName && (
                        <Typography variant="caption" color="textSecondary">
                            {variantName}
                        </Typography>
                    )}
                    <Typography variant="body2" color="textPrimary">
                        Số lượng: {quantity}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        {PriceFormatter.formatPrice(sellingPrice)}
                    </Typography>
                </View>
            </View>

            {productCount > 1 && (
                <View style={styles.moreProducts}>
                    <Typography variant="caption" color="textSecondary">
                        Và {productCount - 1} sản phẩm khác
                    </Typography>
                </View>
            )}

            <View style={styles.footer}>
                <View style={styles.totalInfo}>
                    <Typography variant="body1" color="textPrimary">
                        Tổng cộng:
                    </Typography>
                    <Typography variant="body1" color="primary" style={styles.totalPrice}>
                        {PriceFormatter.formatPrice(totalPrice)}
                    </Typography>
                </View>

                <View style={styles.buttonContainer}>
                    {isDelivered && (
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => onConfirmReceived?.(order._id)}
                        >
                            <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>
                                Xác nhận đã nhận
                            </Text>
                        </TouchableOpacity>
                    )}
                    
                    {isReceived && (
                        <TouchableOpacity
                            style={[styles.button, styles.reviewButton]}
                            onPress={() => onReview?.(order._id)}
                        >
                            <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>
                                Đánh giá
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontWeight: '600',
    },
    productInfo: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    moreProducts: {
        marginBottom: 12,
        paddingLeft: 72,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    totalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalPrice: {
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 8,
    },
    confirmButton: {
        backgroundColor: colors.app.primary.main,
    },
    reviewButton: {
        backgroundColor: colors.success,
    },
});

export default DeliveredItem;