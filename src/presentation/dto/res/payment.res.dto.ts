export type PaymentResDto = {
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
