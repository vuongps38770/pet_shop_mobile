
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



    paymentType: PaymentType;
    status: string;
    expiredDate?: Date;
    orderDetailItems: OrderDetailResDto[];
    shippingFree: number
    productPrice: number
    totalPrice: number;
    createdDate: Date;
    sku:string
}


export type OrderDetailResDto = {
    _id: string;
    productId: string;
    variantId?: string;
    productName: string;
    variantName?: string;
    image?: string;
    quantity: number;
    sellingPrice: number;
    promotionalPrice?: number;
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
    productTotal:number,
    discount:number,
    shippingFee:number,
    finalTotal:number,
}