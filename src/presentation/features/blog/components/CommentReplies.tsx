import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';
import CommentItem from './CommentItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { fetchMoreCommentReplies } from '../blog.slice';

interface CommentRepliesProps {
  commentId: string;
  onUserPress?: (userId: string) => void;
  onLikePress?: (commentId: string) => void;
  onReplyPress?: (comment: PostCommentResDto) => void;
  onDeletePress?: (commentId: string) => void;
  onHideReplies?: (commentId: string) => void;
}

const CommentReplies: React.FC<CommentRepliesProps> = ({
  commentId,
  onUserPress,
  onLikePress,
  onReplyPress,
  onDeletePress,
  onHideReplies,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { postCommentsPagination, fetchMoreCommentRepliesStatus } = useSelector((state: RootState) => state.blog);
  
  // Tìm comment gốc và lấy replies từ Redux state
  const rootComment = postCommentsPagination?.data?.find(comment => comment._id === commentId);
  const replies = rootComment?.replies || [];
  const replyCount = rootComment?.replyCount || 0;
  const isLoadingMore = fetchMoreCommentRepliesStatus === 'loading';
  const hasMore = replies.length < replyCount;

  console.log('CommentReplies Debug:', {
    commentId,
    repliesCount: replies.length,
    replyCount,
    hasMore,
    replies: replies.map(r => ({ id: r._id, content: r.content }))
  });

  const handleLoadMore = async () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = Math.floor(replies.length / 10) + 1;
      await dispatch(fetchMoreCommentReplies({ commentId, page: nextPage, limit: 10 }));
    }
  };

  if (replies.length === 0) {
    console.log('CommentReplies: No replies to show');
    return null;
  }

  console.log('CommentReplies: Rendering', replies.length, 'replies');

  return (
    <View style={styles.container}>
      {replies.map((item) => (
        <View key={item._id} style={styles.replyContainer}>
          <CommentItem
            comment={item}
            onUserPress={onUserPress}
            onLikePress={onLikePress}
            onReplyPress={onReplyPress}
            onDeletePress={onDeletePress}
          />
        </View>
      ))}
      
      {hasMore && (
        <TouchableOpacity 
          style={styles.loadMoreButton} 
          onPress={handleLoadMore}
          disabled={isLoadingMore}
        >
          <Text style={styles.loadMoreText}>
            {isLoadingMore ? 'Đang tải...' : `Tải thêm phản hồi (${replies.length}/${replyCount})`}
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={styles.hideRepliesButton} 
        onPress={() => onHideReplies?.(commentId)}
      >
        <Text style={styles.hideRepliesText}>Ẩn phản hồi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: SPACING.L,
    borderLeftWidth: 2,
    borderLeftColor: colors.grey[200],
  },
  replyContainer: {
    marginBottom: SPACING.XS,
  },
  loadMoreButton: {
    paddingVertical: SPACING.S,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 12,
    color: colors.blue.main,
    fontWeight: '500',
  },
  hideRepliesButton: {
    paddingVertical: SPACING.S,
    alignItems: 'center',
    marginTop: SPACING.XS,
  },
  hideRepliesText: {
    fontSize: 12,
    color: colors.red.main,
    fontWeight: '500',
  },
});

export default CommentReplies; 