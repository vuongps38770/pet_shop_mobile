export interface CartRespondDto {
    _id:string
    productVariantId: string
    quantity: number
    isOutOfStock:boolean
    isActivate:boolean
    images:string[]
    promotionalPrice:number
    sellingPrice:number
    productName:string
    product_id:string
    groups:{
        _id:string
        name:string
        unit:{
            _id:string
            name:string
        }
    }[]
    createdAt: Date
    updatedAt: Date
}
