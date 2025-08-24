export interface ProductPaginationRespondDto<T> extends BasePaginationRespondDto<T>{
    data?: T[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
}

export interface BasePaginationRespondDto<T> {
    data?: T[];
    total?: number;
    page?: number;
    totalPages?: number;
}