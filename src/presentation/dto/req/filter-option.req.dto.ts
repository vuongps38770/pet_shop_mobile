export interface FilterOptions {
  search?: string,
  limit?: number,
  page?: number,
  sortBy?: "minPromotionalPrice" | "maxPromotionalPrice" | "createdDate"
  order?: "asc" | "desc"
  categoryId?:string,
  supplierId?:string,
  rootCategoryId?:string
} 