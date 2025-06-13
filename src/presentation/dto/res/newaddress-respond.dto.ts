export interface LocationDTO {
    code: number;
    name: string;
};


export interface NewAddressRespondDTO {
    fullName: string;
    phoneNumber: string;
    houseNumber: string;
    province: LocationDTO;
    district: LocationDTO;
    ward: LocationDTO;
}