
export type OrderRespondDto = {
    _id: string;
    userID: string;
    voucherID?: string;
    shippingAddress: {
        refId: string;
        province: string;
        district: string;
        ward: string;
        streetAndNumber: string;
        lat?: number;
        lng?: number;
        receiverFullname: string;
    };



    paymentType: string;
    status: string;
    expiredDate?: Date;
    orderDetailItems: OrderDetailResDto[];
    shippingFree: number
    productPrice: number
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    sku: string
}


export type OrderDetailResDto = {
    _id: string;
    productId: string;
    variantId?: string;
    productName: string;
    variantName?: string;
    image: string;
    quantity: number;
    sellingPrice: number;
    promotionalPrice: number;
}


export type OrderListResDto = {
    total: number;
    page: number;
    limit: number;
    data: OrderRespondDto[];
    hasNext: boolean;
    hasPrevious: boolean;
}
export enum PaymentType {
    COD = 'COD',              // Thanh toán khi nhận hàng
    MOMO = 'MOMO',            // Thanh toán qua Momo
    VNPAY = 'VNPAY',         // Thanh toán qua VNPay
    ZALOPAY = 'ZALOPAY'      // Thanh toán qua ZaloPay
}


export type CalculateOrderPriceResDto = {
    productTotal: number,
    discount: number,
    shippingFee: number,
    finalTotal: number,
}

export type OrderCheckoutResDto = {
    orderId: string,
    paymentMethod: string,
    payment?: PaymentResDto
}

export type PaymentResDto = {
    gateway_code: string
    transactionId: string,
    _id: string
}
export type PaymentAllResDto = {
    code: number,
    payment: {
        _id: string;
        orderId: string;
        paymentPurpose: 'PAY' | 'REFUND';
        provider: 'ZALOPAY';
        gateway_code: string;
        transactionId: string;
        amount: number;
        status: 'PENDING' | 'SUCCESS' | 'FAILED';
        expiredAt: string;
        createdAt: string;
        updatedAt: string;
    }
}

export type PaymentStatusResDto = {
    return_code: number,

}
