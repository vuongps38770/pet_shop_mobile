import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostCommentResDto, PostResDto } from '../../dto/res/post.res.dto';
import { BasePaginationRespondDto } from 'src/presentation/dto/res/pagination-respond.dto';
import { fetchBlogsApi, createPostApi, likeTogglePostApi, getMyPostsApi, getPostByIdApi, getPostCommentsApi } from './api/blog.api';
import { CreatePostDto } from 'src/presentation/dto/req/post.req.dto';

export interface BlogState {
    posts: PostResDto[];
    pagination: BasePaginationRespondDto<PostResDto> | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    myBlogs: PostResDto[]
    fetchMyBlogsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    postCommentsPagination: BasePaginationRespondDto<PostCommentResDto> | null;
    postCommentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchMoreCommentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: BlogState = {
    posts: [],
    pagination: null,
    status: 'idle',
    error: null,
    createStatus: 'idle',
    fetchMyBlogsStatus: 'idle',
    myBlogs: [],
    fetchMoreCommentsStatus: 'idle',
    postCommentsPagination: null,
    postCommentsStatus: 'idle'
};

export const fetchBlogs = createAsyncThunk(
    'blog/fetchBlogs',
    async ({ page, limit }: { page: number; limit: number }) => {
        const response = await fetchBlogsApi({ page, limit });
        console.log(response.data);
        return response.data.data as BasePaginationRespondDto<PostResDto>;
    }
);

export const fetchMoreBlogs = createAsyncThunk(
    'blog/fetchMoreBlogs',
    async ({ page, limit }: { page: number; limit: number }) => {
        const response = await fetchBlogsApi({ page, limit });
        console.log(response.data);
        return response.data.data as BasePaginationRespondDto<PostResDto>;
    }
);


export const createBlogs = createAsyncThunk(
    'blog/createBlogs',
    async ({ data }: { data: CreatePostDto }) => {
        const response = await createPostApi(data);
        return response.data.data
    }
);

export const likePostToggle = createAsyncThunk(
    'blog/likePostToggle',
    async ({ postId }: { postId: string }) => {
        const response = await likeTogglePostApi(postId)
        console.log(response.data);

        return response.data.data as { postId: string, likedByMe: boolean, totalLikes: number };
    }
);
export const fetchMyBlogs = createAsyncThunk(
    'blog/fetchMyBlogs',
    async () => {
        const response = await getMyPostsApi();
        return response.data.data.data as PostResDto[];
    }
);


export const fetchPostById = createAsyncThunk(
    'blog/fetchPostById',
    async ({ postId }: { postId: string }) => {
        const response = await getPostByIdApi(postId);
        return response.data.data.data as PostResDto;
    }
);

export const fetchPostComments = createAsyncThunk(
    'blog/fetchPostComments',
    async ({ postId, page, limit }: { postId: string, page: number, limit: number }) => {
        const response = await getPostCommentsApi(postId, page, limit);
        return response.data.data as BasePaginationRespondDto<PostCommentResDto>;
    }
)

export const fetchMoreComments = createAsyncThunk(
    'blog/fetchMorePostComments',
    async ({ postId, page, limit }: { postId: string, page: number, limit: number }) => {
        const response = await getPostCommentsApi(postId, page, limit);
        return response.data.data as BasePaginationRespondDto<PostCommentResDto>;
    }
)

// export const deletePost = createAsyncThunk(
//     'blog/deletePost'
// )
const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        resetBlogs(state) {
            state.posts = [];
            state.pagination = null;
            state.status = 'idle';
            state.error = null;
        },
        resetCreateStatus(state) {
            state.createStatus = 'idle'
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.data ?? [];
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Fetch blogs failed';
            })
            .addCase(fetchMoreBlogs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMoreBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = [...state.posts, ...action.payload.data ?? []];
                state.pagination = action.payload;
            })
            .addCase(fetchMoreBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Fetch more blogs failed';
            })
            .addCase(createBlogs.pending, (state) => {
                state.createStatus = 'loading';
                state.error = null;
            })
            .addCase(createBlogs.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
            })
            .addCase(createBlogs.rejected, (state, action) => {
                state.createStatus = "failed";
                state.error = action.error.message || 'Đăng bài thất bại';
            })



            .addCase(likePostToggle.fulfilled, (state, action) => {
                const { postId, likedByMe, totalLikes } = action.payload;
                const postIndex = state.posts.findIndex(post => post._id === postId);
                if (postIndex !== -1) {
                    state.posts[postIndex].likedByMe = likedByMe;
                    state.posts[postIndex].totalLikes = totalLikes;
                }
            })

            .addCase(fetchMyBlogs.pending, (state) => {
                state.fetchMyBlogsStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchMyBlogs.fulfilled, (state, action) => {
                state.fetchMyBlogsStatus = 'succeeded';

                state.myBlogs = action.payload;
            })
            .addCase(fetchMyBlogs.rejected, (state, action) => {
                state.fetchMyBlogsStatus = 'failed';
                state.error = action.error.message || 'Fetch my blogs failed';
            })


            .addCase(fetchPostComments.pending, (state) => {
                state.postCommentsStatus = 'loading';
            })
            .addCase(fetchPostComments.fulfilled, (state, action) => {
                state.postCommentsStatus = 'succeeded';
                state.postCommentsPagination = action.payload;
            })
            .addCase(fetchPostComments.rejected, (state, action) => {
                state.postCommentsStatus = 'failed';

                state.error = action.error.message || 'Fetch post comments failed';
            })


            .addCase(fetchMoreComments.pending, (state) => {

                state.fetchMoreCommentsStatus = 'loading';
            })

            .addCase(fetchMoreComments.fulfilled, (state, action) => {
                state.fetchMoreCommentsStatus = 'succeeded';
                const existingData = state.postCommentsPagination?.data ?? [];
                const newData = action.payload.data ?? [];
                state.postCommentsPagination = {
                    ...state.postCommentsPagination,
                    data: [...existingData, ...newData],
                    page: action.payload.page,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages
                };
            })
    },
});

export const { resetBlogs, resetCreateStatus } = blogSlice.actions;
export default blogSlice.reducer;