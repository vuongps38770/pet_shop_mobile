export interface UnitValueDTO {
  _id: string;
  unitName: string;
}

export interface VariantDTO {
  _id: string;
  sku: string;
  stock: number;
  importPrice: number;
  sellingPrice: number;
  promotionalPrice: number;
  unitValues: UnitValueDTO[];
}

export interface CategoryDTO {
  _id: string;
  name: string;
  parentId: string;
  isRoot: boolean;
}

export interface DescriptionDTO {
  title: string;
  content: string;
}

export interface UnitDTO {
  _id: string;
  unitName: string;
}

export interface VariantGroupDTO {
  _id: string;
  groupName: string;
  units: UnitDTO[];
}

export interface SupplierDTO {
  _id: string;
  name: string;
}

export interface ProductDetailRespondDTO {
  _id: string;
  name: string;
  isActivate: boolean;
  images: string[];
  supplier: SupplierDTO;
  maxPromotionalPrice: number;
  maxSellingPrice: number;
  minPromotionalPrice: number;
  minSellingPrice: number;
  categories: CategoryDTO[];
  descriptions: DescriptionDTO[];
  variants: VariantDTO[];
  variantGroups: VariantGroupDTO[];
}

