import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { createComment, deleteComment, likeToggleComment, resetCommentStatuses, toggleCommentExpanded } from '../blog.slice';
import { CreatePostCommentDto } from 'src/presentation/dto/req/post.req.dto';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';
import { useUserInfo } from 'shared/hooks/useUserInfo';

export const useComment = (postId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUserInfo();
  const [replyTo, setReplyTo] = useState<PostCommentResDto | null>(null);
  const [commentText, setCommentText] = useState('');

  const {
    createCommentStatus,
    deleteCommentStatus,
    likeCommentStatus,
  } = useSelector((state: RootState) => state.blog);

  const isLoading = createCommentStatus === 'loading' || deleteCommentStatus === 'loading' || likeCommentStatus === 'loading';

  const handleCreateComment = useCallback(async () => {
    if (!commentText.trim() || !user) return;

    // Xác định parent_id và root_id
    let parent_id = null;
    let root_id = null;
    let replyRegex = undefined;

    if (replyTo) {
      parent_id = replyTo._id;
      root_id = replyTo.root_id || replyTo._id;
      
      // Tất cả reply đều phải có @tên và regex
      replyRegex = `@${replyTo.user.name} `;
      console.log('Replying to:', { parent_id, root_id, replyRegex, replyToName: replyTo.user.name });
    }

    const commentData: CreatePostCommentDto = {
      content: commentText.trim(),
      postId,
      parent_id,
      root_id,
      replyRegex,
    };

    console.log('Creating comment with data:', commentData);
    console.log('ReplyTo info:', {
      replyToId: replyTo?._id,
      replyToName: replyTo?.user.name,
      replyToRootId: replyTo?.root_id,
      replyToParentId: replyTo?.parent_id,
      isReplyToReply: replyTo?.parent_id && replyTo?.parent_id !== replyTo?.root_id,
      commentText: commentText.trim()
    });

    try {
      await dispatch(createComment({ data: commentData })).unwrap();
      setCommentText('');
      setReplyTo(null);
      dispatch(resetCommentStatuses());
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  }, [commentText, postId, replyTo, user, dispatch]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      await dispatch(deleteComment({ commentId })).unwrap();
      dispatch(resetCommentStatuses());
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }, [dispatch]);

  const handleLikeComment = useCallback(async (commentId: string) => {
    try {
      await dispatch(likeToggleComment({ commentId })).unwrap();
      dispatch(resetCommentStatuses());
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  }, [dispatch]);

  const handleReplyToComment = useCallback((comment: PostCommentResDto) => {
    setReplyTo(comment);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const handleToggleExpanded = useCallback((commentId: string) => {
    dispatch(toggleCommentExpanded({ commentId }));
  }, [dispatch]);

  const isMyComment = useCallback((comment: PostCommentResDto) => {
    return user?._id === comment.user._id;
  }, [user]);

  return {
    commentText,
    setCommentText,
    replyTo,
    isLoading,
    handleCreateComment,
    handleDeleteComment,
    handleLikeComment,
    handleReplyToComment,
    handleCancelReply,
    handleToggleExpanded,
    isMyComment,
  };
}; 