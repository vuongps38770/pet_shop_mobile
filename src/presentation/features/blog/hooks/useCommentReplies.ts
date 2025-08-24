import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { fetchCommentReplies, fetchMoreCommentReplies } from '../blog.slice';

export const useCommentReplies = (commentId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    commentRepliesPagination,
    commentRepliesStatus,
    fetchMoreCommentRepliesStatus,
  } = useSelector((state: RootState) => state.blog);

  const replies = commentRepliesPagination?.data || [];
  const isLoading = commentRepliesStatus === 'loading';
  const isLoadingMore = fetchMoreCommentRepliesStatus === 'loading';
  const hasMore = commentRepliesPagination ? currentPage < (commentRepliesPagination.totalPages||0) : false;

  const loadReplies = useCallback(async () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setCurrentPage(1);
      await dispatch(fetchCommentReplies({ commentId, page: 1, limit }));
    } else {
      setIsExpanded(false);
    }
  }, [commentId, isExpanded, dispatch]);



  const loadMoreReplies = useCallback(async () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await dispatch(fetchMoreCommentReplies({ commentId, page: nextPage, limit }));
    }
  }, [commentId, hasMore, isLoadingMore, currentPage, dispatch]);

  return {
    replies,
    isExpanded,
    isLoading,
    isLoadingMore,
    hasMore,
    loadReplies,
    loadMoreReplies,
  };
}; 