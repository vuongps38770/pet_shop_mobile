import { PaymentType } from "src/presentation/dto/res/order-respond.dto";
import { assets } from "shared/theme/assets";
 
export const PAYMENT_METHODS = [
  { key: PaymentType.ZALOPAY, title: "ZaloPay", icon: assets.icons.orderScreen.momo },
  { key: PaymentType.VNPAY, title: "VNPay", icon: assets.icons.orderScreen.vnpay },
  { key: PaymentType.MOMO, title: "MoMo", icon: assets.icons.orderScreen.momo },
] as const; 