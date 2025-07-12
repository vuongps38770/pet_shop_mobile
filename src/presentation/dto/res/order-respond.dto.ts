
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
    sku: string;
    latestLog?:{
        action:OrderAction,
        performed_by:'ADMIN' | 'USER' |'SYSTEM'
    }
}


export type OrderDetailResDto = {
    _id: string;
    productId: string;
    variantId: string;
    productName: string;
    variantName?: string;
    image: string;
    quantity: number;
    sellingPrice: number;
    promotionalPrice: number;
}
export enum OrderAction {
  CANCEL_ORDER = "CANCEL_ORDER",
  CREATE_ORDER = "CREATE_ORDER",
  CONFIRM_ORDER = "CONFIRM_ORDER",
  SHIPPING_ORDER = "SHIPPING_ORDER",
  CONFIRM_PAYMENT ="CONFIRM_PAYMENT",
  COMPLETE_ORDER = "COMPLETE_ORDER",
  RETURN_ORDER = "RETURN_ORDER",
  REFUND_ORDER = "REFUND_ORDER"
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
    items:GroupedProductSummary[]
}

export interface VariantSummary {
  _id: string;
  name: string;
  promotionalPrice: number;
  quantity: number;
}

export interface GroupedProductSummary {
  _id: string;
  productName: string;
  images: string[];
  variants: VariantSummary[];
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
