import axiosInstance from "app/config/axios";
import { CreatePostCommentDto, CreatePostDto } from "src/presentation/dto/req/post.req.dto";

export const fetchBlogsApi = async (params: { page: number, limit: number }) => {
    return await axiosInstance.get('post/explore', { params });
}

export const createPostApi = async (data: CreatePostDto) => {
    // console.log(JSON.stringify(data));

    const formData = new FormData();
    formData.append("content", data.content);
    if (Array.isArray(data.medias) && data.medias.length > 0) {
        data.medias.forEach((media, index) => {
            formData.append("types[]", media.type);
            formData.append("files", {
                uri: media.file.uri,
                name: media.file.uri.split("/").pop() || "file",
                type: media.file.mimeType,
            } as any);
        });
    }
    return axiosInstance.post("/post/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 10 * 60 * 1000,
    });
}

export const likeTogglePostApi = async (postId: string) => {
    return axiosInstance.post(`/post/like/${postId}`);
}

export const deletePostApi = async (postId: string) => {
    return axiosInstance.delete(`/post/delete/${postId}`);
}
export const getMyPostsApi = async () => {
    return await axiosInstance.get('post/my');
}

export const getPostByIdApi = async (postId: string)=> {
    return await axiosInstance.get(`post/${postId}`);
}

export const getPostCommentsApi = async (postId: string,page:number,limit:number)=> {
    return await axiosInstance.get(`post/comment/${postId}?page=${page}&limit=${limit}`);
}

export const createCommentApi = async (dto:CreatePostCommentDto)=> {
    return await axiosInstance.post(`post/comment`,dto);
}

export const deleteCommentApi = async (commentId: string) => {
    return await axiosInstance.delete(`post/comment/${commentId}`);
}

export const getCommentReplyApi = async (commentId: string, page: number, limit: number) => {
    return await axiosInstance.get(`post/comment-reply/${commentId}?page=${page}&limit=${limit}`);
}

export const likeToggleCommentApi = async (commentId: string) => {
    return await axiosInstance.post(`post/comment/like/${commentId}`);
}