export interface RatingUserDto {
  name: string;
  avatar: string;
}

export interface RatingRespondDto {
  _id: string;
  rating: number;
  comment: string;
  likeCount: number;
  user: RatingUserDto;
} 