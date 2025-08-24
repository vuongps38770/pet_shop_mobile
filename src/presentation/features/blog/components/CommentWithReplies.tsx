import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';
import CommentItem from './CommentItem';
import CommentReplies from './CommentReplies';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { CommentWithReplies as CommentWithRepliesType, fetchCommentReplies } from '../blog.slice';

interface CommentWithRepliesProps {
  comment: CommentWithRepliesType;
  onUserPress?: (userId: string) => void;
  onLikePress?: (commentId: string) => void;
  onReplyPress?: (comment: PostCommentResDto) => void;
  onDeletePress?: (commentId: string) => void;
  onToggleExpanded?: (commentId: string) => void;
}

const CommentWithReplies: React.FC<CommentWithRepliesProps> = ({
  comment,
  onUserPress,
  onLikePress,
  onReplyPress,
  onDeletePress,
  onToggleExpanded,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { commentRepliesStatus } = useSelector((state: RootState) => state.blog);
  const hasReplies = comment.replyCount && comment.replyCount > 0;
  const isExpanded = comment.isExpanded || false;
  const isLoading = commentRepliesStatus === 'loading';
  const hasLoadedReplies = comment.replies && comment.replies.length > 0;

  // Debug logs
  console.log('CommentWithReplies Debug:', {
    commentId: comment._id,
    hasReplies,
    isExpanded,
    hasLoadedReplies,
    repliesCount: comment.replies?.length || 0,
    replyCount: comment.replyCount
  });

  const handleViewRepliesPress = async () => {
    console.log('handleViewRepliesPress called:', {
      isExpanded,
      hasReplies,
      hasLoadedReplies
    });
    
    if (hasReplies && !hasLoadedReplies) {
      // Nếu có replies nhưng chưa load, fetch từ API trước
      console.log('Fetching replies for comment:', comment._id);
      const result = await dispatch(fetchCommentReplies({ commentId: comment._id, page: 1, limit: 10 }));
      
      // Kiểm tra kết quả fetch
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('Fetch replies successful, now expanding');
        // Sau khi fetch thành công mới toggle expanded
        onToggleExpanded?.(comment._id);
      } else {
        console.log('Fetch replies failed');
      }
    } else {
      // Nếu đã có replies hoặc không có replies, toggle ngay
      onToggleExpanded?.(comment._id);
    }
  };

  // Hiển thị replies nếu đã expand và có replies được load
  // Hoặc đang loading để fetch replies
  const shouldShowReplies = isExpanded && (hasLoadedReplies || isLoading);
  
  console.log('shouldShowReplies:', shouldShowReplies, {
    hasReplies,
    isExpanded,
    hasLoadedReplies,
    isLoading,
    commentId: comment._id
  });

  return (
    <View style={styles.container}>
      <CommentItem
        comment={comment}
        onUserPress={onUserPress}
        onLikePress={onLikePress}
        onReplyPress={onReplyPress}
        onDeletePress={onDeletePress}
        onViewRepliesPress={handleViewRepliesPress}
        showReplies={hasLoadedReplies}
        isLoadingReplies={isLoading}
      />
      
      {shouldShowReplies && (
        <CommentReplies
          commentId={comment._id}
          onUserPress={onUserPress}
          onLikePress={onLikePress}
          onReplyPress={onReplyPress}
          onDeletePress={onDeletePress}
          onHideReplies={onToggleExpanded}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});

export default CommentWithReplies;
