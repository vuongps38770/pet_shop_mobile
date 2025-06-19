export interface OrderItemDTO{
    id: string;
    quantity: number;
    promotionalPrice: number;
}
  
export interface OrderrespondDTO{
    method: 'vnpay' | 'momo';
    items: OrderItemDTO[];
    subtotal: number;
    tax: number;
    delivery: number;
    total: number;
  }