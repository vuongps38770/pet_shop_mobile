export type VoucherStatus = "available" | "used" | "saved" | "expired";


export interface Voucher {
  id: string;
  title: string;
  discount: string;
  condition: string;
  expiry: string;
  type: "discount" | "freeship";
  status: VoucherStatus;
}
