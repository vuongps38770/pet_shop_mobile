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
  const { commentRepliesStatus, commentLoadingList } = useSelector((state: RootState) => state.blog);
  const hasReplies = comment.replyCount && comment.replyCount > 0;
  const isExpanded = comment.isExpanded || false;
  const isLoading = commentLoadingList.includes(comment._id)
  const hasLoadedReplies = comment.replies && comment.replies.length > 0;


  const handleViewRepliesPress = () => {
  if (hasReplies && !hasLoadedReplies) {
    onToggleExpanded?.(comment._id);
    dispatch(fetchCommentReplies({ commentId: comment._id, page: 1, limit: 10 }));
  } else {
    onToggleExpanded?.(comment._id);
  }
};


  const shouldShowReplies = isExpanded && (hasLoadedReplies || isLoading);
  

  return (
    <View style={styles.container}>
      <CommentItem
        comment={comment}
        onUserPress={onUserPress}
        onLikePress={onLikePress}
        onReplyPress={onReplyPress}
        onDeletePress={onDeletePress}
        onViewRepliesPress={handleViewRepliesPress}
        showReplies={isExpanded}
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
