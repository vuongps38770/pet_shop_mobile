import { CategoryRespondDto } from "./category-respond.dto"



export interface ProductRespondDto {
    _id: string
    name: string
    isActivate: boolean
    categories: CategoryRespondDto[]
    supplier: {
        _id: string,
        name: string,

    }
    descriptions: ProductDescriptionRespondDto[]
    variantGroups: VariantGroupRespondDto[]
    variants: VariantRespondDto[]
    images: string[]
    minPromotionalPrice: number
    maxPromotionalPrice: number
    minSellingPrice: number
    maxSellingPrice: number
}

export interface VariantGroupRespondDto {
    _id: string
    groupName: string
    units: VariantUnitRespondDto[]
}
export interface VariantUnitRespondDto {
    _id: string

    unitName: string
}
export interface VariantRespondDto {
    _id: string
    sku: string
    stock: number
    unitValues: VariantUnitRespondDto[]
    importPrice: number
    sellingPrice: number
    promotionalPrice: number
}

export interface ProductDescriptionRespondDto {

    title: string

    content: string

    index: number
}



export interface ProductRespondSimplizeDto {
    _id: string
    name: string
    images: string[]
    minPromotionalPrice: number
    maxPromotionalPrice: number
    minSellingPrice: number
    maxSellingPrice: number
    rating: {
        average:number,
        total:number
    }
}


export interface ProductSuggestionDto {
    _id: string
    name: string
    images: string[]
}

export enum SuggestionType {
    PERSONALIZED = 'personalized',
    POPULAR = 'popular',
}
