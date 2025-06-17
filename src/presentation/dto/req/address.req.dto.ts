export interface AddressReqDto {
  province: string;
  district: string;
  ward: string;
  streetAndNumber: string;
  lat?: number;
  lng?: number;
  receiverFullname:string
}

