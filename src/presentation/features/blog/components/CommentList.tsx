import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CommentWithReplies as CommentWithRepliesType } from '../blog.slice';
import CommentWithReplies from './CommentWithReplies';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';

interface CommentListProps {
  comments: CommentWithRepliesType[];
  onUserPress?: (userId: string) => void;
  onLikePress?: (commentId: string) => void;
  onReplyPress?: (comment: PostCommentResDto) => void;
  onDeletePress?: (commentId: string) => void;
  onToggleExpanded?: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onUserPress,
  onLikePress,
  onReplyPress,
  onDeletePress,
  onToggleExpanded,
}) => {
  return (
    <View style={styles.container}>
      {comments.map((item) => (
        <CommentWithReplies
          key={item._id}
          comment={item}
          onUserPress={onUserPress}
          onLikePress={onLikePress}
          onReplyPress={onReplyPress}
          onDeletePress={onDeletePress}
          onToggleExpanded={onToggleExpanded}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  commentContainer: {
    marginBottom: 8,
  },
});

export default CommentList; 