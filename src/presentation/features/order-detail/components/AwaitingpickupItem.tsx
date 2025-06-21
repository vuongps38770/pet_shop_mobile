import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from 'theme/colors'
import { PriceFormatter } from 'app/utils/priceFormatter'
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto'
import { formatDateTimeVN } from 'app/utils/time'

type AwaitingPickupItemProps = {
    order: OrderRespondDto;
    onPress?: () => void;
    onContactSeller?: () => void;
}

const AwaitingpickupItem: React.FC<AwaitingPickupItemProps> = ({ order, onPress, onContactSeller }) => {
    const firstItem = order.orderDetailItems[0];
    const name = firstItem?.productName || '';
    const image = firstItem?.image || '';
    const productCount = order.orderDetailItems.length;
    const attributes = firstItem?.variantName || '';
    const createdAt = order.createdAt;

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'SHIPPED':
                return 'Đã giao cho vận chuyển';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PROCESSING':
                return colors.orange.dark;
            case 'SHIPPED':
                return colors.blue.dark;
            default:
                return colors.grey[500];
        }
    };

    const Wrapper = onPress ? TouchableOpacity : View;
    
    return (
        <Wrapper style={styles.container} onPress={onPress} activeOpacity={onPress ? 0.85 : undefined}>
            <View style={styles.headerRow}>
                <View style={styles.dot} />
                <Text style={styles.orderType}>ĐẶT HÀNG</Text>
                <Text style={styles.orderId}>#{order.sku}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.date}>
                    {formatDateTimeVN(createdAt)}
                </Text>
            </View>
            <View style={styles.itemRow}>
                <Image source={{ uri: image }} style={styles.productImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.productName}>{name}</Text>
                    <Text style={styles.productAttr}>
                        {attributes}, {productCount} × Mục
                    </Text>
                </View>
            </View>
            <View style={styles.statusRow}>
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                </Text>
                <Text style={styles.price}>{PriceFormatter.formatPrice(order.totalPrice)}</Text>
            </View>
            {onContactSeller && (
                <TouchableOpacity style={styles.contactBtn} onPress={onContactSeller}>
                    <Text style={styles.contactBtnText}>Liên hệ người bán</Text>
                </TouchableOpacity>
            )}
        </Wrapper>
    )
}

export default AwaitingpickupItem

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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.app.primary.main,
        marginRight: 6,
    },
    orderType: {
        color: colors.grey[500],
        fontWeight: 'bold',
        fontSize: 13,
        marginRight: 4,
    },
    orderId: {
        color: colors.grey[500],
        fontSize: 13,
        fontWeight: '500',
        marginRight: 8,
    },
    date: {
        color: colors.grey[500],
        fontSize: 13,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 2,
    },
    productAttr: {
        color: colors.grey[700],
        fontSize: 14,
        marginBottom: 2,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        maxWidth: '60%',
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'right',
    },
    contactBtn: {
        backgroundColor: colors.app.primary.main,
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    contactBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
})