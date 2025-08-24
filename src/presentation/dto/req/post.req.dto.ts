export enum PostMediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}


export type CreatePostDto = {
    content:string
    medias?:CreatePostMediaDto[]
}

export type CreatePostMediaDto = {
    type: (keyof typeof PostMediaType);
    file:UploadFile
}


type UploadFile = {
  uri: string;     
  name: string;    
  mimeType: string;
};

export class UpdatePostDto {
    content?: string;
    mediasToAdd?: CreatePostMediaDto[];
    mediasToRemove?: string[];
}


export type CreatePostCommentDto = {
    content:string
    parent_id: string | null;
    root_id: string | null;
    postId: string;
    replyRegex?:string
}
