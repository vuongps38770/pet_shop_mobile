import { PostMediaType } from "../req/post.req.dto";

export type MediaResDto = {
  _id: string;

  postId: string;

  type: PostMediaType;

  url: string;

  createdAt: string;

  updatedAt: string;

}


export type PostResDto = {
  _id: string;

  user:{
    _id:string,
    name:string,
    avatar:string
  }

  content: string;

  createdAt: string;

  updatedAt: string;

  status: PostStatus;

  mediaList?: MediaResDto[];

  totalLikes?: number;

  likedByMe?: boolean;
}

export enum PostStatus{
    PENDING="PENDING",
    UPLOADED="UPLOADED",
    VERIFIED="VERIFIED",
    REJECTED="REJECTED"
}



export interface PostCommentResDto {
  _id: string;
  postId: string;
  parent_id: string | null;
  root_id: string | null;
  content: string;
  likeList: string[];  
  createdAt: string;   
  updatedAt: string;   
  __v: number;
  user:{
    _id:string,
    name:string,
    avatar:string
  }
  replyCount?: number;
  replyRegex?:string
}