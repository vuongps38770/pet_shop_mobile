import { OrderStatus } from "app/types/OrderStatus";
import { PaymentType } from "../res/order-respond.dto";

export type OrderCreateReqDto = {
    shippingAddressId: string;
    orderItems: OrderReqItem[];
    voucherCode?: string;
    totalClientPrice?: number;
    paymentType: PaymentType;
    cartIds?:string[]
}

export type OrderReqItem = {
    variantId: string;
    quantity: number;
}

export type OrderListReqDto = {
    statuses?: OrderStatus[];
    page?: number;
    limit?: number ;
    sortBy?: 'createdDate' | 'totalPrice' ;
    sortOrder?: 'asc' | 'desc'
}


export type CalculateOrderPriceReqDto = {
    orderItems: OrderReqItem[]
    shippingAddressId?: string;
    voucherCode?: string;
}


