import { formatDateTimeVN } from 'app/utils/time';
import React, { useState } from 'react';
import { Modal, View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AppModal from 'shared/components/modals/AppModal';
import { OrderRespondDto } from 'src/presentation/dto/res/order-respond.dto';

const ORDER_STATUS_VI: Record<string, string> = {
    NEWORDER: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    WAIT_FOR_PAYMENT: 'Chờ thanh toán',
    PAYMENT_SUCCESSFUL: 'Đã thanh toán',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đã giao cho vận chuyển',
    DELIVERED: 'Đã giao hàng',
    RECEIVED: 'Đã nhận hàng',
    CANCELLED: 'Đã huỷ',
    RETURNED: 'Đã trả hàng',
    FAILED: 'Giao thất bại',
    REFUNDED: 'Đã hoàn tiền',
};

const STATUS_COLOR_MAP = {
    yellow: { bg: '#FFE5C2', text: '#FFAF42' },
    green: { bg: '#D1F5D3', text: '#4CAF50' },
    red: { bg: '#FFD6D6', text: '#FF4D4F' },
    blue: { bg: '#D6E8FF', text: '#2979FF' },
};

const OrderDetailModal = ({ visible, order, onClose, showCancelButton, onCancel, statusColorMode = 'yellow' }: {
    visible: boolean,
    order: OrderRespondDto | null,
    onClose: () => void,
    showCancelButton?: boolean,
    onCancel?: () => void,
    statusColorMode?: 'yellow' | 'green' | 'red' | 'blue',
}) => {

    const [confirmModal, setConfirmModal] = useState(false);
    if (!order) return null;
    const badgeColor = STATUS_COLOR_MAP[statusColorMode] || STATUS_COLOR_MAP.yellow;
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContentNew}>
                    <ScrollView>
                        <Text style={styles.modalTitleNew}>Chi tiết đơn hàng</Text>
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderId}>ORDER #{order.sku || ''}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: badgeColor.bg }]}>
                                <Text style={[styles.statusBadgeText, { color: badgeColor.text }]}>{ORDER_STATUS_VI[order.status] || order.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.orderDate}>Ngày đặt: {
                            formatDateTimeVN(order.createdAt)
                        }</Text>
                        <View style={styles.sectionDivider} />
                        <Text style={styles.sectionTitle}>Sản phẩm</Text>
                        {order.orderDetailItems?.map((item: any) => (
                            <View key={item._id} style={styles.productRow}>
                                <View style={styles.productImageBox}>
                                    <Image source={{ uri: item.image }} style={styles.productImage} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.productName}>{item.productName}</Text>
                                    <Text style={styles.productDesc}>{item.variantName}</Text>
                                    <Text style={styles.productQty}>sl: {item.quantity}</Text>
                                </View>
                                <Text style={styles.productPrice}>{item.promotionalPrice?.toLocaleString()}đ</Text>
                            </View>
                        ))}
                        <View style={styles.sectionDivider} />
                        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                        <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Giá sản phẩm</Text><Text style={styles.paymentValue}>{order.productPrice?.toLocaleString()}đ</Text></View>
                        <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Phí vận chuyển</Text><Text style={styles.paymentValue}>{order.shippingFree?.toLocaleString()}đ</Text></View>
                        <View style={styles.paymentRow}><Text style={styles.paymentLabel}>Giảm giá</Text><Text style={styles.paymentValue}>0đ</Text></View>
                        <View style={styles.paymentRow}><Text style={[styles.paymentLabel, { fontWeight: 'bold' }]}>Thành tiền</Text><Text style={[styles.paymentValue, { fontWeight: 'bold' }]}>{order.totalPrice?.toLocaleString()}đ</Text></View>
                        <View style={styles.actionRow}>
                            {showCancelButton && (
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmModal(true)}>
                                    <Text style={styles.cancelBtnText}>Huỷ đơn hàng</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.closeBtnNew} onPress={onClose}>
                                <Text style={styles.closeBtnTextNew}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <AppModal
                        visible={confirmModal}
                        title="Xác nhận huỷ đơn hàng"
                        content="Bạn có chắc muốn huỷ đơn hàng này không?"
                        onClose={() => setConfirmModal(false)}
                        onPositivePress={() => {
                            setConfirmModal(false);
                            onCancel && onCancel();
                        }}
                        positiveButtonText="Đồng ý"
                        onNegativePress={() => setConfirmModal(false)}
                        negativeButtonText="Huỷ bỏ"
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentNew: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '92%',
        maxHeight: '85%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitleNew: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    orderInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    orderId: {
        color: '#888',
        fontSize: 13,
    },
    statusBadge: {
        backgroundColor: '#FFE5C2',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    statusBadgeText: {
        color: '#FFAF42',
        fontWeight: 'bold',
        fontSize: 13,
    },
    orderDate: {
        color: '#888',
        fontSize: 13,
        marginBottom: 10,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    productImageBox: {
        width: 48,
        height: 48,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: 36,
        height: 36,
        borderRadius: 6,
        backgroundColor: '#eee',
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    productDesc: {
        color: '#888',
        fontSize: 13,
    },
    productQty: {
        color: '#888',
        fontSize: 13,
    },
    productPrice: {
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    paymentLabel: {
        color: '#888',
        fontSize: 15,
    },
    paymentValue: {
        fontSize: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 18,
        gap: 12,
    },
    cancelBtn: {
        backgroundColor: '#FF4D4F',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        alignSelf: 'flex-end',
    },
    cancelBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    closeBtnNew: {
        backgroundColor: '#eee',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        alignSelf: 'flex-end',
    },
    closeBtnTextNew: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default OrderDetailModal; 