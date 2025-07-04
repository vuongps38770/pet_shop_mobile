import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from 'theme/colors'
import { PriceFormatter } from 'app/utils/priceFormatter'

type AwaitingConfirmationItemProps = {
    orderss: {
        sku: string,
        name: string,
        productCount: number,
        totalPrice: number,
        image: string,
        attributes?: string,
        createdAt?: string,
    },
    onCancel?: () => void,
    statusLabel?: string,
    onPress?: () => void,
}

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;
};

const AwaitingConfirmationItem: React.FC<AwaitingConfirmationItemProps> = ({ orderss, onCancel, statusLabel, onPress }) => {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
        <Wrapper style={styles.container} onPress={onPress} activeOpacity={onPress ? 0.85 : undefined}>
            <View style={styles.headerRow}>
                <View style={styles.dot} />
                <Text style={styles.orderType}>DH:</Text>
                <Text style={styles.orderId}>#{orderss.sku}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.date}>
                    {orderss.createdAt ? formatDateTime(orderss.createdAt) : ''}
                </Text>
            </View>
            <View style={styles.itemRow}>
                <Image source={{ uri: orderss.image }} style={styles.productImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.productName}>{orderss.name}</Text>
                    <Text style={styles.productAttr}>
                        {orderss.attributes}, {orderss.productCount} × Mục
                    </Text>
                </View>
            </View>
            <View style={styles.statusRow}>
                <Text style={styles.statusText}>{statusLabel || 'Đang chờ xác nhận'}</Text>
                <Text style={styles.price}>{PriceFormatter.formatPrice(orderss.totalPrice)}</Text>
            </View>
            {onCancel && (
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                    <Text style={styles.cancelBtnText}>Huỷ đơn hàng</Text>
                </TouchableOpacity>
            )}
        </Wrapper>
    )
}

export default AwaitingConfirmationItem

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
        color: colors.blue.dark,
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
    cancelBtn: {
        backgroundColor: '#FF4D4F',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    cancelBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
})