

export interface CategoryRespondDto {
    _id: string
    name: string;
    parentId?: string
    children: CategoryRespondDto[];
    icon?:string
}