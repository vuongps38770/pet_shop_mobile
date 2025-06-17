export type AddressSuggestionRespondDto={
    display_name:string,
    lat:string,
    lon:string,
    place_id:string
}


export interface AddressResDto {
    _id:string
    userId: string;
    province: string;
    district: string;
    ward: string;
    streetAndNumber: string;
    lat: number;
    lng: number;
    receiverFullname: string;
    createdDate: Date;
    isDefault: boolean;
  }