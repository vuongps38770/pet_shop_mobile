import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { PriceFormatter } from 'app/utils/priceFormatter';
import { colors } from 'theme/colors';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';
import { formatDateTimeVN } from 'app/utils/time';
import { useDispatch } from 'react-redux';
import { handlePayment, checkOrder } from '../slices/waitForPayment.slice';
import { useToast } from 'shared/components/CustomToast';
import { AppDispatch } from 'src/presentation/store/store';

interface WaitForPaymentItemProps {
    order: OrderRespondDto;
    onItemPress?: () => void;
    onCancelPress?: () => void;
    onSetPaymentId?: (paymentId: string) => void;
}

const formatCountdown = (expiredAt?: Date) => {
    if (!expiredAt) return '--:--:--';
    const now = new Date().getTime();
    const expire = new Date(expiredAt).getTime();
    let diff = Math.max(0, Math.floor((expire - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

//giờ phút 
const formatDateTime = (isoString?: Date) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;
};

const WaitForPaymentItem: React.FC<WaitForPaymentItemProps> = ({ order, onItemPress, onCancelPress, onSetPaymentId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast();
    const firstItem = order.orderDetailItems[0];
    const name = firstItem?.productName || '';
    const image = firstItem?.image || '';
    const productCount = order.orderDetailItems.length;
    const attributes = firstItem?.variantName || '';
    const expiredAt = order.expiredDate;
    const createdAt = order.createdAt;
    const [countdown, setCountdown] = useState(formatCountdown(expiredAt));

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(formatCountdown(expiredAt));
        }, 1000);
        return () => clearInterval(timer);
    }, [expiredAt]);

    // Logic thanh toán cho từng item
    const handlePay = async () => {
        if (order.expiredDate && new Date(order.expiredDate).getTime() < Date.now()) {
            toast.show('error', 'Đơn hàng đã hết hạn thanh toán, vui lòng đặt lại đơn mới.');
            if ((order as any).paymentId) {
                await (dispatch as any)(checkOrder((order as any).paymentId));
            }
            return;
        }
        const res: any = await (dispatch as any)(handlePayment({ orderId: order._id, paymentType: order.paymentType }));
        if (res.meta.requestStatus === 'fulfilled' && res.payload.success) {
            toast.show('info', 'Đang mở ZaloPay...');
            if (res.payload.paymentId && onSetPaymentId) onSetPaymentId(res.payload.paymentId);
        } else {
            toast.show('error', res.payload?.message || 'Có lỗi xảy ra khi thanh toán');
        }
    };
    const isExpired = useMemo(() => {
        return order?.expiredDate ? new Date(order.expiredDate).getTime() <= Date.now() : false;
    }, [order?.expiredDate]);
    return (
        <TouchableOpacity style={styles.container} onPress={onItemPress} activeOpacity={0.85}>
            <View style={styles.headerRow}>
                <View style={styles.dot} />
                <Text style={styles.orderId}>DH: {order.sku}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.date}>
                    {formatDateTimeVN(order.createdAt)}
                </Text>
            </View>
            <View style={styles.itemcontainer}>
                <Image source={{ uri: image }} style={styles.productImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.productName}>{name}</Text>
                    <Text style={styles.productAttr}>{attributes}</Text>
                    <Text style={styles.countdown}>Thời hạn thanh toán còn lại <Text style={{ color: '#2979FF' }}>{countdown}</Text></Text>
                </View>
            </View>
            <View style={styles.itembox}>
                <Text>x{productCount} Sản Phẩm</Text>
                <Text style={styles.price}>{PriceFormatter.formatPrice(order.totalPrice)}</Text>
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity onPress={onCancelPress}>
                    <Text style={styles.cancelText}>Cancel Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.payNowBtn} onPress={handlePay} disabled={isExpired}>
                    <Text style={styles.payNowText}>Thanh Toán Ngay</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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