
export type VoucherRespondDto = {
  _id: string;

  code: string;

  description: string;

  discount_type: DiscountType;

  discount_value: number;

  max_discount?: number;

  min_order_value: number;

  max_order_value?: number;

  start_date: Date;

  end_date: Date;

  quantity: number;

  used: number;

  is_active: boolean;

  apply_type: VoucherApplyType;

  product_ids?: string[];

  is_collected:boolean;

  is_used:boolean;

  is_expired:boolean;

  status?: 'not_collected' | 'collected_unused' | 'collected_used' | 'expired_unused';
  max_use_per_user?:number,
  used_at?:Date
  usage_id?:string
}

export type VoucherQueryDto = {
  status?: 'not_collected' | 'collected_unused' | 'collected_used' | 'expired_unused';

  page?: number ;

  limit?: number;
} 

export enum DiscountType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

export enum VoucherApplyType {
  ORDER = 'order',
  PRODUCT = 'product',
  DELIVERY = 'delivery'
}

export interface VoucherAvailableRes {
  _id: string; 
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed'; 
  discount_value: number;
  max_discount?: number; 
  min_order_value: number;
}