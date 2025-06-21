import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from 'shared/theme/colors';
import { Typography } from 'shared/components/Typography';
import { PriceFormatter } from 'app/utils/priceFormatter';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';
import { formatDateTimeVN } from 'app/utils/time';

export interface CanceledItemProps {
    order: OrderRespondDto;
    onBuyAgain?: (order: OrderRespondDto) => void;
    onPress?: () => void;
}

const CanceledItem: React.FC<CanceledItemProps> = ({ order, onBuyAgain, onPress }) => {
    const firstItem = order.orderDetailItems[0];
    const name = firstItem?.productName || '';
    const image = firstItem?.image || '';
    const productCount = order.orderDetailItems.length;
    const attributes = firstItem?.variantName || '';
    const createdAt = order.createdAt;

    const Wrapper = onPress ? TouchableOpacity : View;

    return (
        <Wrapper style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.85 : undefined}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.dot} />
                    <Typography variant="caption" color="textSecondary" style={styles.orderId}>
                        ĐẶT HÀNG #{order.sku}
                    </Typography>
                </View>
                <Text style={styles.date}>
                    {formatDateTimeVN(createdAt)}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.details}>
                    <Typography variant="body1" bold numberOfLines={1} style={styles.productName}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="error" style={styles.canceledText}>
                        {/* TODO: Xác định ai hủy đơn hàng (người bán/khách hàng) dựa vào dữ liệu từ API */}
                        Đã hủy bởi người bán
                    </Typography>
                </View>
            </View>
            <View style={styles.secondaryContainer}>
                <Typography variant="caption" color="textSecondary" numberOfLines={1} style={styles.productDesc}>
                    {productCount} × Mặt hàng
                </Typography>
                <View style={styles.priceBlock}>
                    <Typography variant="h6" bold style={styles.price}>
                        {PriceFormatter.formatPrice(order.totalPrice)}
                    </Typography>
                </View>
            </View>

            {/* Footer */}
            {onBuyAgain && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.buyAgainBtn} onPress={() => onBuyAgain(order)}>
                        <Text style={styles.buyAgainText}>Mua lại</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Wrapper>
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
        backgroundColor: colors.red.main,
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
        color: colors.red.main,
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
    buyAgainBtn: {
        backgroundColor: colors.app.primary.main,
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    buyAgainText: {
        color: '#fff',
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