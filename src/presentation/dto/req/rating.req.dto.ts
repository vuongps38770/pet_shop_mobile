export type CreateRatingDto = {
    productId: string;
    rating: number;
    comment?: string;
}

export type UpdateRatingDto = {
    rating?: number;
    comment?: string;
}
export enum ReviewQueryType {
  LATEST = 'latest',
  POPULAR = 'popular',
  MY = 'my'
}

export type GetProductReviewsQuery = {
  productId: string;
  type: ReviewQueryType;
  page?: number;
  limit?: number;
}