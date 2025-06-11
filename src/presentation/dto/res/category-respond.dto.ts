

export interface CategoryRespondDto {
    _id: string
    name: string;
    parentId?: string
    categoryType?: 'DOG' | 'CAT'
    isRoot?: boolean;
    children: CategoryRespondDto[];
}