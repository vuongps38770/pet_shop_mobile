
export type RatingItemResDto = {
    _id: string;
    disLikeList: string[];
    likeList: string[];
    user_id: {
        _id: string;
        name: string;
        avatar: string;
    };
    productId: string
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    isLiked: boolean;
    isDisliked: boolean;
    isMine: boolean
}
export type RatingResDto = {
    product: {
        _id: string,
        name: string,
        images: string[]
    },
    items:RatingItemResDto[],
    isBought:boolean
}
