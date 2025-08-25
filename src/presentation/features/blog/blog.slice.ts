import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostCommentResDto, PostResDto } from '../../dto/res/post.res.dto';
import { BasePaginationRespondDto } from 'src/presentation/dto/res/pagination-respond.dto';
import { fetchBlogsApi, createPostApi,deletePostApi, likeTogglePostApi, getMyPostsApi, getPostByIdApi, getPostCommentsApi, createCommentApi, deleteCommentApi, getCommentReplyApi, likeToggleCommentApi } from './api/blog.api';
import { CreatePostDto, CreatePostCommentDto } from 'src/presentation/dto/req/post.req.dto';


export interface CommentWithReplies extends PostCommentResDto {
  replies: PostCommentResDto[];
  isExpanded?: boolean;
}

export interface BlogState {
    posts: PostResDto[];
    pagination: BasePaginationRespondDto<PostResDto> | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    myBlogs: PostResDto[]
    fetchMyBlogsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    postCommentsPagination: BasePaginationRespondDto<CommentWithReplies> | null;
    postCommentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchMoreCommentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    // Comment states
    createCommentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    deleteCommentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    commentRepliesPagination: BasePaginationRespondDto<PostCommentResDto> | null;
    commentRepliesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchMoreCommentRepliesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    likeCommentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    commentLoadingList: string[];
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
    postCommentsStatus: 'idle',
    // Comment states
    createCommentStatus: 'idle',
    deleteCommentStatus: 'idle',
    commentRepliesPagination: null,
    commentRepliesStatus: 'idle',
    fetchMoreCommentRepliesStatus: 'idle',
    likeCommentStatus: 'idle',
    commentLoadingList: [],
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
        console.log("userr",response.data.data.data[0].user);
        
        const mappedData = response.data.data.data.map((item: any) => {
          const userData = item.user || item.userId;
          const mappedItem = {
            _id: item._id,
            postId: item.postId,
            parent_id: item.parent_id,
            root_id: item.root_id,
            content: item.content,
            likeList: item.likeList || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            __v: item.__v,
            user: {
              _id: userData._id,
              name: userData.name,
              avatar: userData.avatar
            },
            replyCount: item.replyCount,
            replyRegex: item.replyRegex
          };
          
          console.log('fetchPostComments mapped item:', {
            original: item,
            userData,
            mapped: mappedItem
          });
          
          return mappedItem;
        });
        
        return {
            ...response.data.data,
            data: mappedData
        } as BasePaginationRespondDto<PostCommentResDto>;
    }
)

export const fetchMoreComments = createAsyncThunk(
    'blog/fetchMorePostComments',
    async ({ postId, page, limit }: { postId: string, page: number, limit: number }) => {
        const response = await getPostCommentsApi(postId, page, limit);
        const mappedData = response.data.data.data.map((item: any) => {
          const userData = item.user || item.userId;
          return {
            _id: item._id,
            postId: item.postId,
            parent_id: item.parent_id,
            root_id: item.root_id,
            content: item.content,
            likeList: item.likeList || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            __v: item.__v,
            user: {
              _id: userData._id,
              name: userData.name,
              avatar: userData.avatar
            },
            replyCount: item.replyCount,
            replyRegex: item.replyRegex
          };
        });
        
        return {
            ...response.data.data,
            data: mappedData
        } as BasePaginationRespondDto<PostCommentResDto>;
    }
)

export const createComment = createAsyncThunk(
    'blog/createComment',
    async ({ data }: { data: CreatePostCommentDto }) => {
        const response = await createCommentApi(data);
        const commentData = response.data.data;
        
        // Xử lý cả trường hợp user và userId
        const userData = commentData.user || commentData.userId;
        
        // Map dữ liệu từ API response sang PostCommentResDto format
        return {
            _id: commentData._id,
            postId: commentData.postId,
            parent_id: commentData.parent_id,
            root_id: commentData.root_id,
            content: commentData.content,
            likeList: commentData.likeList || [],
            createdAt: commentData.createdAt,
            updatedAt: commentData.updatedAt,
            __v: commentData.__v,
            user: {
                _id: userData._id,
                name: userData.name,
                avatar: userData.avatar
            },
            replyCount: commentData.replyCount,
            replyRegex: commentData.replyRegex
        } as PostCommentResDto;
    }
);

export const deleteComment = createAsyncThunk(
    'blog/deleteComment',
    async ({ commentId }: { commentId: string }) => {
        await deleteCommentApi(commentId);
        return commentId;
    }
);

export const fetchCommentReplies = createAsyncThunk(
    'blog/fetchCommentReplies',
    async ({ commentId, page, limit }: { commentId: string, page: number, limit: number }) => {
        const response = await getCommentReplyApi(commentId, page, limit);
        let repliesData = [];
        if (response.data && response.data.data) {
            if (Array.isArray(response.data.data)) {
                repliesData = response.data.data;
            } else if (typeof response.data.data === 'object') {
                repliesData = response.data.data.replies || response.data.data.data || [];
            }
        }
        
        console.log("repliesData:", repliesData);
        
        const mappedData = repliesData.map((item: any) => {
          const userData = item.user || item.userId;
          return {
            _id: item._id,
            postId: item.postId,
            parent_id: item.parent_id,
            root_id: item.root_id,
            content: item.content,
            likeList: item.likeList || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            __v: item.__v,
            user: {
              _id: userData._id,
              name: userData.name,
              avatar: userData.avatar
            },
            replyCount: item.replyCount,
            replyRegex: item.replyRegex
          };
        });
        
        console.log('fetchCommentReplies mapped data:', mappedData);
        
        return {
            commentId,
            data: {
                ...response.data,
                data: mappedData
            }
        };
    }
);

export const fetchMoreCommentReplies = createAsyncThunk(
    'blog/fetchMoreCommentReplies',
    async ({ commentId, page, limit }: { commentId: string, page: number, limit: number }) => {
        const response = await getCommentReplyApi(commentId, page, limit);
        
        const mappedData = response.data.data.map((item: any) => {
          const userData = item.user || item.userId;
          
          return {
            _id: item._id,
            postId: item.postId,
            parent_id: item.parent_id,
            root_id: item.root_id,
            content: item.content,
            likeList: item.likeList || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            __v: item.__v,
            user: {
              _id: userData._id,
              name: userData.name,
              avatar: userData.avatar
            },
            replyCount: item.replyCount,
            replyRegex: item.replyRegex
          };
        });
        
        return {
            commentId,
            data: {
                ...response.data,
                data: mappedData
            }
        };
    }
);

export const likeToggleComment = createAsyncThunk(
    'blog/likeToggleComment',
    async ({ commentId }: { commentId: string }) => {
        const response = await likeToggleCommentApi(commentId);
        return response.data.data as { commentId: string, likedByMe: boolean, totalLikes: number };
    }
);

export const deletePost = createAsyncThunk(
    'blog/deletePost',
    async ({ postId }: { postId: string }) => {
        const response = await deletePostApi(postId);
        return  { postId };
    }
)
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
        },
        resetCommentStatuses(state) {
            state.createCommentStatus = 'idle';
            state.deleteCommentStatus = 'idle';
            state.commentRepliesStatus = 'idle';
            state.fetchMoreCommentRepliesStatus = 'idle';
            state.likeCommentStatus = 'idle';
        },
        toggleCommentExpanded(state, action) {
            const { commentId } = action.payload;
            if (state.postCommentsPagination?.data) {
                const commentIndex = state.postCommentsPagination.data.findIndex(
                    comment => comment._id === commentId
                );
                if (commentIndex !== -1) {
                    state.postCommentsPagination.data[commentIndex].isExpanded = 
                        !state.postCommentsPagination.data[commentIndex].isExpanded;
                }
            }
        },
        resetComment(state){
            state.postCommentsPagination = null;
            state.postCommentsStatus = 'idle';
            state.fetchMoreCommentsStatus = 'idle';
            state.commentLoadingList = [];
            state.fetchMoreCommentRepliesStatus = 'idle';
            state.commentRepliesStatus = 'idle';
            state.commentRepliesPagination = null;
            state.createCommentStatus = 'idle';
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

            .addCase(deletePost.fulfilled, (state, action) => {
                const { postId } = action.payload;
                state.posts = state.posts.filter(post => post._id !== postId);
                state.myBlogs = state.myBlogs.filter(post => post._id !== postId);
            })
            .addCase(createComment.pending, (state) => {
                state.createCommentStatus = 'loading';
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.createCommentStatus = 'succeeded';
                
                if (state.postCommentsPagination?.data) {
                    if (!action.payload.parent_id) {
                        state.postCommentsPagination.data.unshift({
                            ...action.payload,
                            replies: [],
                            isExpanded: false
                        });
                    } else {
                        const rootCommentIndex = state.postCommentsPagination.data.findIndex(
                            comment => comment._id === action.payload.root_id
                        );
                        if (rootCommentIndex !== -1) {
                            if (!state.postCommentsPagination.data[rootCommentIndex].replies) {
                                state.postCommentsPagination.data[rootCommentIndex].replies = [];
                            }
                            state.postCommentsPagination.data[rootCommentIndex].replies.push(action.payload);
                            
                            state.postCommentsPagination.data[rootCommentIndex].replyCount = 
                                (state.postCommentsPagination.data[rootCommentIndex].replyCount || 0) + 1;
                            
                            state.postCommentsPagination.data[rootCommentIndex].isExpanded = true;
                            
                            console.log('Added reply to root comment:', {
                                rootCommentId: action.payload.root_id,
                                replyId: action.payload._id,
                                newReplyCount: state.postCommentsPagination.data[rootCommentIndex].replyCount,
                                isExpanded: state.postCommentsPagination.data[rootCommentIndex].isExpanded
                            });
                        }
                    }
                }
            })
            .addCase(createComment.rejected, (state, action) => {
                state.createCommentStatus = 'failed';
                state.error = action.error.message || 'Tạo comment thất bại';
            })

            // Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.deleteCommentStatus = 'loading';
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.deleteCommentStatus = 'succeeded';
                // Xóa comment khỏi danh sách
                if (state.postCommentsPagination?.data) {
                    // Xóa comment gốc
                    state.postCommentsPagination.data = state.postCommentsPagination.data.filter(
                        comment => comment._id !== action.payload
                    );
                    
                    // Xóa reply khỏi replies của comment gốc và giảm replyCount
                    state.postCommentsPagination.data.forEach(comment => {
                        const hasReply = comment.replies.some(reply => reply._id === action.payload);
                        if (hasReply) {
                            comment.replies = comment.replies.filter(reply => reply._id !== action.payload);
                            comment.replyCount = Math.max(0, (comment.replyCount || 0) - 1);
                        }
                    });
                }
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.deleteCommentStatus = 'failed';
                state.error = action.error.message || 'Xóa comment thất bại';
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
                const commentsWithReplies: CommentWithReplies[] = (action.payload.data || []).map(comment => ({
                    ...comment,
                    replies: [],
                    isExpanded: false
                }));
                state.postCommentsPagination = {
                    ...action.payload,
                    data: commentsWithReplies
                };
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
                const newData: CommentWithReplies[] = (action.payload.data ?? []).map(comment => ({
                    ...comment,
                    replies: [],
                    isExpanded: false
                }));
                state.postCommentsPagination = {
                    ...state.postCommentsPagination,
                    data: [...existingData, ...newData],
                    page: action.payload.page,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages
                };
            })

            // Comment replies
            .addCase(fetchCommentReplies.pending, (state,action) => {
                console.log('fetchCommentReplies.pending');
                state.commentRepliesStatus = 'loading';
                state.commentLoadingList =[...state.commentLoadingList, action.meta.arg.commentId]
            })
            .addCase(fetchCommentReplies.fulfilled, (state, action) => {
                console.log('fetchCommentReplies.fulfilled called');
                state.commentRepliesStatus = 'succeeded';
                const { commentId, data } = action.payload;
                console.log('fetchCommentReplies.fulfilled:', {
                    commentId,
                    repliesCount: data.data?.length || 0,
                    replies: data.data
                });
                
                if (state.postCommentsPagination?.data) {
                    const rootCommentIndex = state.postCommentsPagination.data.findIndex(
                        comment => comment._id === commentId
                    );
                    if (rootCommentIndex !== -1) {
                        state.postCommentsPagination.data[rootCommentIndex].replies = data.data || [];
                        state.postCommentsPagination.data[rootCommentIndex].isExpanded = true;
                    }
                    state.commentLoadingList = state.commentLoadingList.filter(id => id !== commentId);
                }
            })
            .addCase(fetchCommentReplies.rejected, (state, action) => {
                console.log('fetchCommentReplies.rejected:', action.error);
                state.commentRepliesStatus = 'failed';
                state.error = action.error.message || 'Fetch comment replies failed';
            })
            .addCase(fetchMoreCommentReplies.pending, (state) => {
                state.fetchMoreCommentRepliesStatus = 'loading';
            })
            .addCase(fetchMoreCommentReplies.fulfilled, (state, action) => {
                state.fetchMoreCommentRepliesStatus = 'succeeded';
                const { commentId, data } = action.payload;
                if (state.postCommentsPagination?.data) {
                    const rootCommentIndex = state.postCommentsPagination.data.findIndex(
                        comment => comment._id === commentId
                    );
                    if (rootCommentIndex !== -1) {
                        const existingReplies = state.postCommentsPagination.data[rootCommentIndex].replies;
                        const newReplies = data.data || [];
                        state.postCommentsPagination.data[rootCommentIndex].replies = [...existingReplies, ...newReplies];
                    }
                }
            })
            .addCase(likeToggleComment.fulfilled, (state, action) => {
                const { commentId, likedByMe, totalLikes } = action.payload;
                if (state.postCommentsPagination?.data) {
                    const commentIndex = state.postCommentsPagination.data.findIndex(comment => comment._id === commentId);
                    if (commentIndex !== -1) {
                        // Cập nhật likeList dựa trên likedByMe
                        if (likedByMe) {
                            // Thêm user hiện tại vào likeList nếu chưa có
                            if (!state.postCommentsPagination.data[commentIndex].likeList.includes(commentId)) {
                                state.postCommentsPagination.data[commentIndex].likeList.push(commentId);
                            }
                        } else {
                            // Xóa user hiện tại khỏi likeList
                            state.postCommentsPagination.data[commentIndex].likeList = state.postCommentsPagination.data[commentIndex].likeList.filter(id => id !== commentId);
                        }
                    }
                }
            })
            .addCase(toggleCommentExpanded, (state, action) => {
                const { commentId } = action.payload;
                if (state.postCommentsPagination?.data) {
                    const commentIndex = state.postCommentsPagination.data.findIndex(comment => comment._id === commentId);
                    if (commentIndex !== -1) {
                        state.postCommentsPagination.data[commentIndex].isExpanded = !state.postCommentsPagination.data[commentIndex].isExpanded;
                        console.log('toggleCommentExpanded:', {
                            commentId,
                            newIsExpanded: state.postCommentsPagination.data[commentIndex].isExpanded
                        });
                    }
                }
            })
    },
});

export const { resetBlogs, resetCreateStatus, resetCommentStatuses, toggleCommentExpanded,resetComment } = blogSlice.actions;
export default blogSlice.reducer;